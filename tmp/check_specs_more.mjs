import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const prods = await Product.find({ category: 'xiaomi-robots' }).lean();
  console.log(`\n--- Category: xiaomi-robots ---`);
  console.log(`Found ${prods.length} products.`);
  
  prods.forEach(p => {
    console.log(`Product: ${p.name} (ID: ${p.id})`);
    if (p.specifications) {
      console.log(`Specifications: ${p.specifications.length} items`);
    } else {
      console.log('Specifications: MISSING');
    }
  });

  // Check Apple Watch too
  const watches = await Product.find({ category: 'apple-watch' }).lean();
  console.log(`\n--- Category: apple-watch ---`);
  console.log(`Found ${watches.length} products.`);
  watches.forEach(p => {
    console.log(`Product: ${p.name} (ID: ${p.id})`);
    if (p.specifications) {
      console.log(`Specifications: ${p.specifications.length} items`);
    } else {
      console.log('Specifications: MISSING');
    }
  });
  
  process.exit(0);
}

run().catch(console.error);
