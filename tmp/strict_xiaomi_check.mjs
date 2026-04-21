import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

function getStrictKey(name) {
  let n = name.trim().toLowerCase();
  
  // Keep 5G/4G/Pro/+ but normalize them
  n = n.replace(/\s+/g, ' ');
  
  // Maybe remove "GLOBAL" as it's usually redundant for all items here
  n = n.replace(/global/g, '').trim();
  
  return n;
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    console.log(`Analyzing ${products.length} Xiaomi products...`);

    const groups = new Map();

    for (const p of products) {
      const key = getStrictKey(p.name);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(p);
    }

    let found = false;
    for (const [key, members] of groups.entries()) {
      if (members.length > 1) {
        console.log(`\nDuplicate Group: "${key}"`);
        members.forEach(m => {
          console.log(`  - ID: ${m._id} | Name: "${m.name}" | Price: ${m.price}`);
        });
        found = true;
      }
    }

    if (!found) {
      console.log('No strict duplicates found by name.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
