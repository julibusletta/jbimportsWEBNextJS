'use client';

import { useState } from 'react';
import { FaShoppingBag, FaChevronDown, FaChevronUp, FaRegEye, FaCreditCard, FaTruck, FaSpinner, FaUpload, FaMapMarkerAlt, FaCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = order.shippingAddress?.shippingCost || 0;

  const handleAction = async () => {
    if (order.paymentMethod === 'TRANSFERENCIA') {
      router.push(`/checkout/transfer/${order.id}`);
      return;
    }

    try {
      setIsPaying(true);
      const response = await fetch('/api/checkout/nave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          items: order.items,
          total: order.total,
          shipping: {
            cost: order.shippingAddress?.shippingCost || 0,
            method: order.shippingAddress?.shippingMethod || 'Estándar',
            address: {
              street: order.shippingAddress?.street?.split(' ')[0] || '',
              number: order.shippingAddress?.street?.split(' ')[1] || '',
              city: order.shippingAddress?.city || '',
              state: order.shippingAddress?.state || '',
              zipCode: order.shippingAddress?.zip || ''
            }
          }
        }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al iniciar el pago: ' + data.message);
      }
    } catch (error) {
      console.error('Error restarting payment:', error);
      alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setIsPaying(false);
    }
  };

  const isPending = order.status === 'PENDING';
  const isReview = order.status === 'PENDING_REVIEW';
  const isApprovedOrShipped = ['APPROVED', 'SHIPPED'].includes(order.status);

  return (
    <div className="flex flex-col gap-0 border-2 border-slate-900 rounded-none overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/40">
      <div 
        className={`p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all relative ${
          isExpanded ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-b border-slate-100 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-none flex items-center justify-center border transition-colors ${
            isExpanded ? 'bg-slate-800 border-blue-500/30 text-blue-500' : 'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            <FaShoppingBag size={24} />
          </div>
          <div>
            <div className="flex items-center gap-4">
              <p className={`text-xl font-black tracking-tight uppercase ${isExpanded ? 'text-white' : 'text-slate-900'}`}>
                Pedido #{order.id.substring(0, 8).toUpperCase()}
              </p>
              <span className={`px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-[0.3em] border ${
                order.status === 'APPROVED' || order.status === 'SHIPPED' 
                  ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-600/20' 
                  : order.status === 'PENDING_REVIEW'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-orange-500 text-white border-orange-400'
              }`}>
                {order.status === 'APPROVED' ? 'PAGO APROBADO' : order.status === 'SHIPPED' ? 'ENVIADO' : order.status === 'PENDING_REVIEW' ? 'EN REVISIÓN' : 'PENDIENTE'}
              </span>
            </div>
            <p className={`text-[11px] font-black uppercase mt-2 tracking-[0.2em] ${isExpanded ? 'text-slate-400' : 'text-slate-400'}`}>
              {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full md:w-auto gap-8 sm:gap-14 mt-6 md:mt-0">
          <div className="text-left md:text-right flex flex-col justify-center border-l-4 md:border-l-0 md:border-r-4 border-blue-600 pl-4 md:pl-0 md:pr-4 py-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 opacity-60">Total abonado</p>
            <p className={`text-2xl font-black tracking-tighter ${isExpanded ? 'text-white' : 'text-slate-900'}`}>${order.total.toLocaleString()}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Toggle Details Button */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-3 px-6 py-4 rounded-none border-2 transition-all font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer shadow-xl active:scale-95 ${
                isExpanded 
                  ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700' 
                  : 'bg-slate-50 text-slate-900 border-slate-900 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {isExpanded ? <FaChevronUp size={14} /> : <FaRegEye size={14} />}
              <span>{isExpanded ? 'Cerrar Detalle' : 'Ver Detalle'}</span>
            </button>

            {/* Conditional Action Button */}
            {(isPending || isReview) && (
              <button 
                onClick={handleAction}
                disabled={isPaying}
                className={`flex items-center gap-3 px-6 py-4 rounded-none transition-all font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer shadow-xl active:scale-95 disabled:opacity-50 ${
                  isReview 
                    ? (isExpanded ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') 
                    : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
                }`}
              >
                {isPaying ? <FaSpinner className="animate-spin" size={14} /> : order.paymentMethod === 'TRANSFERENCIA' ? <FaUpload size={14} /> : <FaCreditCard size={14} />}
                <span>
                  {isPaying ? 'Procesando...' : 
                   isReview ? 'Comprobante' : 
                   order.paymentMethod === 'TRANSFERENCIA' ? 'Subir Ticket' : 'Pagar Ahora'}
                </span>
              </button>
            )}

            {isApprovedOrShipped && !isExpanded && (
              <Link 
                href={`/mi-cuenta/seguimiento?orderId=${order.id}`}
                className="flex items-center gap-3 px-6 py-4 rounded-none bg-slate-900 text-white border-2 border-slate-900 hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer shadow-xl active:scale-95 no-underline"
              >
                <FaTruck size={14} />
                <span>Rastrear</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details Area */}
      {isExpanded && (
        <div className="bg-white p-12 animate-in slide-in-from-top-4 duration-500 border-t-2 border-slate-100">
           <div className="space-y-20">
              {/* Items Section */}
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] mb-12 flex items-center gap-6">
                  <span className="w-1.5 h-6 bg-blue-600"></span>
                  Ítems Comprados
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-10 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-10 -mx-10 transition-all group">
                      <div className="flex items-center gap-12">
                        <div className="w-14 h-14 bg-white rounded-none flex items-center justify-center text-sm font-black text-slate-900 border-2 border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-lg">
                          {item.quantity}
                        </div>
                        <div>
                          <p className="text-xl font-black text-slate-900 m-0 leading-none tracking-tighter uppercase">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-[0.2em]">Precio Unitario: <span className="text-slate-900 font-black ml-1">${item.price.toLocaleString()}</span></p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter italic border-b-4 border-blue-500/10 mt-6 sm:mt-0">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 pt-10">
                {order.shippingAddress && (
                  <div className="space-y-10">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                       <FaMapMarkerAlt className="text-blue-600" size={18} /> Destino Entrega
                    </h4>
                    <div className="bg-slate-900 text-white p-12 rounded-none border-l-[16px] border-blue-600 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-none rotate-45 group-hover:scale-150 transition-transform duration-1000"></div>
                      <p className="text-2xl font-black m-0 leading-tight tracking-tighter uppercase">{order.shippingAddress.street}</p>
                      <p className="text-xs text-slate-400 m-0 mt-5 font-black uppercase tracking-[0.2em] opacity-80">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <div className="mt-10 inline-block bg-blue-600 text-white px-6 py-2 font-black text-[11px] uppercase tracking-[0.4em] shadow-lg">
                        C.P. {order.shippingAddress.zip}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-10">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-5">
                    <FaCreditCard className="text-green-600" size={18} /> Resumen Operación
                  </h4>
                  <div className="bg-white border-4 border-slate-900 p-12 rounded-none relative">
                    <div className="space-y-8">
                      <div className="flex justify-between items-center bg-slate-50 p-4 border-l-4 border-slate-200">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Neto Mercadería</span>
                        <span className="font-black text-slate-900 text-lg tracking-tighter">${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-4 border-l-4 border-slate-200">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Logística ({order.shippingAddress?.shippingMethod || 'Standard'})</span>
                        <span className="font-black text-green-600 text-lg tracking-tighter">{shippingCost === 0 ? 'SIN CARGO' : `$${shippingCost.toLocaleString()}`}</span>
                      </div>
                      <div className="flex justify-between pt-10 mt-10 border-t-4 border-slate-900 items-end">
                        <span className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] mb-2">Total Final</span>
                        <span className="text-5xl font-black text-blue-600 tracking-tighter leading-none">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Inside Details */}
              <div className="flex flex-col sm:flex-row gap-6 justify-end pt-12 border-t-2 border-slate-50">
                 {isApprovedOrShipped && (
                    <Link 
                      href={`/mi-cuenta/seguimiento?orderId=${order.id}`}
                      className="px-10 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.5em] hover:bg-slate-800 transition-all shadow-xl text-center no-underline"
                    >
                      Rastrear Envío
                    </Link>
                 )}
                 <button 
                   onClick={() => setIsExpanded(false)}
                   className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 font-black text-[11px] uppercase tracking-[0.5em] hover:bg-slate-900 hover:text-white transition-all shadow-xl cursor-pointer"
                 >
                   Cerrar Vista Detallada
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
