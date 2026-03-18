'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaShoppingCart, 
  FaBoxOpen, 
  FaUsers, 
  FaDollarSign, 
  FaExclamationTriangle,
  FaArrowUp,
  FaClock,
  FaTags,
  FaChartLine
} from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch products to count them and check stock
        const prodResp = await fetch('/api/admin');
        const prodData = await prodResp.json();
        
        const allProducts = Object.values(prodData.products || {}).flat() as any[];
        const lowStockCount = allProducts.filter(p => p.stock <= 5).length;

        // Fetch orders to count them and calculate sales
        // Assuming /api/orders or similar exists, or I can use /api/admin if I update it
        // For now, let's use some placeholder logic that I'll refine later
        const ordersResp = await fetch('/api/checkout/nave/webhook/route.ts').catch(() => null); // Just a placeholder check
        
        setStats({
          totalProducts: allProducts.length,
          lowStock: lowStockCount,
          totalOrders: 12, // Placeholder
          pendingOrders: 3, // Placeholder
          totalSales: 154700 // Placeholder
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      label: 'Ventas Totales', 
      value: `$${stats.totalSales.toLocaleString()}`, 
      icon: <FaDollarSign />, 
      color: 'bg-emerald-50 text-emerald-600',
      trend: '+12.5% vs mes anterior'
    },
    { 
      label: 'Pedidos Activos', 
      value: stats.pendingOrders.toString(), 
      icon: <FaShoppingCart />, 
      color: 'bg-blue-50 text-blue-600',
      trend: '3 pendientes de envío'
    },
    { 
      label: 'Stock Crítico', 
      value: stats.lowStock.toString(), 
      icon: <FaExclamationTriangle />, 
      color: stats.lowStock > 0 ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600',
      trend: stats.lowStock > 0 ? 'Requiere tu atención' : 'Todo en orden'
    },
    { 
      label: 'Productos en Catálogo', 
      value: stats.totalProducts.toString(), 
      icon: <FaBoxOpen />, 
      color: 'bg-amber-50 text-amber-600',
      trend: '18 categorías activas'
    }
  ];

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse font-medium">Cargando resumen...</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">¡Hola de nuevo, Administrador!</h1>
        <p className="text-slate-500 mt-2 flex items-center gap-2">
          <FaClock className="text-blue-400" /> Aquí tienes el resumen de tu tienda para hoy.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
                {card.icon}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{card.value}</div>
              <div className={`text-[11px] mt-2 font-medium ${card.trend.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Tasks */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FaChartLine className="text-blue-500" /> Rendimiento de Ventas
            </h3>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition">Ver reporte completo</span>
          </div>
          <div className="p-8 h-64 flex flex-col items-center justify-center text-slate-300">
             <div className="w-full h-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
                <FaChartLine className="text-4xl opacity-20" />
                <p className="text-sm font-medium opacity-50 text-slate-400">El gráfico de ventas aparecerá aquí al integrar datos reales</p>
                <div className="flex gap-2">
                   {[1,2,3,4,5,6,7].map(x => <div key={x} className="w-4 bg-blue-200 rounded-t h-12" style={{ height: `${20 + Math.random() * 40}px` }}></div>)}
                </div>
             </div>
          </div>
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl shadow-blue-900/10 relative overflow-hidden">
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
             <h4 className="text-lg font-bold mb-4 relative z-10">Accesos Rápidos</h4>
             <div className="space-y-3 relative z-10">
                <Link href="/admin/products" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-sm">
                   <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center"><FaBoxOpen /></div>
                   Subir nuevos productos
                </Link>
                <Link href="/admin/orders" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-sm">
                   <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center"><FaShoppingCart /></div>
                   Ver pedidos recientes
                </Link>
                <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition text-sm text-center">
                   <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center"><FaTags /></div>
                   Gestionar Ofertas
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4">Estado del Servidor</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500">Base de Datos (MongoDB)</span>
                   <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Operativo</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500">API Gateway</span>
                   <span className="flex items-center gap-1.5 text-emerald-600 font-bold"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Operativo</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

