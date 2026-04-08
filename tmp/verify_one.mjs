import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const p = await Product.findOne({ name: /X20 MAX/i }).lean();
  console.log('Product Found:', p.name);
  console.log('ID:', p.id);
  console.log('Specifications:', JSON.stringify(p.specifications, null, 2));

  process.exit(0);
}

run().catch(console.error);
