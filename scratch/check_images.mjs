import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const productsToCheck = [
  'XIAOMI NOTE 14 PRO 512GB 12RAM 5G VERDE GLOBAL',
  'XIAOMI NOTE 14 128GB 6RAM PÚRPURA GLOBAL',
  'XIAOMI NOTE 14 128GB 6RAM AZUL GLOBAL',
  'XIAOMI REDMI A5 64GB 3RAM AZUL GLOBAL',
  'XIAOMI REDMI 15C 256GB 8RAM AZUL GLOBAL'
];

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    console.log('Checking current product images in DB...');
    const results = await Product.find({ name: { $in: productsToCheck } }).lean();

    if (results.length === 0) {
      console.log('No products found with those exact names.');
    }

    results.forEach(p => {
      console.log(`Product: ${p.name}`);
      console.log(`  Main: ${p.image}`);
      console.log(`  Gallery: ${p.images || 'None'}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
