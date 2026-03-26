'use client';

import { FaTimes, FaShoppingBag, FaTruck, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

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
}

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen) return null;

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = order.shippingAddress?.shippingCost || 0;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-12 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-6xl rounded-none shadow-[0_60px_180px_rgba(0,0,0,0.7)] overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-32 py-16 flex items-center justify-between text-white border-b-[12px] border-blue-600">
          <div className="flex items-center gap-10">
            <div className="w-16 h-16 bg-slate-800 rounded-none flex items-center justify-center border border-blue-500/30">
              <FaShoppingBag size={24} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black m-0 tracking-tight text-white uppercase">Detalle del Pedido</h2>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.5em] m-0 mt-3 opacity-60">#{order.id.substring(0, 16).toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 hover:bg-white/10 flex items-center justify-center transition-all border-0 bg-transparent text-white cursor-pointer group"
          >
            <FaTimes size={28} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto space-y-24 py-24 px-32">
          {/* Status and Date */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 border-b-2 border-slate-100 pb-20">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Estado del Pedido</p>
              <div className="flex">
                <span className={`inline-flex items-center px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.3em] ${
                  order.status === 'APPROVED' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
                }`}>
                  {order.status === 'APPROVED' ? 'PAGO APROBADO' : 'PENDIENTE DE PAGO'}
                </span>
              </div>
            </div>
            <div className="md:text-right space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Fecha de Operación</p>
              <p className="text-xl font-bold text-slate-900 m-0 tracking-tight">
                {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 flex items-center gap-6">
              <span className="w-1.5 h-6 bg-blue-600"></span>
              Ítems en la Orden
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-8 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-8 -mx-8 transition-all group">
                  <div className="flex items-center gap-10">
                    <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center text-xs font-black text-slate-900 border-2 border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                      {item.quantity}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 m-0 leading-tight tracking-tight">{item.name}</p>
                      <p className="text-[9px] text-slate-400 font-black mt-2 uppercase tracking-[0.2em]">P. Unitario: <span className="text-slate-900 font-bold ml-1">${item.price.toLocaleString()}</span></p>
                    </div>
                  </div>
                  <p className="text-xl font-black text-slate-900 tracking-tighter italic border-b-2 border-blue-500/10">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping and Payment Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 pt-12">
            {order.shippingAddress && (
              <div className="space-y-8">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                  <FaMapMarkerAlt className="text-blue-600" /> Entrega Logística
                </h4>
                <div className="bg-slate-900 text-white p-10 rounded-none border-l-[8px] border-blue-600 shadow-xl">
                  <p className="text-xl font-black m-0 leading-tight tracking-tight uppercase">{order.shippingAddress.street}</p>
                  <p className="text-xs text-slate-400 m-0 mt-4 font-bold uppercase tracking-wider opacity-80">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <div className="mt-8">
                    <span className="text-[9px] font-black bg-blue-600 px-4 py-1 uppercase tracking-[0.3em]">CP: {order.shippingAddress.zip}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-8">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-4">
                <FaCreditCard className="text-green-600" /> Liquidación
              </h4>
              <div className="space-y-6 bg-slate-50 p-10 rounded-none border border-slate-200">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-black uppercase tracking-[0.2em]">Neto Productos</span>
                  <span className="font-bold text-slate-900 text-base">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 font-black uppercase tracking-[0.2em]">Logística ({order.shippingAddress?.shippingMethod || 'Estándar'})</span>
                  <span className="font-black text-green-600 text-base">{shippingCost === 0 ? 'SIN CARGO' : `$${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between pt-10 mt-6 border-t-2 border-slate-200 items-baseline">
                  <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em]">Total Operación</span>
                  <span className="text-4xl font-black text-blue-600 tracking-tighter">${order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-32 py-12 bg-slate-900 flex justify-end border-t-2 border-slate-800">
          <button 
            onClick={onClose}
            className="px-12 py-5 bg-blue-600 text-white rounded-none font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-[0_10px_40px_rgba(37,99,235,0.3)] active:scale-95 border-0 cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
