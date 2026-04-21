import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

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

async function checkSliders() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const settings = await HomeSettings.findOne().sort({ updatedAt: -1 });
  if (!settings) {
    console.log('No settings found');
    await mongoose.disconnect();
    return;
  }

  console.log('--- Current Hero Slides ---');
  settings.heroSlides.forEach((slide, i) => {
    console.log(`[SLIDE ${i}] URL: ${slide.image} | Alt: ${slide.alt}`);
  });

  await mongoose.disconnect();
}

checkSliders().catch(console.error);
