import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const categories = ['macbook', 'notebooks', 'tablets', 'realme'];
  
  for (const cat of categories) {
    const products = await Product.find({ category: cat }).select('name').lean();
    console.log(`\n--- Category: ${cat} (${products.length} products) ---`);
    products.forEach(p => console.log(`- ${p.name}`));
  }

  process.exit(0);
}

run().catch(console.error);
