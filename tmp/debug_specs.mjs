import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  // Check some categories that were recently enriched
  const categories = ['xiaomi-robots', 'iphone', 'apple-watch', 'motorola'];
  
  for (const cat of categories) {
    const prods = await Product.find({ category: cat }).limit(2).lean();
    console.log(`\n--- Category: ${cat} ---`);
    if (prods.length === 0) {
      console.log('No products found.');
      continue;
    }
    
    prods.forEach(p => {
      console.log(`Product: ${p.name} (ID: ${p.id})`);
      console.log(`Specifications field type: ${typeof p.specifications}`);
      if (p.specifications) {
        console.log(`Specifications length: ${p.specifications.length}`);
        console.log('Sample spec:', JSON.stringify(p.specifications[0]));
      } else {
        console.log('Specifications field is missing or null.');
      }
      
      // Check if they are in another field like "specs"
      if (p.specs) {
        console.log('Found "specs" field instead of "specifications"');
        console.log('Sample spec:', JSON.stringify(p.specs[0]));
      }
    });
  }
  
  process.exit(0);
}

run().catch(console.error);
