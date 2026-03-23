import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test'); // Or whatever the default db is. Mongoose default without path is usually 'test' but let's check all or 'jbimports'
    
    // Find the right database
    const dbs = await client.db().admin().listDatabases();
    let targetDbName = 'test';
    const jbDb = dbs.databases.find(d => d.name.includes('jbimports') || d.name === 'admin' || d.name === 'test');
    if (jbDb) targetDbName = jbDb.name;

    const database = client.db(targetDbName);
    const products = await database.collection('products').find({}).toArray();
    
    console.log(`Found ${products.length} products in DB: ${targetDbName}`);
    products.forEach(p => console.log(`- ${p.name} (images: ${p.images?.length || 0})`));

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
