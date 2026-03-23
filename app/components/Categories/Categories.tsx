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

  // Filter to show only the categories specified by the user:
  // celulares, auriculares, parlantes, apple, notebooks
  // Filter and transform categories for the Home page
  const allowedSlugs = ['celulares', 'apple', 'notebooks'];
  
  // Create the base list from fetched categories
  const baseCategories = secondaryCategories.filter(cat => 
    allowedSlugs.includes(cat.slug)
  );

  // Define new manual categories requested by the user
  const manualCategories: Category[] = [
    {
      id: 'cat-jbl',
      name: 'JBL',
      slug: 'jbl', // This will point to JBL brand/category
      image: '/images/categories/jbl.png',
      isMain: false,
      description: 'Auriculares y Parlantes JBL'
    },
    {
      id: 'cat-smart-home',
      name: 'Smart Home',
      slug: 'smart-home',
      image: '/images/categories/smart-home.png',
      isMain: false,
      description: 'Hogar Inteligente'
    },
    {
      id: 'cat-starlink',
      name: 'Starlink',
      slug: 'starlink',
      image: '/images/categories/starlink.png',
      isMain: false,
      description: 'Accesorios para Starlink'
    }
  ];

  // Combine them: usually we want a specific order
  // Suggested order: Celulares, Apple, Notebooks, JBL, Smart Home, Starlink
  const combinedCategories = [
    ...baseCategories,
    ...manualCategories
  ];

  // Logic to handle custom sorting if needed:
  const sortOrder = ['celulares', 'apple', 'notebooks', 'jbl', 'smart-home', 'starlink'];
  const finalCategories = combinedCategories.sort((a, b) => {
    return sortOrder.indexOf(a.slug) - sortOrder.indexOf(b.slug);
  });

  // Auto-slide on mobile using chunks
  useEffect(() => {
    if (!isMobile || finalCategories.length <= 4) return;

    const maxChunks = Math.ceil(finalCategories.length / 4);

    const interval = setInterval(() => {
      setCurrentChunkIndex((prevIndex) => (prevIndex + 1) % maxChunks);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, finalCategories.length]);

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
  let displayedCategories = finalCategories;
  if (isMobile) {
    const chunkStart = currentChunkIndex * 4;
    displayedCategories = finalCategories.slice(chunkStart, chunkStart + 4);
        )}
      </div>
    </section>
  );
}
