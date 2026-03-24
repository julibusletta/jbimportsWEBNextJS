'use client';

import React from 'react';
import Link from 'next/link';
import { FaTags, FaPlus, FaHammer } from 'react-icons/fa';

export default function CategoriesPage() {
  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Categorías</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Catálogo</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-gray-100 text-gray-400 rounded text-sm font-bold cursor-not-allowed flex items-center gap-2">
            <FaPlus /> Nueva Categoría
          </button>
        </div>
      </div>

      <div className="admin-v2-card p-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#edeeef] rounded-full flex items-center justify-center text-[#058c8c] text-3xl mb-8">
          <FaHammer />
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Módulo en Construcción</h3>
        <p className="text-gray-400 text-xs max-w-sm mt-4 leading-relaxed font-medium">
          Estamos diseñando una experiencia de gestión de taxonomía de nivel premium. Pronto podrás organizar tus productos con jerarquías ilimitadas y atributos personalizados.
        </p>
        <div className="mt-10 pt-10 border-t border-gray-100 w-full max-w-xs">
           <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Estado del Proyecto</div>
           <div className="h-1.5 w-full bg-gray-50 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-[#058c8c] w-[65%] rounded-full shadow-lg shadow-[#058c8c]/20"></div>
           </div>
           <div className="text-[10px] text-[#058c8c] font-black mt-3">65% COMPLETADO</div>
        </div>
      </div>
    </div>
  );
}
