import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const missing = await Product.find({ 
    category: { $in: ['notebooks', 'realme', 'iphone'] },
    $or: [
      { specifications: { $exists: false } },
      { specifications: null },
      { specifications: { $size: 0 } }
    ]
  }).select('name category').lean();

  console.log('Missing Specifications:');
  missing.forEach(p => console.log(`- [${p.category}] ${p.name}`));

  process.exit(0);
}

run().catch(console.error);
