'use client';

import { useEffect } from 'react';
import { initializeGlobalIntersectionObserver } from '@/app/hooks/useIntersectionObserver';

/**
 * Initialize animation libraries (AOS) and scroll observers.
 * Uses a small delay to ensure all child elements are in the DOM
 * before the IntersectionObserver starts observing them.
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
    initializeGlobalIntersectionObserver();

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

    // Delay to ensure all page children are rendered before observing
    const timer = setTimeout(() => {
      document.querySelectorAll('section, .carrusel, footer').forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
