'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getProductsBySection } from '@/lib/api/productService';
import '../../styles/Categories.css';
import '../../styles/ProductCarousel.css';

interface ProductCarouselSectionProps {
  title: string;
  section: 'bombas' | 'nuevas';
}

export function ProductCarouselSection({ title, section }: ProductCarouselSectionProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsBySection(section);
        setProducts(data);
      } catch (error) {
        console.error(`Error fetching ${section} products:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [section]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      // Scroll exactly 1 item width or the whole view?
      // User says 4 products desktop, 2 mobile. Let's scroll by one "view" (100% width)
      const scrollAmount = containerWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((p: any) => p.id === product.id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <section className="categories-section visible" style={{ opacity: 1, transform: 'none', padding: '40px 0' }}>
      <div className="categories-container" style={{ padding: '0 16px' }}>
        {/* Header - Identical layout to Categories.tsx */}
        <div className="categories-header">
          <div className="categories-title-wrapper">
            <h2 className="main-section-title" style={{ fontWeight: 800 }}>
              {title.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <b key={i} style={{ color: '#0066cc' }}> {word}</b> : word + ' ')}
            </h2>
          </div>
          <div className="categories-arrows hidden md:flex">
            <button onClick={() => handleScroll('left')} className="arrow-btn" aria-label="Anterior">
              <FaChevronLeft size={20} />
            </button>
            <button onClick={() => handleScroll('right')} className="arrow-btn" aria-label="Siguiente">
              <FaChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Categories-style content wrapper */}
        <div className="relative w-full overflow-hidden">
          {loading && <p className="text-center py-10">Cargando...</p>}
          {!loading && products.length > 0 && (
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
              style={{ 
                msOverflowStyle: 'none', 
                scrollbarWidth: 'none', 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                gap: '0' // Gap 0 + Padding internal = Perfect alignment
              }}
            >
              {products.map((product, index) => {
                const displayImage = product.image || (product.imageUrls?.[0]) || '/images/placeholder.png';
                const discountPct = product.discountPercentage || 0;

                return (
                  <div 
                    key={`${section}-${product.id}-${index}`} 
                    className="flex-none snap-start"
                    style={{ 
                      // 25% Desktop, 50% Mobile via inline responsive styles
                      width: 'var(--item-width)', 
                      padding: '10px' 
                    }}
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      :root { --item-width: 25%; }
                      @media (max-width: 768px) { :root { --item-width: 50%; } }
                    `}} />
                    <Link href={`/product/${product.id}`} className="block h-full group no-underline">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 relative">
                        {discountPct > 0 && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-20">
                            -{discountPct}%
                          </div>
                        )}
                        <div className="aspect-square flex items-center justify-center p-4 sm:p-6 bg-white">
                          <img src={displayImage} alt={product.name} className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow bg-white border-t border-gray-50">
                          <h3 className="text-[12px] sm:text-[14px] font-bold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem] uppercase leading-tight">{product.name}</h3>
                          <p className="text-[9px] text-gray-400 mb-3 uppercase font-semibold">SKU: {product.sku || 'N/A'}</p>
                          <div className="mt-auto">
                            <div className="mb-3">
                              <span className="text-[16px] sm:text-[20px] font-black text-gray-900">${product.price?.toLocaleString('es-AR')}</span>
                            </div>
                            <button 
                              onClick={(e) => handleAddToCart(e, product)} 
                              className={`w-full py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border-none cursor-pointer ${addedProductId === product.id ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}
                            >
                              {addedProductId === product.id ? '✓ AGREGADO' : 'AGREGAR AL CARRITO'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

export default function ProductCarousel() {
  return (
    <>
      <ProductCarouselSection title="BOMBAS EN JB IMPORTS" section="bombas" />
      <ProductCarouselSection title="NUEVAS LLEGADAS" section="nuevas" />
    </>
  );
}
