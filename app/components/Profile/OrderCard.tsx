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
  onViewDetail: () => void;
}

export default function OrderCard({ order, onViewDetail }: OrderCardProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

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
    <div className="flex flex-col gap-0 border-2 border-slate-900 rounded-none overflow-hidden transition-all duration-300 shadow-xl shadow-slate-200/40 hover:bg-slate-50">
      <div className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all relative">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-none flex items-center justify-center border bg-slate-50 border-slate-100 text-slate-400">
            <FaShoppingBag size={24} />
          </div>
          <div>
            <div className="flex items-center gap-4">
              <p className="text-xl font-black tracking-tight uppercase text-slate-900">
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
            <p className="text-[11px] font-black uppercase mt-2 tracking-[0.2em] text-slate-400">
              {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full md:w-auto gap-8 sm:gap-14 mt-6 md:mt-0">
          <div className="text-left md:text-right flex flex-col justify-center border-l-4 md:border-l-0 md:border-r-4 border-blue-600 pl-4 md:pl-0 md:pr-4 py-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 opacity-60">Total abonado</p>
            <p className="text-2xl font-black tracking-tighter text-slate-900">${order.total.toLocaleString()}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* View Detail Button */}
            <button 
              onClick={onViewDetail}
              className="flex items-center gap-3 px-6 py-4 rounded-none border-2 border-slate-900 bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer shadow-xl active:scale-95"
            >
              <FaRegEye size={14} />
              <span>Ver Detalle</span>
            </button>

            {/* Conditional Action Button */}
            {(isPending || isReview) && (
              <button 
                onClick={handleAction}
                disabled={isPaying}
                className="flex items-center gap-3 px-6 py-4 rounded-none transition-all font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer shadow-xl active:scale-95 disabled:opacity-50 bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
              >
                {isPaying ? <FaSpinner className="animate-spin" size={14} /> : order.paymentMethod === 'TRANSFERENCIA' ? <FaUpload size={14} /> : <FaCreditCard size={14} />}
                <span>
                  {isPaying ? 'Procesando...' : 
                   isReview ? 'Comprobante' : 
                   order.paymentMethod === 'TRANSFERENCIA' ? 'Subir Ticket' : 'Pagar Ahora'}
                </span>
              </button>
            )}

            {isApprovedOrShipped && (
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
    </div>

  );
}
