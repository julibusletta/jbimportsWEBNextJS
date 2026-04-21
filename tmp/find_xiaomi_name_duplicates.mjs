import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
      name: String,
      category: String
    }, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    
    console.log(`Found ${products.length} products in Xiaomi category.`);

    const seen = new Map();
    const duplicates = [];

    for (const p of products) {
      const nameKey = p.name.trim().toLowerCase();
      
      if (seen.has(nameKey)) {
        duplicates.push({
          original: seen.get(nameKey),
          duplicate: p
        });
      } else {
        seen.set(nameKey, p);
      }
    }

    if (duplicates.length === 0) {
      console.log('No duplicates found by exact name.');
    } else {
      console.log(`Found ${duplicates.length} duplicates by exact name:`);
      duplicates.forEach((d, i) => {
        console.log(`${i + 1}. Name: "${d.duplicate.name}"`);
        console.log(`   ID to delete: ${d.duplicate._id}`);
        console.log(`   ID to keep:   ${d.original._id}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
