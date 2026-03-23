'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Slider from 'react-slick';
import Link from 'next/link';
import { getProductsBySection } from '@/lib/api/productService';
import { getImageUrl } from '@/lib/utils/imageHelper';
import { useCart } from '@/app/context/CartContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/ProductCarousel.css';

interface Product {
  id: string;
  name: string;
  title?: string;
  brand: string;
  sku: string;
  price: number;
  discountPercentage: number;
  discount?: number;
  description: string;
  imageUrls?: string[];
  images?: string[];
  image?: string;
  category: string;
}

interface CarouselProps {
  title: string;
  section: 'bombas' | 'nuevas';
  progressColor?: string;
}

export function ProductCarouselSection({ title, section, progressColor = '#414141' }: CarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Choose ID based on section
  const sectionId = section === 'bombas' ? 'bombas-carousel' : 'nuevas-carousel';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsBySection(section);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [section]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: getImageUrl(product.imageUrls?.[0] || product.images?.[0] || product.image || ''),
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const settings = {
    infinite: true,
    slidesToShow: 4, // Desktop default (4 columns)
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 500,
    arrows: true, // Arrows on for desktop
    dots: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false, // Arrows hidden for mobile
        },
      },
    ],
  };

  return (
    <section id={sectionId} className="carrusel py-4 md:py-10 px-4 bg-gradient-to-br from-gray-100 to-white" data-aos="fadeInUp">
      <div className="carrusel-header text-center mb-10">
        <div className="categories-title-wrapper mb-5">
          <h2 className="font-bold text-gray-900 mb-0 letter-spacing-wide">
            {title}
          </h2>
        </div>
        <div className="carousel-progress max-w-52 mx-auto h-1.5 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="progress-bar h-full rounded-full transition-all"
            style={{
              width: '40%',
              backgroundColor: progressColor,
            }}
          ></div>
        </div>
      </div>

      <div className="products-carousel-wrapper">
        {loading && <p className="text-center py-8 text-gray-600">Cargando productos...</p>}
        {!loading && products.length === 0 && <p className="text-center py-8 text-gray-600">No hay productos disponibles</p>}
        {!loading && products.length > 0 && (
          <Slider {...settings}>
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="no-style-link">
                <div className="carousel-product px-2.5">
                  <div className="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative transform hover:-translate-y-2">
                    {/* Discount Badge */}
                    {((product.discount ?? 0) > 0 || (product.discountPercentage ?? 0) > 0) && (
                      <div className="discount-badge absolute top-3 right-3 bg-red-400 text-white px-3 py-1.5 rounded text-xs font-bold z-10 shadow-sm border border-red-500/50">
                        {product.discount || product.discountPercentage}% OFF
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="product-image w-full h-64 overflow-hidden bg-white flex items-center justify-center p-4">
                      <img
                        src={getImageUrl(product.imageUrls?.[0] || product.images?.[0] || product.image || '')}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="product-info px-4 py-4 flex flex-col flex-1">
                      <h5 className="text-base font-bold text-gray-900 text-center mb-1.5 leading-relaxed">
                        {product.name}
                      </h5>
                      <p className="text-xs text-gray-600 text-center mb-1">
                        {product.brand}
                      </p>
                      <p className="text-xs text-gray-500 text-center mb-2">
                        Art: {product.sku}
                      </p>
                      <div className="product-price text-center my-2.5">
                        <span className="text-lg font-bold text-gray-700">
                          ${product.price.toLocaleString('es-AR')}
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
        title="#BOMBAS EN JB IMPORTS"
        section="bombas"
        progressColor="#414141"
      />
      <ProductCarouselSection
        title="✨ NUEVAS LLEGADAS"
        section="nuevas"
        progressColor="#0066cc"
      />
    </>
  );
}
