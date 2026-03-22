'use client';

import '../../styles/LogosMarquee.css';

const logos = [
  { id: 1, src: '/images/logoapple.png', alt: 'Apple' },
  { id: 2, src: '/images/jbl-2-logo-png-transparent.webp', alt: 'JBL' },
  { id: 3, src: '/images/5699546321769097351706x1280.webp', alt: 'Samsung' },
  { id: 4, src: '/images/images.webp', alt: 'Sony' },
  { id: 5, src: '/images/logorealme.png', alt: 'Realme' },
  { id: 6, src: '/images/66964.webp', alt: 'ASUS' },
];

import { useEffect, useState } from 'react';

export default function LogosMarquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section id="logos" className="logos-marquee w-full py-16 md:py-20 bg-white border-t border-b border-gray-200 overflow-hidden" data-aos="fadeInUp" suppressHydrationWarning>
        <div className="logos-container w-full overflow-hidden" suppressHydrationWarning>
          <div className="logos-track flex" style={{ width: 'calc(200px * 12)' }}></div>
        </div>
      </section>
    );
  }
  return (
    <section id="logos" className="logos-marquee w-full py-16 md:py-20 bg-white border-t border-b border-gray-200 overflow-hidden" data-aos="fadeInUp" suppressHydrationWarning>
      <div className="logos-container w-full overflow-hidden" suppressHydrationWarning>
        <div className="logos-track flex animate-scroll" style={{ width: 'max-content' }}>
          {/* Duplicate set 4 times for seamless loop on wide screens */}
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="logo-item flex-shrink-0 w-[200px] h-16 flex items-center justify-center opacity-70 transition-opacity duration-300 hover:opacity-100"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-[120px] max-h-16 object-contain filter grayscale transition-all duration-300 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLogos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }

        .animate-scroll {
          animation: scrollLogos 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
