import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ category: String, specifications: Array, name: String, id: String }, { strict: false }));
  
  const categoriesToCheck = ['xiaomi', 'samsung', 'realme'];
  
  for (const cat of categoriesToCheck) {
    const prods = await Product.find({ category: cat }).limit(5).lean();
    console.log(`\n--- Category: ${cat} ---`);
    if (prods.length === 0) { console.log('No products found.'); continue; }
    prods.forEach(p => {
      console.log(`Product: ${p.name}`);
      if (p.specifications && p.specifications.length > 0) {
        console.log(`- Specifications count: ${p.specifications.length}`);
      } else {
        console.log(`- Specifications: MISSING`);
      }
    });
  }

  process.exit(0);
}

run().catch(console.error);
