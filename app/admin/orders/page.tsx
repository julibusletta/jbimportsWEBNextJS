'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheckCircle, 
  FaClock, 
  FaTruck,
  FaTimesCircle,
  FaFileInvoiceDollar
} from 'react-icons/fa';

interface Order {
  id: string;
  userEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin/orders');
      const data = await resp.json();
      if (data.success) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const resp = await fetch('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({ action: 'update_status', orderId, status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 w-fit";
    switch (status.toLowerCase()) {
      case 'pagado':
      case 'paid':
        return <span className={`${base} bg-emerald-50 text-emerald-600`}>Pagado</span>;
      case 'pendiente':
      case 'pending':
        return <span className={`${base} bg-amber-50 text-amber-600`}>Pendiente</span>;
      case 'enviado':
      case 'shipped':
        return <span className={`${base} bg-blue-50 text-blue-600`}>Enviado</span>;
      case 'cancelado':
      case 'cancelled':
        return <span className={`${base} bg-red-50 text-red-600`}>Cancelado</span>;
      default:
        return <span className={`${base} bg-gray-50 text-gray-400`}>{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || o.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse font-medium">Cargando pedidos...</div>;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Pedidos</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Ventas</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-gray-900 text-white rounded text-sm font-bold hover:shadow-lg transition flex items-center gap-2">
            <FaFileInvoiceDollar /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="admin-v2-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl">
             <FaShoppingCart />
          </div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Total Pedidos</div>
             <div className="text-xl font-black text-gray-900">{orders.length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5 border-l-4 border-l-amber-500">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl">
             <FaClock />
          </div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Pendientes</div>
             <div className="text-xl font-black text-gray-900">{orders.filter(o => o.status.toLowerCase() === 'pendiente').length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
             <FaTruck />
          </div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">En camino</div>
             <div className="text-xl font-black text-gray-900">{orders.filter(o => o.status.toLowerCase() === 'enviado').length}</div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="admin-v2-card mb-10 p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            placeholder="Buscar por Email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm transition focus:border-[#058c8c] focus:bg-white"
          />
        </div>
        <div className="w-full md:w-64">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold text-gray-600 appearance-none cursor-pointer focus:border-[#058c8c]"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagado">Pagados</option>
            <option value="enviado">Enviados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-v2-card overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[9px] font-black uppercase tracking-widest border-b border-[#e1e3e5]">
                <th className="px-6 py-4">Pedido / Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4 w-40">Total</th>
                <th className="px-6 py-4 w-32">Estado</th>
                <th className="px-6 py-4 w-40 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5]">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition shadow-none hover:shadow-inner">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#058c8c]">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-gray-800">{order.userEmail}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-900">${order.total?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                       <button className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 rounded hover:bg-gray-100 transition" title="Ver detalle">
                         <FaEye size={14} />
                       </button>
                       <select 
                         onChange={(e) => updateStatus(order.id, e.target.value)}
                         className="text-[9px] font-black uppercase tracking-widest bg-white border border-[#e1e3e5] rounded px-2 py-1.5 outline-none focus:border-[#058c8c]"
                         defaultValue={order.status}
                       >
                         <option value="pendiente">Pendiente</option>
                         <option value="pagado">Pagado</option>
                         <option value="enviado">Enviado</option>
                         <option value="cancelado">Cancelado</option>
                       </select>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic text-sm">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
