import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import https from 'https';

const uri = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";
const TARGET_DIR = path.join(process.cwd(), 'public', 'images', 'products');

// Create images directory if it doesn't exist
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Helper to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Convert name to Tiendanube-like slug
function toSlug(name) {
  return name.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/'/g, '') // remove quotes like in 13.6'
    .replace(/"/g, '')
    .replace(/[^a-z0-9]+/g, '-') // convert spaces and special chars to hyphens
    .replace(/(^-|-$)/g, ''); // remove leading/trailing hyphens
}

async function run() {
  console.log('Fetching live sitemap...');
  const res = await fetch('https://jbimports.com.ar/sitemap-ecommerce-es-ar.xml');
  const xml = await res.text();

  // Extract <url> blocks
  const urlBlocks = xml.split('<url>');
  const remoteProducts = [];

  for (const block of urlBlocks) {
    const locMatch = block.match(/<loc>(.*?)<\/loc>/);
    const imgMatch = block.match(/<image:loc>(.*?)<\/image:loc>/);
    if (locMatch && imgMatch) {
      const url = locMatch[1];
      const imageUrl = imgMatch[1];
      const slug = url.split('/').pop();
      remoteProducts.push({ slug, imageUrl });
    }
  }

  console.log(`Found ${remoteProducts.length} image mappings from live site.`);

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); // assuming test is active
    const collection = db.collection('products');
    const localProducts = await collection.find({}).toArray();
    
    console.log(`Checking ${localProducts.length} local products...`);
    let updatedCount = 0;

    for (const localProd of localProducts) {
      // Create variations of slug to improve matching
      const pSlug = toSlug(localProd.name);
      // Sometimes 13.6' becomes 13-6 or 136
      const pSlug2 = toSlug(localProd.name.replace(/\./g, ''));
      
      const match = remoteProducts.find(r => r.slug === pSlug || r.slug === pSlug2 || pSlug.includes(r.slug) || r.slug.includes(pSlug));

      if (match) {
        console.log(`[MATCH] ${localProd.name} -> ${match.slug}`);
        
        // Download Image
        const ext = match.imageUrl.split('.').pop().split('?')[0] || 'jpg';
        const filename = `${match.slug}.${ext}`;
        const filepath = path.join(TARGET_DIR, filename);
        
        try {
          await downloadImage(match.imageUrl, filepath);
          const finalUrl = `/images/products/${filename}`;
          
          // Update database
          await collection.updateOne(
            { _id: localProd._id },
            { $set: { image: finalUrl, images: [finalUrl] } }
          );
          updatedCount++;
          console.log(`  -> Downloaded and updated DB: ${finalUrl}`);
        } catch (err) {
          console.error(`  -> Failed to download ${match.imageUrl}: ${err.message}`);
        }
      } else {
        console.log(`[NO MATCH] ${localProd.name} (tried slug: ${pSlug})`);
      }
    }
    
    console.log(`Finished! Updated ${updatedCount} products.`);

  } finally {
    await client.close();
  }
}

run().catch(console.error);
