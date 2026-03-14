import Hero from './components/Hero/Hero';
import Benefits from './components/Benefits/Benefits';
import Categories from './components/Categories/Categories';
import ProductCarousel from './components/Products/ProductCarousel';
import LogosMarquee from './components/LogosMarquee/LogosMarquee';
import Footer from './components/Footer/Footer';
import { AnimationInitializer } from './components/AnimationInitializer/AnimationInitializer';

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <AnimationInitializer />
      <Hero />
      <Benefits />
      <Categories />
      <ProductCarousel />
      <LogosMarquee />
      <Footer />
    </div>
  );
}
