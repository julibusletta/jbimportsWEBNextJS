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
    image: '/images/MacBookAirM410.webp',
    alt: 'MacBook Pro',
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
      <div className={`hero-content max-w-4xl w-full mb-16 opacity-100 transition-opacity duration-700 text-center z-10 ${!isTyping ? 'fade-out' : ''}`}>
        <h1 className="typewriter text-5xl md:text-7xl font-bold leading-tight mb-8 letter-spacing-tight min-h-48 md:min-h-64 text-gray-900 transition-all duration-300">
          <span className="text-[#0066cc]">
            {displayText.slice(0, bluePart.length)}
          </span>
          {displayText.length > bluePart.length && <br />}
          <span className="text-black">
            {displayText.slice(bluePart.length).trim()}
          </span>
          {isTyping && <span className="animate-pulse ml-1 text-gray-400">|</span>}
        </h1>
        <p className="hero-hidden text-2xl text-gray-600 mb-12 font-medium leading-relaxed opacity-0 animate-fadeInUp delay-500">
          Los mejores precios del mercado
        </p>
        <a
          href="#contact"
          className="hero-hidden inline-block bg-gray-900 text-white px-10 py-3 rounded text-lg font-semibold transition-all hover:bg-gray-800 transform hover:-translate-y-0.5 opacity-0 animate-fadeInUp delay-1000"
        >
          Acceder al shop!
        </a>
      </div>

      {/* Hero Slider */}
      <div className={`hero-slider flex items-center justify-center ${!isTyping ? 'active' : ''}`}>
        <div className="slider-container">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
              />
            </div>
          ))}

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
