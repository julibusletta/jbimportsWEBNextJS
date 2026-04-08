import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_UPDATES = [
  {
    name: "REALME P3 ULTRA RMX5031 5G 512GB12RAM NFC AZUL",
    specs: [
      { label: "Procesador", value: "Snapdragon 8s Gen 3 (4 nm)" },
      { label: "Memoria RAM", value: "12 GB" },
      { label: "Almacenamiento", value: "512 GB" },
      { label: "Pantalla", value: "6.78\" LTPO AMOLED, 120Hz, 6000 nits" },
      { label: "Cámaras", value: "50MP OIS + 8MP (Trasera), 32MP (Frontal)" },
      { label: "Batería", value: "5500 mAh, SuperVOOC 120W" },
      { label: "Marca", value: "Realme" }
    ]
  },
  {
    name: "HP 15T-FD000 CORE I7-1355U 12/256GB SSD FHD NEGRO",
    specs: [
      { label: "Procesador", value: "Intel Core i7-1355U (10 núcleos)" },
      { label: "Memoria RAM", value: "12 GB DDR4" },
      { label: "Almacenamiento", value: "256 GB SSD NVMe" },
      { label: "Pantalla", value: "15.6\" FHD IPS (1920x1080)" },
      { label: "Marca", value: "HP" }
    ]
  },
  {
    name: "HP 16-AG0070WM AMD RYZEN 7 8/512GB SSD PLATA",
    specs: [
      { label: "Procesador", value: "AMD Ryzen 7 8840U (8 núcleos)" },
      { label: "Memoria RAM", value: "8 GB LPDDR5" },
      { label: "Almacenamiento", value: "512 GB SSD NVMe" },
      { label: "Pantalla", value: "16\" WUXGA IPS (1920x1200)" },
      { label: "Marca", value: "HP" }
    ]
  },
  {
    name: "TOSH DYNABOOK A40-G 128G NEGRO",
    specs: [
      { label: "Procesador", value: "Intel Celeron 5205U" },
      { label: "Memoria RAM", value: "4 GB DDR4" },
      { label: "Almacenamiento", value: "128 GB SSD" },
      { label: "Pantalla", value: "14\" HD Anti-glare" },
      { label: "Marca", value: "Dynabook" }
    ]
  },
  {
    name: /IPHONE 13 PRO/i,
    specs: [
      { label: "Chip", value: "A15 Bionic" },
      { label: "Pantalla", value: "Super Retina XDR OLED 120Hz" },
      { label: "Material", value: "Acero inoxidable y vidrio" },
      { label: "Cámara", value: "Sistema Pro de 12MP (Tele, Wide, Ultra Wide)" },
      { label: "Marca", value: "Apple" }
    ]
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  for (const item of SPECS_UPDATES) {
    const query = typeof item.name === 'string' ? { name: item.name } : { name: item.name, specifications: { $size: 0 } };
    await Product.updateMany(query, { $set: { specifications: item.specs } });
    console.log(`Final update for: ${item.name}`);
  }

  process.exit(0);
}

run().catch(console.error);
