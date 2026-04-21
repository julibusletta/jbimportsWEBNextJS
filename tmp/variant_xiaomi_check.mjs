import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

function getVariantKey(name) {
  let n = name.trim().toLowerCase();
  
  // Normalize brand
  n = n.replace(/^xiaomi\s+/, '');
  n = n.replace(/^redmi\s+/, '');
  n = n.replace(/^poco\s+/, '');
  
  // Normalize "GLOBAL"
  n = n.replace(/\s+global$/, '');
  
  // Normalize spaces
  n = n.replace(/\s+/g, ' ');
  
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
      const key = getVariantKey(p.name);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(p);
    }

    let found = false;
    for (const [key, members] of groups.entries()) {
      if (members.length > 1) {
        console.log(`\nDuplicate Group (Identical Variant): "${key}"`);
        members.forEach(m => {
          console.log(`  - ID: ${m._id} | Name: "${m.name}" | Price: ${m.price} | Cost: ${m.costPrice}`);
        });
        found = true;
      }
    }

    if (!found) {
      console.log('No identical variant duplicates found.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
