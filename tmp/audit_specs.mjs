import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ category: String, specifications: Array }, { strict: false }));
  
  const categories = await Product.distinct('category');
  const audit = [];

  for (const cat of categories) {
    const total = await Product.countDocuments({ category: cat });
    const withSpecs = await Product.countDocuments({ 
      category: cat, 
      specifications: { $exists: true, $not: { $size: 0 } } 
    });
    
    audit.push({
      Category: cat,
      Total: total,
      WithSpecs: withSpecs,
      Missing: total - withSpecs,
      Percentage: total > 0 ? ((withSpecs / total) * 100).toFixed(1) + '%' : '0%'
    });
  }

  console.table(audit);
  process.exit(0);
}

run().catch(console.error);
