const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function checkProduct() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); // The URI doesn't specify DB, let's try 'test' or 'admin'
    // Actually, check what databases are there
    const dbs = await client.db().admin().listDatabases();
    console.log('Databases:', dbs.databases.map(d => d.name));
    
    // JBimports usually uses 'jbimports' or similar. 
    // Let's try to find the product in any DB
    for (const dbName of dbs.databases.map(d => d.name)) {
      if (['admin', 'local', 'config'].includes(dbName)) continue;
      const products = client.db(dbName).collection('products');
      const product = await products.findOne({ id: 'cel-1' });
      if (product) {
        console.log(`Found in DB [${dbName}]:`, JSON.stringify(product, null, 2));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkProduct();
