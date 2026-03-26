'use client';

import { useState } from 'react';
import { FaShoppingBag, FaChevronRight, FaRegEye, FaCreditCard, FaTruck, FaSpinner, FaUpload } from 'react-icons/fa';
import OrderDetailsModal from './OrderDetailsModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <>
      <div 
        className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:border-slate-300 hover:shadow-sm group relative"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-slate-100 transition-colors">
            <FaShoppingBag size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <p className="text-base font-bold text-slate-900">Pedido #{order.id.substring(0, 8).toUpperCase()}</p>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                order.status === 'APPROVED' || order.status === 'SHIPPED' 
                  ? 'bg-green-50 text-green-700 border-green-100' 
                  : order.status === 'PENDING_REVIEW'
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-orange-50 text-orange-700 border-orange-100'
              }`}>
                {order.status === 'APPROVED' ? 'Aprobado' : order.status === 'SHIPPED' ? 'Enviado' : order.status === 'PENDING_REVIEW' ? 'En revisión' : 'Pendiente'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] font-bold uppercase mt-1 tracking-wider">
              {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full md:w-auto gap-6 sm:gap-10 mt-4 md:mt-0">
          <div className="text-left md:text-right flex flex-col justify-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total abonado</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight">${order.total.toLocaleString()}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* View Details Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-sm active:scale-95"
              title="Ver detalle de la compra"
            >
              <FaRegEye size={14} />
              <span>Ver Detalle</span>
            </button>

            {/* Conditional Action Button or Upload/View Transfer Button */}
            {(isPending || isReview) && (
              <button 
                onClick={handleAction}
                disabled={isPaying}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 ${
                  isReview ? 'bg-slate-900 text-white border-slate-800' : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
                }`}
              >
                {isPaying ? <FaSpinner className="animate-spin" size={14} /> : order.paymentMethod === 'TRANSFERENCIA' ? <FaUpload size={14} /> : <FaCreditCard size={14} />}
                <span>
                  {isPaying ? 'Procesando...' : 
                   isReview ? 'Ver Comprobante' : 
                   order.paymentMethod === 'TRANSFERENCIA' ? 'Subir Comprobante' : 'Realizar Pago'}
                </span>
              </button>
            )}

            {isApprovedOrShipped && (
              <Link 
                href={`/mi-cuenta/seguimiento?orderId=${order.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 transition-all font-bold text-[10px] uppercase tracking-wider cursor-pointer shadow-lg shadow-slate-900/10 active:scale-95 no-underline"
              >
                <FaTruck size={14} />
                <span>Seguimiento</span>
              </Link>
            )}
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailsModal 
        order={order}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
