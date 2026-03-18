'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheckCircle, 
  FaClock, 
  FaTruck,
  FaTimesCircle
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
        fetchOrders(); // Refresh
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 w-fit";
    switch (status.toLowerCase()) {
      case 'pagado':
      case 'paid':
        return <span className={`${base} bg-emerald-50 text-emerald-600`}><FaCheckCircle /> Pagado</span>;
      case 'pendiente':
      case 'pending':
        return <span className={`${base} bg-amber-50 text-amber-600`}><FaClock /> Pendiente</span>;
      case 'enviado':
      case 'shipped':
        return <span className={`${base} bg-blue-50 text-blue-600`}><FaTruck /> Enviado</span>;
      default:
        return <span className={`${base} bg-slate-50 text-slate-500`}>{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || o.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse font-medium">Cargando pedidos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Pedidos</h1>
          <p className="text-sm text-slate-500 mt-1">Monitorea las ventas y actualiza el estado de los envíos.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por Email o ID de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none cursor-pointer"
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden pb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="px-6 py-4">ID Pedido / Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-blue-600 font-bold">#{order.id}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700">{order.userEmail}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">${order.total?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition" title="Ver detalle">
                         <FaEye size={14} />
                       </button>
                       <select 
                         onChange={(e) => updateStatus(order.id, e.target.value)}
                         className="text-[10px] font-bold bg-white border border-slate-200 rounded px-2 py-1 outline-none"
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
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic text-sm">
                    No se encontraron pedidos que coincidan con la búsqueda.
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
