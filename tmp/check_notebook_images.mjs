import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const notebooks = await Product.find({ category: 'notebooks' }).lean();
  console.log(`\n📦 Notebooks en DB: ${notebooks.length}\n`);

  for (const p of notebooks) {
    const imgs = (p.images || []).filter(i => i && !i.includes('placeholder'));
    const mainImg = p.image && !p.image.includes('placeholder') ? p.image : null;
    const hasAny = imgs.length > 0 || mainImg;
    console.log(`${hasAny ? '🖼️ ' : '❌ '} [${p.id}] ${p.name}`);
    if (mainImg) console.log(`     main: ${mainImg}`);
    imgs.forEach((img, i) => console.log(`     img[${i}]: ${img}`));
  }

  console.log('\n--- Búsqueda: LENOVO YOGA ---');
  const yoga = await Product.findOne({ name: { $regex: /LENOVO YOGA/i } }).lean();
  if (yoga) {
    console.log('Encontrado:', yoga.name, '| id:', yoga.id);
    console.log('image:', yoga.image);
    console.log('images:', JSON.stringify(yoga.images, null, 2));
  } else {
    console.log('No encontrado. Buscando todos los lenovo...');
    const lenovos = await Product.find({ name: { $regex: /lenovo/i } }).lean();
    lenovos.forEach(p => console.log(`  [${p.id}] ${p.name}`));
  }

  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
