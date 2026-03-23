'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { getProductsBySection, type Product } from '@/lib/api/productService';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductCarouselSectionProps {
  title: string;
  section: 'bombas' | 'nuevas';
  progressColor?: string;
}

export function ProductCarouselSection({ title, section, progressColor = '#0066cc' }: ProductCarouselSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionId = section === 'bombas' ? 'bombas' : 'nuevas-llegadas';

  const settings = {
    dots: false,
    infinite: products.length > (isMobile ? 2 : 4),
    speed: 500,
    slidesToShow: isMobile ? 2 : 4,
    slidesToScroll: isMobile ? 2 : 1,
    arrows: !isMobile,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: products.length > 3,
          arrows: true
        }
      }
    ]
  };

  return (
    <section id={sectionId} className="carrusel py-4 md:py-10 px-4 bg-gradient-to-br from-gray-100 to-white" data-aos="fadeInUp">
      <div className="max-w-[1400px] mx-auto px-4 w-full">
        <div className="carrusel-header text-left mb-6">
          <div className="categories-title-wrapper mb-3">
            <h2 className="main-section-title">
              {title}
            </h2>
          </div>
        </div>
      </div>

      <div className="products-carousel-wrapper">
        {loading && <p className="text-center py-8 text-gray-600">Cargando productos...</p>}
        {!loading && products.length === 0 && <p className="text-center py-8 text-gray-600">No hay productos disponibles</p>}
        {!loading && products.length > 0 && (
          <Slider {...settings}>
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="no-style-link">
                <div className="carousel-product px-2.5 pb-4">
                  <div className="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative transform hover:-translate-y-2">
                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                        -{product.discountPercentage}%
                      </div>
                    )}
                    
                    <div className="product-image-container relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-4 h-48 sm:h-64">
                      <img
                        src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/images/placeholder.png'}
                        alt={product.name}
                        className="max-w-full max-height-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="product-info p-4 flex flex-col flex-grow bg-white">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem] uppercase tracking-tight">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mb-2 uppercase font-medium">Art: {product.sku || 'N/A'}</p>
                      <div className="mt-auto">
                        <div className="flex flex-col mb-4">
                          {product.discountPercentage > 0 && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                              ${Math.round(product.price / (1 - product.discountPercentage / 100)).toLocaleString('es-AR')}
                            </span>
                          )}
                          <span className="text-sm sm:text-lg font-black text-gray-900 leading-none">
                            ${product.price ? product.price.toLocaleString('es-AR') : 'Consultar'}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`btn-add-cart w-full px-0 py-2.5 mt-auto border-0 rounded text-xs font-semibold cursor-pointer transition-all ${
                            addedProductId === product.id
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-900'
                          }`}
                        >
                          {addedProductId === product.id ? '✓ Agregado' : 'Agregar al carrito'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}

export default function ProductCarousel() {
  return (
    <>
      <ProductCarouselSection
        title="BOMBAS EN JB IMPORTS"
        section="bombas"
        progressColor="#414141"
      />
      <ProductCarouselSection
        title="NUEVAS LLEGADAS"
        section="nuevas"
        progressColor="#0066cc"
      />
    </>
  );
}
