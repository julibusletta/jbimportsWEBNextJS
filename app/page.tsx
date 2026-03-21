import Hero from './components/Hero/Hero';
import Benefits from './components/Benefits/Benefits';
import Categories from './components/Categories/Categories';
import { ProductCarouselSection } from './components/Products/ProductCarousel';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <Benefits />
      <ProductCarouselSection 
        title="#BOMBAS EN JB IMPORTS"
        section="bombas"
        progressColor="#414141"
      />
      <Categories />
      <ProductCarouselSection 
        title="✨ NUEVAS LLEGADAS"
        section="nuevas"
        progressColor="#0066cc"
      />
    </main>
  );
}
