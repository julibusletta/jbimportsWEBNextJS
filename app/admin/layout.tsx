'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaTags, 
  FaCog, 
  FaExternalLinkAlt, 
  FaChartLine 
} from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Resumen', href: '/admin', icon: <FaChartLine /> },
    { label: 'Productos', href: '/admin/products', icon: <FaBox /> },
    { label: 'Pedidos', href: '/admin/orders', icon: <FaShoppingCart /> },
    { label: 'Categorías', href: '/admin/categories', icon: <FaTags /> },
    { label: 'Configuración', href: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col sticky top-0 h-screen z-50 shadow-2xl">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">JB</div>
          <span className="font-bold text-xl tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link 
            href="/" 
            className="flex items-center justify-between gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-sm font-semibold group"
          >
            <span className="flex items-center gap-2">
               <FaExternalLinkAlt className="text-blue-400 group-hover:rotate-12 transition-transform" />
               Ver Tienda
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] text-slate-500">Alt + L</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 min-h-screen bg-[#f8fafc] w-full overflow-x-hidden">
        {/* Header decoration or breadcrumbs can go here */}
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
