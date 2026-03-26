'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import '../../styles/Hero.css';

const heroSlides = [
  {
    image: '/images/test slider1.png',
    alt: 'iPhone Premium',
  },
  {
    image: '/images/DC_20260306150520_9z1vjiMY.jpg',
    alt: 'Tecnología',
  },
  {
    image: '/images/slider-user-tech.png',
    alt: 'Promoción 6 Cuotas Sin Interés',
    isCustom: true,
    title1: 'HASTA 6 CUOTAS',
    title2: 'SIN INTERÉS',
    subtitle: 'LA TECNOLOGÍA QUE NECESITAS EN UN SOLO LUGAR',
    showShippingIcon: false,
  },
  {
    image: '/images/slider5.png',
    alt: 'Crecimiento Corporativo',
  },
  {
    image: '/images/JBLBoombox3Lifestyle01904x560px-(5014).webp',
    alt: 'Audio Premium',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const fullText = 'JB imports  Tecnologia a un solo clic';
  const bluePart = 'JB imports';
  const blackPart = 'Tecnologia a un solo clic';

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      setDisplayText((prev) => {
        if (prev.length < fullText.length) {
          return fullText.slice(0, prev.length + 1);
        } else {
          clearInterval(interval);
          // Pause for 2 seconds after finishing typing before hiding text and showing slider
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
          return fullText;
        }
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isTyping]);

  // Auto-rotate slides - Only start when typing is finished
  useEffect(() => {
    if (isTyping) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isTyping]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="hero relative overflow-hidden visible">
      {/* Hero Content */}
      <div className={`hero-content max-w-4xl w-full opacity-100 transition-opacity duration-700 text-center z-10 ${!isTyping ? 'fade-out' : ''}`}>
        <h1 className="typewriter text-5xl md:text-7xl font-bold leading-tight mb-2 md:mb-8 letter-spacing-tight min-h-0 md:min-h-64 text-gray-900 transition-all duration-300">
          <span className="text-black" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {displayText.slice(0, 1)}
          </span>
          <span className="text-[#0066cc]" style={{ fontFamily: 'var(--font-orbitron)' }}>
            {displayText.slice(1, bluePart.length)}
          </span>
          {displayText.length > bluePart.length && <br />}
          <span className="text-black">
            {displayText.slice(bluePart.length).trim()}
          </span>
          {isTyping && <span className="animate-pulse ml-1 text-gray-400">|</span>}
        </h1>
      </div>

      {/* Hero Slider */}
      <div className={`hero-slider flex items-center justify-center ${!isTyping ? 'active' : ''}`}>
        <div className="slider-container overflow-hidden relative">
          <div 
            className="slider-track"
            style={{ 
              display: 'flex', 
              width: `${heroSlides.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / heroSlides.length)}%)`,
              transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              height: '100%'
            }}
          >
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ width: `${100 / heroSlides.length}%`, height: '100%', position: 'relative' }}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                />
                {slide.isCustom && (
                  <div className="slide-custom-overlay">
                    <div className="promo-text-container">
                      <div className="promo-badge">
                        <span className="promo-title-1">{slide.title1}</span>
                        <span className="promo-title-2">{slide.title2}</span>
                      </div>
                      <div className="promo-shipping">
                        {slide.showShippingIcon !== false && (
                          <img src="/images/andreani.png" alt="Envío" className="shipping-icon" />
                        )}
                        <span className="shipping-text text-center">{slide.subtitle}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="slider-dots absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all transform cursor-pointer ${index === currentSlide
                    ? 'bg-orange-500 scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-80'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
