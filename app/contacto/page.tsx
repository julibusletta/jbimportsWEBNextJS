'use client';

import React from 'react';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaClock, FaChevronRight } from 'react-icons/fa';

export default function ContactoPage() {
  const contactMethods = [
    {
      title: 'WhatsApp',
      value: '+54 9 11 5145-7720',
      description: 'Atención inmediata para ventas y consultas de stock.',
      link: 'https://wa.me/5491151457720',
      icon: <FaWhatsapp className="text-green-500" size={24} />,
      label: 'Enviar mensaje'
    },
    {
      title: 'Instagram',
      value: '@jbimportsarg',
      description: 'Seguinos para ver las últimas novedades y ofertas.',
      link: 'https://www.instagram.com/jbimportsarg',
      icon: <FaInstagram className="text-purple-600" size={24} />,
      label: 'Ver perfil'
    }
  ];

  const emailMethods = [
    {
      title: 'Consultas Generales',
      value: 'contacto@jbimports.com.ar',
      icon: <FaEnvelope className="text-slate-400" size={18} />
    },
    {
      title: 'Ventas y Pedidos',
      value: 'ventas@jbimports.com.ar',
      icon: <FaEnvelope className="text-slate-400" size={18} />
    },
    {
      title: 'Soporte Técnico',
      value: 'soporte@jbimports.com.ar',
      icon: <FaEnvelope className="text-slate-400" size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-20 text-center flex flex-col items-center">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-4">Canales Oficiales</p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter m-0">Contacto</h1>
          <div className="w-16 h-1.5 bg-slate-900 mt-6"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Direct Channels */}
          <section>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Atención Directa</h2>
            <div className="space-y-6">
              {contactMethods.map((method) => (
                <a 
                  key={method.title}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-8 border border-slate-100 bg-white transition-all hover:border-slate-900 no-underline"
                >
                  <div className="flex items-center justify-between mb-4">
                    {method.icon}
                    <FaChevronRight size={12} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 m-0 mb-1">{method.title}</h3>
                  <p className="text-blue-600 font-bold text-xs mb-4">{method.value}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mb-0">{method.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Email and Hours */}
          <div className="space-y-12">
            <section>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Casillas de Correo</h2>
              <div className="space-y-3">
                {emailMethods.map((email) => (
                  <div key={email.title} className="p-5 border border-slate-100 flex items-center gap-6">
                    <div className="w-10 h-10 bg-slate-50 flex items-center justify-center">
                      {email.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{email.title}</p>
                      <a href={`mailto:${email.value}`} className="text-sm font-bold text-slate-900 no-underline hover:text-blue-600 transition-colors">{email.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-slate-50 border border-slate-100 text-slate-900">
              <div className="flex items-center gap-4 mb-6">
                <FaClock className="text-blue-600" size={18} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] m-0">Horarios de Atención</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Lunes a Viernes</p>
                  <p className="text-base font-black tracking-tight">09:00 — 20:00 HS</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1">Sábados y Domingos</p>
                  <p className="text-base font-black tracking-tight">11:00 — 18:00 HS</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="mt-20 pt-10 border-t border-slate-100">
          <p className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-xl">
            JB Imports es una marca registrada de Julian Busletta. 
            Todas nuestras comunicaciones oficiales se realizan a través de los canales listados en esta página. 
            No compartas información sensible fuera de estos medios.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
