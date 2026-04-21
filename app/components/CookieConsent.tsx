'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('jbi_cookie_consent');
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    localStorage.setItem('jbi_cookie_consent', level);
    setShow(false);
    // Reload tracking scripts
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-2">Tu privacidad en JB Imports</h3>
          <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
            Utilizamos cookies propias y de terceros para analizar tu navegación con fines estadísticos y mostrate publicidad personalizada en redes sociales basada en tus intereses. Al aceptar, nos permites mejorar tu experiencia y ofrecerte ofertas exclusivas.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 shrink-0">
          <button 
            onClick={() => handleConsent('essential')}
            className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition"
          >
            Solo esenciales
          </button>
          <button 
            onClick={() => handleConsent('all')}
            className="px-8 py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
