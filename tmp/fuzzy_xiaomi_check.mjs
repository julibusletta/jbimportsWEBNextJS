import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

function normalizeName(name) {
  let n = name.toLowerCase();
  n = n.replace(/xiaomi/g, '');
  n = n.replace(/global/g, '');
  n = n.replace(/5g/g, '');
  n = n.replace(/4g/g, '');
  
  // Normalize storage and ram
  // Try to find patterns like XXXGB YYYRAM or XXX/YYY
  n = n.replace(/(\d+)gb\s+(\d+)ram/g, '$1 $2');
  n = n.replace(/(\d+)\s+(\d+)ram/g, '$1 $2');
  n = n.replace(/(\d+)\/(\d+)gb/g, '$1 $2');
  n = n.replace(/(\d+)\/(\d+)/g, '$1 $2');
  
  // Remove multiple spaces and trim
  n = n.replace(/\s+/g, ' ').trim();
  
  return n;
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    
    console.log(`Analyzing ${products.length} products...`);

    const groups = new Map();

    for (const p of products) {
      const norm = normalizeName(p.name);
      if (!groups.has(norm)) {
        groups.set(norm, []);
      }
      groups.get(norm).push(p);
    }

    let foundAny = false;
    for (const [norm, members] of groups.entries()) {
      if (members.length > 1) {
        // Only report if it's suspicious
        // If they have different colors in the original name, maybe it's fine.
        // But if they are identical after normalization, let's see.
        
        console.log(`\nPotential Duplicate Group: "${norm}"`);
        members.forEach(m => {
          console.log(`  - ID: ${m._id} | Name: "${m.name}"`);
        });
        foundAny = true;
      }
    }

    if (!foundAny) {
      console.log('No suspicious groups found.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
