'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeGlobalIntersectionObserver } from '@/app/hooks/useIntersectionObserver';

/**
 * Initialize animation libraries (AOS) and scroll observers.
 * Uses a small delay to ensure all child elements are in the DOM
 * before the IntersectionObserver starts observing them.
 */
export function AnimationInitializer() {
  const pathname = usePathname();

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
  }, []); // Run once on mount

  useEffect(() => {
    // Re-initialize observers and refresh AOS on route change
    const refreshAnimations = async () => {
      try {
        // @ts-expect-error AOS types not available
        const AOS = (await import('aos')).default;
        AOS.refresh();
      } catch (e) {}
      
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
            // We keep the visible class if we want them to stay visible once revealed,
            // but the user's current logic removes it. 
            // entry.target.classList.remove('visible');
          }
        });
      }, observerOptions);

      // Observe all relevant elements
      const elementsToObserve = document.querySelectorAll('section, .carrusel, footer, [data-aos]');
      elementsToObserve.forEach((el) => {
        observer.observe(el);
      });

      return observer;
    };

    let observerInstance: IntersectionObserver | undefined;
    
    // Small delay to ensure DOM is ready after navigation
    const timer = setTimeout(async () => {
      observerInstance = await refreshAnimations();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (observerInstance) observerInstance.disconnect();
    };
  }, [pathname]);

  return null;
}
