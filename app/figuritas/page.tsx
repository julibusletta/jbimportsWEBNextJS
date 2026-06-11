'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaShieldAlt, FaTruck, FaSpinner, FaUserLock } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '../context/AuthModalContext';
import { PACKS } from './data';

export default function FiguritasPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openLogin } = useAuthModal();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBuy = async (pack: typeof PACKS[0]) => {
    if (status === 'unauthenticated') {
      openLogin('/figuritas');
      return;
    }
    setLoadingId(pack.id);
    router.push(`/figuritas/envio?pack=${pack.id}`);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden pb-32">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 md:px-10 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#001489]/30 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ffed00]/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <img 
            src="/images/panini-logo.png" 
            alt="Panini" 
            className="w-48 md:w-64 h-auto mb-10 filter drop-shadow-lg"
          />
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ fontFamily: 'var(--font-orbitron)' }}>
            MUNDIAL <span className="text-[#ffed00] drop-shadow-[0_0_15px_rgba(255,237,0,0.3)]">2026</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl leading-relaxed" style={{ marginBottom: '1rem' }}>
            Asegurá tu pasión. Comprá tus figuritas del mundial directo por transferencia bancaria y obtené el mejor precio garantizado.
          </p>
          
          <div className="flex gap-4 md:gap-8 justify-center text-sm font-bold tracking-widest uppercase text-gray-400" style={{ marginBottom: '1rem' }}>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-[#001489]" size={20} />
              <span>Cajas Selladas</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTruck className="text-[#001489]" size={20} />
              <span>Envío Rápido</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-4 md:px-10 w-full mx-auto flex justify-center" style={{ marginTop: '1rem', marginBottom: '6rem', paddingBottom: '2rem' }}>
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center md:items-stretch gap-4 md:gap-8 w-full max-w-7xl mx-auto">
          {PACKS.map((pack) => (
            <div 
              key={pack.id} 
              onClick={() => {
                if (loadingId === null) handleBuy(pack);
              }}
              className={`relative w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-[400px] bg-[#111111] border ${pack.popular ? 'border-[#ffed00] scale-105 shadow-[0_0_30px_rgba(255,237,0,0.15)] z-20' : 'border-gray-800'} rounded-none overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-gray-600 flex flex-col mx-auto cursor-pointer`}
            >
              {pack.popular && (
                <div className="absolute top-0 left-0 w-full bg-[#ffed00] text-black text-[10px] font-black uppercase tracking-[0.2em] text-center py-1.5 z-10">
                  Más Elegido
                </div>
              )}
              
              <div className="relative overflow-hidden group flex items-center justify-center">
                <img 
                  src={pack.image} 
                  alt={pack.title}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105 relative z-0"
                />
                {pack.badge && (
                  <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-xl z-20 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                    {pack.badge}
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-1 relative z-20" style={{ paddingBottom: '1rem' }}>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">{pack.title}</h3>
                <p className="text-gray-400 text-sm mb-8 flex-1">{pack.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-black text-white tracking-tighter">${pack.price.toLocaleString('es-AR')}</span>
                  <span className="text-gray-500 text-sm ml-2 font-medium">ARS</span>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (loadingId === null) handleBuy(pack);
                  }}
                  disabled={loadingId !== null}
                  className={`w-full py-4 rounded-none font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                    pack.popular 
                      ? 'bg-[#ffed00] text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                      : 'bg-[#001489] text-white hover:bg-[#0022cc] border border-[#0022cc]'
                  }`}
                >
                  {loadingId === pack.id ? (
                    <>
                      <FaSpinner className="animate-spin" /> Procesando...
                    </>
                  ) : status === 'unauthenticated' ? (
                    <>
                      <FaUserLock /> Iniciar sesión
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Comprar Ahora
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest" style={{ marginTop: '0.5rem' }}>
                  * Pago exclusivo por transferencia
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
