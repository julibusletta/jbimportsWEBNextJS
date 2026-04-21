import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ 
      published: true, 
      $or: [ 
        { image: { $in: [null, '', '/images/hero-xiaomi.png'] } }, 
        { images: { $size: 0 } }, 
        { images: { $in: ['/images/hero-xiaomi.png'] } } 
      ] 
    }).lean();

    console.log(`Found ${products.length} products with missing or generic images.`);
    
    // Group by category
    const byCategory = {};
    products.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(p.name);
    });

    console.log('\nProducts by Category:');
    for (const [cat, names] of Object.entries(byCategory)) {
      console.log(`\n[${cat}] (${names.length}):`);
      names.slice(0, 10).forEach(name => console.log(`  - ${name}`));
      if (names.length > 10) console.log(`  ... and ${names.length - 10} more`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
