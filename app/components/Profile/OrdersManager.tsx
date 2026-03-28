'use client';

import { useState } from 'react';
import OrderCard from './OrderCard';
import OrderDetailView from './OrderDetailView';
import { FaShoppingBag, FaHistory } from 'react-icons/fa';
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

interface OrdersManagerProps {
  orders: Order[];
}

export default function OrdersManager({ orders }: OrdersManagerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const handleAction = async (order: Order) => {
    if (order.paymentMethod === 'TRANSFERENCIA') {
      const { useRouter } = require('next/navigation');
      const router = useRouter();
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
          p_mode: 'NORMAL', // Default logic
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

  if (selectedOrder) {
    return (
      <OrderDetailView 
        order={selectedOrder} 
        onBack={() => {
          setSelectedOrder(null);
          window.scrollTo(0, 0);
        }}
        onAction={() => handleAction(selectedOrder)}
        isPaying={isPaying}
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onViewDetail={() => {
              setSelectedOrder(order);
              window.scrollTo(0, 0);
            }} 
          />
        ))
      ) : (
        <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] p-24 text-center">
          <div className="w-20 h-20 bg-white border border-[#f1f5f9] rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-sm">
            <FaShoppingBag size={32} />
          </div>
          <h3 className="text-slate-900 font-black text-xl mb-4 uppercase tracking-tighter">Historial Vacío</h3>
          <p className="text-slate-400 text-[11px] mb-10 max-w-xs mx-auto font-bold uppercase tracking-widest opacity-40">Aún no has realizado ninguna compra con esta cuenta.</p>
          <Link href="/" className="inline-block px-12 py-5 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-[0.5em] hover:bg-blue-600 transition-all no-underline border-0 cursor-pointer">
            Ver Productos
          </Link>
        </div>
      )}
    </div>
  );
}
