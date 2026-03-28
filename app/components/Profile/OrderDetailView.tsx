'use client';

import { FaArrowLeft, FaShoppingBag, FaTruck, FaCreditCard, FaMapMarkerAlt, FaCircle } from 'react-icons/fa';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    shippingCost?: number;
    shippingMethod?: string;
  };
  paymentMethod?: 'NAVE' | 'TRANSFERENCIA';
}

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onAction: () => void;
  isPaying: boolean;
}

export default function OrderDetailView({ order, onBack, onAction, isPaying }: OrderDetailViewProps) {
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = order.shippingAddress?.shippingCost || 0;

  const isPending = order.status === 'PENDING';
  const isReview = order.status === 'PENDING_REVIEW';
  const isApprovedOrShipped = ['APPROVED', 'SHIPPED'].includes(order.status);

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      {/* Header with Back Button */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-4 border-slate-900 pb-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className="w-14 h-14 bg-slate-100 hover:bg-slate-900 hover:text-white transition-all rounded-none flex items-center justify-center cursor-pointer border-0 group"
          >
            <FaArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter m-0">Detalle del Pedido</h2>
            <p className="text-blue-600 text-[11px] font-black uppercase tracking-[0.5em] mt-3">#{order.id.substring(0, 16).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
           {isApprovedOrShipped && (
              <Link 
                href={`/mi-cuenta/seguimiento?orderId=${order.id}`}
                className="px-10 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-xl no-underline rounded-none text-center"
              >
                Rastrear Envío
              </Link>
           )}
           {(isPending || isReview) && (
              <button 
                onClick={onAction}
                disabled={isPaying}
                className="px-10 py-5 bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-xl rounded-none cursor-pointer border-0 disabled:opacity-50"
              >
                {order.paymentMethod === 'TRANSFERENCIA' ? 'Subir Ticket' : 'Pagar Ahora'}
              </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Main Content Side */}
        <div className="xl:col-span-2 space-y-16">
          {/* Status Section */}
          <div className="bg-white border border-slate-200 p-8 rounded-none flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
            <div className="flex items-center gap-8">
               <div className={`w-16 h-16 rounded-none flex items-center justify-center border-2 ${
                 isApprovedOrShipped ? 'border-green-600 text-green-600' : 'border-orange-500 text-orange-500'
               }`}>
                  {isApprovedOrShipped ? <FaTruck size={28} /> : <FaShoppingBag size={28} />}
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 opacity-60">Estado Actual</p>
                  <h3 className={`text-xl font-black uppercase tracking-tight ${isApprovedOrShipped ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.status === 'APPROVED' ? 'PAGO APROBADO' : order.status === 'SHIPPED' ? 'PEDIDO ENVIADO' : order.status === 'PENDING_REVIEW' ? 'PAGO EN REVISIÓN' : 'PENDIENTE DE PAGO'}
                  </h3>
               </div>
            </div>
            <div className="md:text-right md:border-r border-slate-200 md:pr-8 py-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 opacity-60">Fecha de Operación</p>
               <p className="text-lg font-bold text-slate-900 tracking-tight">
                 {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
               </p>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white border border-slate-200 p-1 rounded-none overflow-hidden shadow-sm">
            <h3 className="text-[11px] font-black text-slate-900 bg-slate-50 p-6 uppercase tracking-[0.5em] m-0 mb-4 inline-block w-full border-b border-slate-100">
               Ítems en la Orden
            </h3>
            <div className="p-10 space-y-0">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-10 border-b-2 border-slate-50 last:border-0 hover:bg-slate-50 px-10 -mx-10 transition-all group">
                  <div className="flex items-center gap-12">
                    <div className="w-14 h-14 bg-white rounded-none flex items-center justify-center text-sm font-black text-slate-900 border-2 border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-xl">
                      {item.quantity}
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 m-0 leading-none tracking-tighter uppercase">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-[0.2em]">P. Unitario: <span className="text-slate-900 font-black ml-1">${item.price.toLocaleString()}</span></p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter mt-8 sm:mt-0">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Space */}
        <div className="space-y-12">
           {order.shippingAddress && (
             <div className="space-y-8">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                  <FaMapMarkerAlt className="text-blue-600" size={18} /> Entrega Logística
               </h4>
               <div className="bg-white text-slate-900 p-10 rounded-none border border-slate-200 shadow-sm relative group">
                  <p className="text-xl font-black m-0 leading-tight tracking-tighter uppercase">{order.shippingAddress.street}</p>
                  <p className="text-xs text-slate-500 m-0 mt-4 font-black uppercase tracking-[0.2em]">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <div className="mt-10 inline-block bg-blue-600 text-white px-6 py-2 font-black text-[11px] uppercase tracking-[0.4em] shadow-lg">
                    C.P. {order.shippingAddress.zip}
                  </div>
               </div>
             </div>
           )}

           <div className="space-y-8">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                <FaCreditCard className="text-green-600" size={18} /> Resumen de Liquidación
              </h4>
               <div className="bg-white border border-slate-200 p-10 shadow-sm">
                 <div className="space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                       <span className="text-slate-400">Neto Productos</span>
                       <span className="text-slate-900 text-base font-bold">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                       <span className="text-slate-400">Logística ({order.shippingAddress?.shippingMethod || 'Standard'})</span>
                       <span className="text-green-600 text-base font-bold">{shippingCost === 0 ? 'SIN CARGO' : `$${shippingCost.toLocaleString()}`}</span>
                    </div>
                    <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col items-end">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Total Final</span>
                       <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">${order.total.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
