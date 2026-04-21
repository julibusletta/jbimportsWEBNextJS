import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    
    console.log(`Found ${products.length} products in Xiaomi category.`);

    const byId = new Map();
    const idDuplicates = [];

    const byName = new Map();
    const nameDuplicates = [];

    for (const p of products) {
      // Check ID
      if (p.id) {
        if (byId.has(p.id)) {
          idDuplicates.push({ original: byId.get(p.id), duplicate: p });
        } else {
          byId.set(p.id, p);
        }
      }

      // Check Name (normalized)
      const normName = p.name.trim().toLowerCase().replace(/\s+/g, ' ');
      if (byName.has(normName)) {
        nameDuplicates.push({ original: byName.get(normName), duplicate: p });
      } else {
        byName.set(normName, p);
      }
    }

    console.log(`\n--- ID Duplicates (${idDuplicates.length}) ---`);
    idDuplicates.forEach((d, i) => {
      console.log(`${i+1}. ID: ${d.duplicate.id} | Name 1: ${d.original.name} | Name 2: ${d.duplicate.name}`);
    });

    console.log(`\n--- Name Duplicates (${nameDuplicates.length}) ---`);
    nameDuplicates.forEach((d, i) => {
      console.log(`${i+1}. Name: "${d.duplicate.name}" | ID 1: ${d.original._id} | ID 2: ${d.duplicate._id}`);
    });

    // Check for similar names
    console.log(`\n--- Cross-checking Name vs ID similarity ---`);
    // (This might be too much output, let's just see if we found anything first)

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
