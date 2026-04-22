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
  FaFileInvoiceDollar,
  FaTrash,
  FaPaperPlane
} from 'react-icons/fa';

interface Order {
  id: string;
  userEmail: string;
  userName?: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
  paymentMethod?: string;
  proofUrl?: string;
  proofUploadedAt?: string;
  invoiceUrl?: string;
  navePaymentId?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    shippingCost?: number;
    shippingMethod?: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [isRecoveringEmail, setIsRecoveringEmail] = useState(false);

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
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleSendRecoveryEmail = async (orderId: string) => {
    if (!confirm('¿Deseas enviar el mail de recuperación a este cliente?')) return;
    
    try {
      setIsRecoveringEmail(true);
      const res = await fetch('/api/admin/orders/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Mail de recuperación enviado con éxito.');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending recovery email:', error);
      alert('Error técnico al intentar enviar el mail.');
    } finally {
      setIsRecoveringEmail(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro que deseas ELIMINAR FÍSICAMENTE esta orden? Esta acción NO se puede deshacer.')) return;
    
    try {
      const resp = await fetch('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_order', orderId }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        fetchOrders();
      } else {
        alert('Hubo un error al eliminar el pedido.');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const handleInvoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, subí solo archivos PDF.');
      return;
    }

    try {
      setIsUploadingInvoice(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', orderId);

      const resp = await fetch('/api/admin/orders/upload-invoice', {
        method: 'POST',
        body: formData,
      });

      const data = await resp.json();
      if (data.success) {
        alert('Factura subida correctamente');
        fetchOrders();
        // Update local state if needed
        if (selectedOrder && selectedOrder.id === orderId) {
          // We'd need to fetch the updated order or just mock the update
          const updatedResp = await fetch('/api/admin/orders');
          const updatedData = await updatedResp.json();
          if (updatedData.success) {
            const upOrder = updatedData.orders.find((o: any) => o.id === orderId);
            if (upOrder) setSelectedOrder(upOrder);
          }
        }
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Error uploading invoice:', err);
      alert('Error crítico al subir la factura');
    } finally {
      setIsUploadingInvoice(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 w-fit";
    const s = status.toLowerCase();
    
    if (s === 'pagado' || s === 'approved' || s === 'paid') 
      return <span className={`${base} bg-emerald-50 text-emerald-600`}>Aprobado</span>;
    if (s === 'pendiente' || s === 'pending') 
      return <span className={`${base} bg-slate-50 text-slate-400`}>Pendiente</span>;
    if (s === 'pending_review' || s === 'revisión') 
      return <span className={`${base} bg-amber-50 text-amber-600`}>En Revisión</span>;
    if (s === 'enviado' || s === 'shipped') 
      return <span className={`${base} bg-blue-50 text-blue-600`}>Enviado</span>;
    if (s === 'cancelado' || s === 'cancelled') 
      return <span className={`${base} bg-red-50 text-red-600`}>Cancelado</span>;
    
    return <span className={`${base} bg-gray-50 text-gray-400`}>{status}</span>;
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.userName && o.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (filterStatus !== 'todos') {
      const s = o.status.toLowerCase();
      if (filterStatus === 'pendiente') matchesFilter = (s === 'pendiente' || s === 'pending');
      else if (filterStatus === 'revision') matchesFilter = (s === 'pending_review');
      else if (filterStatus === 'pagado') matchesFilter = (s === 'pagado' || s === 'approved' || s === 'paid');
      else matchesFilter = s === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse font-medium">Cargando pedidos...</div>;

  return (
    <div className="animate-fadeIn relative">
      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Orden #{selectedOrder.id?.slice(-8).toUpperCase() || '---'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Detalle Completo de Operación</p>
                 </div>
                 <button 
                   onClick={() => setSelectedOrder(null)}
                   className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 transition cursor-pointer"
                 >
                   <FaTimesCircle size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white">
                 <div className="flex flex-col gap-10">
                    
                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                       
                       <div className="space-y-10">
                          {/* Cliente */}
                          <section>
                             <h4 className="text-[10px] font-black text-[#058c8c] uppercase tracking-[0.3em] mb-4">Información del Cliente</h4>
                             <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                   <span className="text-[10px] text-gray-400 font-bold uppercase">Nombre:</span>
                                   <span className="text-[11px] font-black text-gray-800">{selectedOrder.userName || 'No especificado'}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                   <span className="text-[10px] text-gray-400 font-bold uppercase">Email:</span>
                                   <span className="text-[11px] font-black text-[#058c8c]">{selectedOrder.userEmail || '---'}</span>
                                </div>
                                <div className="flex justify-between">
                                   <span className="text-[10px] text-gray-400 font-bold uppercase">Medio de Pago:</span>
                                   <span className="text-[11px] font-black text-gray-800 uppercase">{selectedOrder.paymentMethod || 'NAVE'}</span>
                                </div>
                                {selectedOrder.navePaymentId && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                     <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">ID Transacción</p>
                                     <p className="text-[10px] font-mono font-bold text-gray-500 break-all bg-white p-2 rounded border border-gray-100 select-all">{selectedOrder.navePaymentId}</p>
                                  </div>
                                )}
                             </div>
                          </section>

                          {/* Envío */}
                          <section>
                             <h4 className="text-[10px] font-black text-[#058c8c] uppercase tracking-[0.3em] mb-4">Información de Envío</h4>
                             <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-100 space-y-4">
                                {selectedOrder.shippingAddress ? (
                                  <>
                                     <div className="flex flex-col">
                                        <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest mb-1">Dirección de Entrega</span>
                                        <span className="text-xs font-black text-gray-800 uppercase leading-tight">
                                          {selectedOrder.shippingAddress?.street || 'Sin calle'}
                                        </span>
                                        <span className="text-[11px] font-bold text-gray-500 uppercase mt-1">
                                          {selectedOrder.shippingAddress?.city || '---'}, {selectedOrder.shippingAddress?.state || '---'} ({selectedOrder.shippingAddress?.zip || '---'})
                                        </span>
                                     </div>
                                     <div className="flex justify-between items-center pt-3 border-t border-amber-200/40">
                                        <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest">{selectedOrder.shippingAddress?.shippingMethod || 'Envío'}</span>
                                        <span className="text-xs font-black text-gray-800">
                                          {typeof selectedOrder.shippingAddress?.shippingCost === 'number' ? 
                                            (selectedOrder.shippingAddress.shippingCost === 0 ? 'BONIFICADO' : `$${selectedOrder.shippingAddress.shippingCost.toLocaleString()}`) 
                                            : '---'}
                                        </span>
                                     </div>
                                  </>
                                ) : (
                                  <p className="text-[10px] text-gray-400 font-bold italic uppercase">Retiro en local / No especificado</p>
                                )}
                             </div>
                          </section>
                       </div>

                       <div className="space-y-10">
                          {/* Productos */}
                          <section>
                             <h4 className="text-[10px] font-black text-[#058c8c] uppercase tracking-[0.3em] mb-4">Detalle de Productos</h4>
                             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedOrder.items?.map((item: any, idx: number) => (
                                   <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded border border-gray-100 transition-colors hover:bg-gray-100/50">
                                      <div className="flex-1 pr-4">
                                         <p className="text-[11px] font-black text-gray-900 uppercase leading-tight">{item?.name || 'Producto'}</p>
                                         <p className="text-[10px] text-gray-400 font-bold mt-2 tracking-widest">CANTIDAD: {item?.quantity || 1}</p>
                                      </div>
                                      <span className="text-xs font-black text-gray-900 whitespace-nowrap">${((item?.price || 0) * (item?.quantity || 1)).toLocaleString()}</span>
                                   </div>
                                ))}
                             </div>
                             <div className="mt-6 flex justify-between items-center bg-[#058c8c] p-6 text-white rounded-lg shadow-xl shadow-[#058c8c]/10">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total a Cobrar</span>
                                <span className="text-2xl font-black tracking-tighter">${(selectedOrder.total || 0).toLocaleString()}</span>
                             </div>
                          </section>

                          {/* Comprobante */}
                          <section>
                             <h4 className="text-[10px] font-black text-[#058c8c] uppercase tracking-[0.3em] mb-4">Comprobante de Pago</h4>
                             <div className="h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                {selectedOrder.proofUrl ? (
                                   <>
                                      <img src={selectedOrder.proofUrl} className="w-full h-full object-contain" alt="Comprobante" />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                         <a href={selectedOrder.proofUrl} target="_blank" className="px-4 py-2 bg-white text-gray-900 font-black text-[9px] uppercase tracking-widest rounded">Ver Original</a>
                                      </div>
                                   </>
                                ) : (
                                   <div className="text-center p-6">
                                      <FaFileInvoiceDollar className="mx-auto text-gray-200 mb-2" size={32} />
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sin adjuntos</p>
                                   </div>
                                )}
                             </div>
                             {selectedOrder.proofUploadedAt && (
                               <p className="text-[9px] text-gray-400 font-bold uppercase text-right mt-2">Recibido: {new Date(selectedOrder.proofUploadedAt).toLocaleString('es-AR')}</p>
                             )}
                          </section>
                       </div>

                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
                 <div className="flex gap-3">
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'APPROVED')}
                      className="px-6 py-3 bg-emerald-600 text-white rounded font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition"
                    >
                      Aprobar Pago
                    </button>
                    {(selectedOrder.status === 'pending' || selectedOrder.status === 'pending_review') && (
                      <button 
                        onClick={() => handleSendRecoveryEmail(selectedOrder.id)}
                        disabled={isRecoveringEmail}
                        className="px-6 py-3 bg-[#405D99] text-white rounded font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-[#344e82] transition flex items-center gap-2 disabled:opacity-50"
                      >
                        <FaPaperPlane size={12} />
                        {isRecoveringEmail ? 'Enviando...' : 'Enviar Mail Recordatorio'}
                      </button>
                    )}
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'CANCELLED')}
                      className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition"
                    >
                      Cancelar
                    </button>
                 </div>
                 <div className="w-48">
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded font-bold text-[10px] uppercase tracking-widest text-gray-600 focus:border-[#058c8c] outline-none"
                    >
                       <option value="pending">Pendiente</option>
                       <option value="pending_review">En Revisión</option>
                       <option value="approved">Aprobado</option>
                       <option value="shipped">Enviado</option>
                       <option value="cancelled">Cancelado</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>
      )}

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

      {/* Control Bar */}
      <div className="admin-v2-card mb-10 p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input 
            type="text" 
            placeholder="Buscar por ID, Email o Nombre..."
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
            <option value="revision">En Revisión</option>
            <option value="pagado">Pagados / Aprobados</option>
            <option value="enviado">Enviados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-v2-card overflow-hidden mb-20 shadow-sm border border-[#f1f5f9]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-[#f1f5f9]">
                <th className="px-6 py-5">Pedido / Fecha</th>
                <th className="px-6 py-5">Cliente</th>
                <th className="px-6 py-5 w-40">Total</th>
                <th className="px-6 py-5 w-40">Estado</th>
                <th className="px-6 py-5 w-24 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition group">
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-gray-900 tracking-tight">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-black text-gray-800 uppercase leading-none mb-1">{order.userName || 'Cliente'}</span>
                       <span className="text-[10px] font-medium text-gray-400 lowercase">{order.userEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-gray-900 tracking-tighter">${order.total?.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-6">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="w-10 h-10 flex items-center justify-center bg-transparent border border-gray-100 text-gray-300 rounded hover:border-emerald-500 hover:text-emerald-500 transition cursor-pointer group-hover:border-emerald-200" title="Ver detalle">
                          <FaEye size={16} />
                        </button>
                        <button 
                          onClick={() => deleteOrder(order.id)}
                          className="w-10 h-10 flex items-center justify-center bg-transparent border border-gray-100 text-gray-300 rounded hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition cursor-pointer group-hover:border-red-200" title="Eliminar definitivamente">
                          <FaTrash size={14} />
                        </button>
                      </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-300 font-black uppercase tracking-[0.4em] text-[10px]">
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
