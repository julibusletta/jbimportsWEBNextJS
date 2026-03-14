'use client';

import { useEffect } from 'react';
import { initializeGlobalIntersectionObserver } from '@/app/hooks/useIntersectionObserver';

/**
 * Initialize animation libraries (AOS) and scroll observers
 */
export function AnimationInitializer() {
  useEffect(() => {
    // Initialize AOS library if available
    const initAOS = async () => {
      try {
        // @ts-expect-error AOS types not available
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 800,
          easing: 'ease-in-out-cubic',
          once: false,
          mirror: true,
          offset: 120,
          disable: false,
        });
        console.log('✓ AOS initialized');
      } catch (error) {
        console.log('AOS library not available');
      }
    };

    initAOS();

    // Initialize global intersection observer for animations
    initializeGlobalIntersectionObserver();

    // Add visible class to sections when they enter viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'in-view');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, observerOptions);

    // Observe all sections, carousels, and footers
    document.querySelectorAll('section, .carrusel, footer').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
