import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function getMongoUri() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=["']?(.*?)["']?(\s|$)/);
    return match ? match[1].trim() : null;
  } catch (e) {
    return process.env.MONGODB_URI;
  }
}

async function listCategories() {
  try {
    const uri = getMongoUri();
    if (!uri) throw new Error('MONGODB_URI not found');
    await mongoose.connect(uri);
    
    const CategorySchema = new mongoose.Schema({
      name: String,
      slug: String,
      parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    });
    
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    const categories = await Category.find({ 
      $or: [
        { name: /notebook/i },
        { slug: /notebook/i }
      ]
    }).lean();
    
    console.log(JSON.stringify(categories, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listCategories();
