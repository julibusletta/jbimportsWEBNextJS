import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

function normalizeColor(name) {
  let n = name.toLowerCase();
  if (n.includes('negro') || n.includes('black')) return 'black';
  if (n.includes('blanco') || n.includes('white')) return 'white';
  if (n.includes('azul') || n.includes('blue')) return 'blue';
  if (n.includes('verde') || n.includes('green')) return 'green';
  if (n.includes('purpura') || n.includes('púrpura') || n.includes('purple')) return 'purple';
  if (n.includes('dorado') || n.includes('gold')) return 'gold';
  if (n.includes('plata') || n.includes('silver')) return 'silver';
  if (n.includes('gris') || n.includes('grey') || n.includes('gray')) return 'grey';
  if (n.includes('titanium') || n.includes('titanuim')) return 'titanium';
  return null;
}

function getVariantWithoutColor(name) {
  let n = name.trim().toLowerCase();
  n = n.replace(/negro|black|blanco|white|azul|blue|verde|green|purpura|púrpura|purple|dorado|gold|plata|silver|gris|grey|gray|titanium|titanuim|amarillo|yellow|storm|orange|naranja/g, '');
  n = n.replace(/\s+/g, ' ').trim();
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
      const base = getVariantWithoutColor(p.name);
      const color = normalizeColor(p.name);
      
      const key = `${base}|${color}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(p);
    }

    let found = false;
    for (const [key, members] of groups.entries()) {
      if (members.length > 1) {
        console.log(`\nPotential Duplicate Group: "${key}"`);
        members.forEach(m => {
          console.log(`  - Name: "${m.name}" | ID: ${m._id} | Price: ${m.price} | Cost: ${m.costPrice}`);
        });
        found = true;
      }
    }

    if (!found) {
      console.log('No color-aliased duplicates found.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
