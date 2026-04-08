import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));
  
  const products = await mongoose.connection.db.collection('products').find({ specifications: { $exists: true, $not: { $size: 0 } } }).limit(1).toArray();
  console.log('Sample product with specs from "products" collection:', products.length > 0 ? products[0].name : 'NONE');

  process.exit(0);
}

run().catch(console.error);
