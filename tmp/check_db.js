const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017/jbimports"; // Adjust if needed

async function checkProduct() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('jbimports');
    const products = db.collection('products');
    const product = await products.findOne({ id: 'cel-1' });
    console.log('Product Found:', JSON.stringify(product, null, 2));
  } finally {
    await client.close();
  }
}

checkProduct();
