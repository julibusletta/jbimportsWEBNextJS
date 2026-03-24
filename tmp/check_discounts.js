const db = require('./lib/mongodb').default;
const Product = require('./models/Product').default;

async function checkDiscounts() {
  try {
    await db();
    const products = await Product.find({ discount: { $gt: 0 } }).limit(5).lean();
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDiscounts();
