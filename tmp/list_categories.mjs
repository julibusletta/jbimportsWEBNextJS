import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ category: String }, { strict: false }));
  
  const categories = await Product.distinct('category');
  console.log('Categories found in products:', categories);
  
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ slug: String, name: String }, { strict: false }));
  const cats = await Category.find().lean();
  console.log('Categories in Category collection:', cats.map(c => c.slug));

  process.exit(0);
}

run().catch(console.error);
