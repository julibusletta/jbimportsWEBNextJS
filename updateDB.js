const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://julibusletta:Dali2318@cluster0.b9c2u.mongodb.net/jbimportsWEB?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const HomeSettings = require('./models/HomeSettings').default || require('./models/HomeSettings');
  
  const settings = await HomeSettings.findOne();
  if (settings && settings.heroSlides && settings.heroSlides.length > 0) {
    settings.heroSlides[0] = {
      image: '/images/mundial2026.jpg', 
      alt: 'Figuritas Mundial 2026', 
      order: 0,
      isCustom: true,
      title1: 'FIGURITAS',
      title2: 'MUNDIAL 2026',
      subtitle: '¡COMPRÁ AHORA TU PACK O BULTO CERRADO!',
      showShippingIcon: false,
      link: '/figuritas'
    };
    await settings.save();
    console.log('Updated first slide');
  } else {
    console.log('No settings found');
  }
  process.exit(0);
}

run().catch(console.error);
