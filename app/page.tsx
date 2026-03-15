import Hero from './components/Hero/Hero';
import Benefits from './components/Benefits/Benefits';
import Categories from './components/Categories/Categories';
import ProductCarousel from './components/Products/ProductCarousel';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <Benefits />
      <Categories />
      <ProductCarousel />
    </main>
  );
}
