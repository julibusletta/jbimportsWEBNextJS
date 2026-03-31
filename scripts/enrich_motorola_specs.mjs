import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  stock: Number,
  specifications: [{ label: String, value: String }]
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const specsData = {
  'E15': {
    procesador: 'MediaTek Helio G81 Extreme (12 nm)',
    camaraTrasera: '32 MP (f/2.2)',
    camaraFrontal: '8 MP (f/2.1)',
    pantalla: '6.67" IPS LCD, 90Hz, 720 x 1604 px, Gorilla Glass 3',
    bateria: '5200 mAh, 18W TurboPower',
    so: 'Android 14 (Go edition)'
  },
  'EDGE 50 FUSION': {
    procesador: 'Qualcomm Snapdragon 6 Gen 1 (4 nm)',
    camaraTrasera: '50 MP (Sony LYT-700C, OIS) + 13 MP (Ultra-wide/Macro)',
    camaraFrontal: '32 MP (f/2.4)',
    pantalla: '6.7" P-OLED, 120Hz (LATAM), FHD+ (1080 x 2400 px), 1600 nits',
    bateria: '5000 mAh, 68W TurboPower',
    so: 'Android 14 (Hello UI)'
  },
  'G05': {
    procesador: 'MediaTek Helio G81 Ultra (12 nm)',
    camaraTrasera: '50 MP (f/1.8)',
    camaraFrontal: '8 MP (f/2.1)',
    pantalla: '6.67" IPS LCD, 90Hz, 720 x 1604 px',
    bateria: '5200 mAh, 18W TurboPower',
    so: 'Android 15'
  },
  'G06': {
    procesador: 'MediaTek Helio G81 Ultra (12 nm)',
    camaraTrasera: '50 MP (f/1.8)',
    camaraFrontal: '8 MP (f/2.1)',
    pantalla: '6.8" IPS LCD, 120Hz, 720 x 1604 px',
    bateria: '5200 mAh, 10W / 18W TurboPower',
    so: 'Android 15'
  },
  'G15': {
    procesador: 'MediaTek Helio G81 Extreme (12 nm)',
    camaraTrasera: '50 MP (f/1.8) + 5 MP (Ultra-wide)',
    camaraFrontal: '8 MP (f/2.1)',
    pantalla: '6.72" IPS LCD, FHD+ (1080 x 2400 px), Gorilla Glass 3',
    bateria: '5000 mAh, 18W TurboPower',
    so: 'Android 15'
  },
  'G35': {
    procesador: 'Unisoc T760 5G (6 nm)',
    camaraTrasera: '50 MP (Quad Pixel) + 8 MP (Ultra-wide)',
    camaraFrontal: '16 MP (f/2.4)',
    pantalla: '6.72" FHD+ LCD, 120Hz, 1000 nits',
    bateria: '5000 mAh, 18W TurboPower',
    so: 'Android 14'
  },
  'G56': {
    procesador: 'Qualcomm Snapdragon 6s Gen 4 (6 nm)',
    camaraTrasera: '50 MP (Sony LYTIA 600, OIS)',
    camaraFrontal: '32 MP (f/2.4)',
    pantalla: '6.72" FHD+ IPS LCD, 120Hz',
    bateria: '7000 mAh, 30W TurboPower',
    so: 'Android 15'
  },
  'G86': {
    procesador: 'MediaTek Dimensity 7300 (4 nm)',
    camaraTrasera: '50 MP (Sony LYTIA 600, OIS) + 8 MP (Ultra-wide)',
    camaraFrontal: '32 MP (f/2.4)',
    pantalla: '6.67" AMOLED, 120Hz, FHD+',
    bateria: '5200 mAh, 30W TurboPower',
    so: 'Android 15'
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({ 
      category: 'motorola',
      stock: { $gt: 0 }
    });

    console.log(`Analyzing ${products.length} Motorola products with stock.`);

    const operations = products.map(p => {
      const upperName = p.name.toUpperCase();
      let matchedKey = null;

      if (upperName.includes('EDGE 50 FUSION')) matchedKey = 'EDGE 50 FUSION';
      else if (upperName.includes(' G86 ')) matchedKey = 'G86';
      else if (upperName.includes(' G56 ')) matchedKey = 'G56';
      else if (upperName.includes(' G35 ')) matchedKey = 'G35';
      else if (upperName.includes(' G15 ')) matchedKey = 'G15';
      else if (upperName.includes(' G06 ')) matchedKey = 'G06';
      else if (upperName.includes(' G05 ')) matchedKey = 'G05';
      else if (upperName.includes(' E15 ')) matchedKey = 'E15';

      if (matchedKey) {
        const baseSpecs = specsData[matchedKey];
        
        // Extract RAM and Storage from name
        // Example: 256GB8RAM or 4/256GB
        let ram = 'N/A';
        let storage = 'N/A';

        const ramMatch = upperName.match(/(\d+)\s?(RAM|GBRAM|GB RAM)/i) || upperName.match(/(\d+)\/(\d+)GB/);
        const storageMatch = upperName.match(/(\d+)\s?(GB|TB)/i);

        if (upperName.includes('/')) {
            const parts = upperName.match(/(\d+)\/(\d+)GB/);
            if (parts) {
                ram = parts[1] + ' GB';
                storage = parts[2] + ' GB';
            }
        } else {
            if (ramMatch) ram = ramMatch[1] + ' GB';
            if (storageMatch) storage = storageMatch[1] + ' GB';
        }

        const newSpecs = [
          { label: 'Procesador', value: baseSpecs.procesador },
          { label: 'RAM', value: ram },
          { label: 'Almacenamiento', value: storage },
          { label: 'Cámara trasera', value: baseSpecs.camaraTrasera },
          { label: 'Cámara frontal', value: baseSpecs.camaraFrontal },
          { label: 'Pantalla', value: baseSpecs.pantalla },
          { label: 'Batería', value: baseSpecs.bateria },
          { label: 'Sistema Operativo', value: baseSpecs.so }
        ];

        console.log(`Updating [${p.name}] with specs for ${matchedKey}`);
        return {
          updateOne: {
            filter: { _id: p._id },
            update: { $set: { specifications: newSpecs } }
          }
        };
      }
      return null;
    }).filter(Boolean);

    if (operations.length > 0) {
      const result = await Product.bulkWrite(operations);
      console.log(`Successfully updated ${result.modifiedCount} products.`);
    } else {
      console.log('No products matched specifications criteria.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
