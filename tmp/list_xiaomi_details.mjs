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

    const products = await Product.find({ category: 'xiaomi' }).sort({ name: 1 }).lean();
    
    console.log(`Found ${products.length} products in Xiaomi category.`);

    for (const p of products) {
      const storage = (p.storage || p.specs?.storage || p.specs?.['Capacidad de Almacenamiento'] || '').toString().trim();
      const ram = (p.ram || p.specs?.ram || p.specs?.['Memoria RAM'] || '').toString().trim();
      const color = (p.color || p.specs?.color || p.specs?.['Color'] || '').toString().trim();
      
      console.log(`ID: ${p._id} | Name: ${p.name.padEnd(40)} | Specs: ${storage.padEnd(10)} | ${ram.padEnd(5)} | Color: ${color}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
