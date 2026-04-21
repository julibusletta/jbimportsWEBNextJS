import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
      name: String,
      category: String,
      specs: Object,
      price: Number,
      costPrice: Number,
      color: String,
      storage: String,
      ram: String
    }, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    
    console.log(`Found ${products.length} products in Xiaomi category.`);

    const seen = new Map();
    const duplicates = [];

    for (const p of products) {
      // Create a unique key based on name, color, storage, ram
      // Some products might have these in specs object or as top level fields
      const name = p.name.trim();
      const storage = (p.storage || p.specs?.storage || '').toString().trim();
      const ram = (p.ram || p.specs?.ram || '').toString().trim();
      const color = (p.color || p.specs?.color || '').toString().trim();
      
      const key = `${name}|${storage}|${ram}|${color}`.toLowerCase();
      
      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: p
        });
      } else {
        seen.set(key, p);
      }
    }

    if (duplicates.length === 0) {
      console.log('No duplicates found.');
    } else {
      console.log(`Found ${duplicates.length} duplicates:`);
      duplicates.forEach((d, i) => {
        console.log(`${i + 1}. Duplicated: "${d.duplicate.name}" (ID: ${d.duplicate._id})`);
        console.log(`   Key: ${d.duplicate.name} | ${d.duplicate.storage || ''} | ${d.duplicate.ram || ''} | ${d.duplicate.color || ''}`);
        console.log(`   Original ID: ${d.original._id}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
