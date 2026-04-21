import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'xiaomi', costPrice: { $exists: true, $ne: null } }).lean();
    console.log(`Analyzing ${products.length} Xiaomi products with cost prices...`);

    const byCost = new Map();

    for (const p of products) {
      const cost = p.costPrice;
      if (!byCost.has(cost)) {
        byCost.set(cost, []);
      }
      byCost.get(cost).push(p);
    }

    let found = false;
    for (const [cost, members] of byCost.entries()) {
      if (members.length > 1) {
        // Only show if names are somewhat similar or suspicious
        console.log(`\nPossible Duplicate Group (Same Cost: ${cost}):`);
        members.forEach(m => {
          console.log(`  - Name: "${m.name}" | ID: ${m._id}`);
        });
        found = true;
      }
    }

    if (!found) {
      console.log('No suspicious groups found by cost price.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
