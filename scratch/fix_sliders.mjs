import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const HeroSlideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  link: { type: String, default: '' },
  isCustom: { type: Boolean, default: false },
  title1: { type: String, default: '' },
  title2: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  showShippingIcon: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const ProductCarouselSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['section', 'category'], default: 'section' },
  value: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

const HomeSettingsSchema = new mongoose.Schema({
  heroSlides: [HeroSlideSchema],
  productCarousels: [ProductCarouselSchema],
  weeklyOffers: [{
    productId: String,
    title: String,
    subtitle: String,
    link: String,
    image: String,
    active: { type: Boolean, default: true }
  }],
  updatedAt: { type: Date, default: Date.now }
});

const HomeSettings = mongoose.models.HomeSettings || mongoose.model('HomeSettings', HomeSettingsSchema);

async function fixSliders() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const settings = await HomeSettings.findOne().sort({ updatedAt: -1 });
  if (!settings) {
    console.log('No settings found');
    await mongoose.disconnect();
    return;
  }

  console.log('Current slides:');
  settings.heroSlides.forEach((slide, i) => {
    console.log(`${i}: ${slide.image}`);
  });

  let modified = false;
  settings.heroSlides.forEach(slide => {
    // Fix typo "sliderbbaner5" to "sliderbanner5.png"
    if (slide.image === '/images/sliderbbaner5') {
      console.log(`Fixing ${slide.image} -> /images/sliderbanner5.png`);
      slide.image = '/images/sliderbanner5.png';
      modified = true;
    }
    // Fix missing extensions in general if we can guess
    else if (!slide.image.includes('.')) {
       console.log(`Warning: Slide ${slide.image} has no extension`);
    }
  });

  if (modified) {
    settings.updatedAt = new Date();
    await settings.save();
    console.log('Changes saved successfully');
  } else {
    console.log('No changes were necessary');
  }

  await mongoose.disconnect();
}

fixSliders().catch(console.error);
