'use client';

import React from 'react';
import { FaTags, FaPlus } from 'react-icons/fa';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
          <p className="text-sm text-slate-500 mt-1">Organiza tus productos para que los clientes los encuentren más rápido.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm font-semibold text-sm">
          <FaPlus /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-3xl mb-4">
          <FaTags />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Próximamente</h3>
        <p className="text-slate-500 text-sm max-w-xs mt-2 italic">
          Estamos trabajando en una interfaz intuitiva para que puedas crear, editar y organizar jerarquías de categorías fácilmente.
        </p>
      </div>
    </div>
  );
}
