'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { 
  getMainCategory, 
  getSecondaryCategories, 
  type Category 
} from '@/lib/api/categoriesService';
import '../../styles/Categories.css';

export default function Categories() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [mainCategory, setMainCategory] = useState<Category | null>(null);
  const [secondaryCategories, setSecondaryCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const [main, secondary] = await Promise.all([
          getMainCategory(),
          getSecondaryCategories(),
        ]);
        setMainCategory(main);
        setSecondaryCategories(secondary);
      } catch (error) {
        console.error('Error loading categories:', error);
        setMainCategory(null);
        setSecondaryCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();

    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide on mobile using chunks
  useEffect(() => {
    if (!isMobile || secondaryCategories.length <= 4) return;

    const maxChunks = Math.ceil(secondaryCategories.length / 4);

    const interval = setInterval(() => {
      setCurrentChunkIndex((prevIndex) => (prevIndex + 1) % maxChunks);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, secondaryCategories.length]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current && !isMobile) {
      const scrollAmount = 220;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Get current categories to display
  let displayedCategories = secondaryCategories;
  if (isMobile) {
    const chunkStart = currentChunkIndex * 4;
    displayedCategories = secondaryCategories.slice(chunkStart, chunkStart + 4);
  }

  return (
    <section className="categories-section" id="categories">
      <div className="categories-container">
        {/* Header */}
        <div className="categories-header">
          <div className="categories-title-wrapper">
            <h2>
              Explorá nuestras <b>categorías</b>
            </h2>
          </div>
          <div className="categories-arrows hidden md:flex">
            <button
              onClick={() => scrollCarousel('left')}
              className="arrow-btn"
              aria-label="Previous categories"
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="arrow-btn"
              aria-label="Next categories"
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {loading && <p className="loading-text">Cargando categorías...</p>}
        {!loading && (
          <div className="categories-content">
            {/* Main Category */}
            {mainCategory && (
              <Link href={`/category/${mainCategory.slug}`} className="categories-main">
                <div className="category-max preview">
                  <div
                    className="category-max preview-card"
                    style={{ backgroundImage: `url(${mainCategory.image})` }}
                  ></div>
                  <div className="preview-shadow"></div>
                  <div className="preview-text">
                    <p>{mainCategory.name}</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Secondary Categories Carousel/Grid */}
            <div className="categories-secondary">
              <div
                ref={carouselRef}
                className={isMobile ? "categories-mobile-grid fade-in-out" : "categories-carousel snap-x snap-mandatory"}
                key={isMobile ? currentChunkIndex : 'desktop'}
              >
                {displayedCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="carousel-slide"
                  >
                    <div className="category-min preview">
                      <div
                        className="category-min preview-card"
                        style={{ backgroundImage: `url(${category.image})` }}
                      ></div>
                      <div className="preview-shadow"></div>
                      <div className="preview-text">
                        <p>{category.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
