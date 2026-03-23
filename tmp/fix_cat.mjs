import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const match = envFile.split('\n').find(l => l.startsWith('MONGODB_URI='));
if (!match) throw new Error("no uri");
const mongoURI = match.substring('MONGODB_URI='.length).trim();

const ProductSchema = new mongoose.Schema({}, { strict: false });

async function fixCategories() {
  await mongoose.connect(mongoURI);
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

  const products = await Product.find({ category: 'auriculares' });
  let count = 0;
  for (const p of products) {
    const name = p.name ? p.name.toUpperCase() : '';
    if (name && !name.includes('TUNE') && !name.includes('TOUR') && !name.includes('QU5') && !name.includes('SONY')) {
      await Product.updateOne({ _id: p._id }, { category: 'parlantes' });
      console.log(`Moved ${name} to parlantes`);
      count++;
    }
  }
  console.log(`Updated ${count} products.`);
  process.exit(0);
}
fixCategories().catch(e => { console.error(e); process.exit(1); });
