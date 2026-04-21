import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const names = [
      'XIAOMI NOTE 14 PRO 512GB 12RAM 5G VERDE GLOBAL',
      'XIAOMI NOTE 14 128GB 6RAM PÚRPURA GLOBAL',
      'XIAOMI NOTE 14 128GB 6RAM AZUL GLOBAL',
      'XIAOMI REDMI A5 64GB 3RAM AZUL GLOBAL',
      'XIAOMI REDMI 15C 256GB 8RAM AZUL GLOBAL'
    ];
    const products = await Product.find({ name: { $in: names } }).lean();
    console.log(JSON.stringify(products.map(p => ({ id: p._id, name: p.name, image: p.image, images: p.images })), null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
