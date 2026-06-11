'use client';

import { useState } from 'react';
import { FaUser, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt, FaBox, FaCheckCircle, FaClipboardList, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

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
  proofUrl?: string;
  trackingCode?: string;
}

interface UserDashboardProps {
  user: any;
  orders: Order[];
}

export default function UserDashboard({ user, orders }: UserDashboardProps) {
  const router = useRouter();
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const activeOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PENDING_REVIEW' || o.status === 'APPROVED').length;
  const completedOrders = orders.filter(o => o.status === 'SHIPPED' || o.status === 'DELIVERED').length;
  const totalOrders = orders.length;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW': return 'Tu Pedido esta en Proceso de Preparacion y Envio!';
      case 'SHIPPED': return 'Pedido despachado.';
      case 'APPROVED': return 'Pago verificado, preparando pedido...';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return 'Pendiente de pago';
    }
  };

  const getStatusColorClass = (status: string) => {
    if (status === 'PENDING_REVIEW' || status === 'APPROVED' || status === 'SHIPPED') return 'bg-[#e6f4ea] text-[#137333]';
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-0 py-8 animate-in fade-in duration-500">
      
      {/* Mobile Title */}
      <div className="md:hidden mb-6 text-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Cuenta</h1>
        <p className="text-gray-500 text-sm mt-1">Hola, {user.name || 'Usuario'}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <div className="w-full lg:w-[300px] shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-32">
            {/* User Profile Info */}
            <div className="p-8 flex flex-col items-center border-b border-gray-100 text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-md overflow-hidden mb-4 flex items-center justify-center">
                <FaUser className="text-blue-200 text-4xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 m-0">{user.name || 'Usuario'}</h4>
              <p className="text-sm text-gray-500 font-medium mt-1 mb-4 break-all">{user.email}</p>
              <div className="bg-[#f0f4f8] text-[#405D99] text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                Cliente registrado
              </div>
            </div>

            {/* Navigation */}
            <ul className="flex flex-col m-0 p-0 list-none">
              <li>
                <a href="#datos-cuenta" className="flex items-center gap-3 px-8 py-5 text-gray-600 hover:text-[#405D99] hover:bg-gray-50 font-bold transition-colors border-b border-gray-50">
                  <FaUser className="text-lg opacity-50" /> Mis Datos
                </a>
              </li>
              <li>
                <a href="#pedidos-cuenta" className="flex items-center gap-3 px-8 py-5 text-gray-600 hover:text-[#405D99] hover:bg-gray-50 font-bold transition-colors border-b border-gray-50">
                  <FaBoxOpen className="text-lg opacity-50" /> Pedidos
                </a>
              </li>
              <li>
                <a href="#direccion-cuenta" className="flex items-center gap-3 px-8 py-5 text-gray-600 hover:text-[#405D99] hover:bg-gray-50 font-bold transition-colors border-b border-gray-50">
                  <FaMapMarkerAlt className="text-lg opacity-50" /> Mi Dirección
                </a>
              </li>
              <li>
                <a href="#" onClick={handleLogout} className="flex items-center gap-3 px-8 py-5 text-red-500 hover:bg-red-50 font-bold transition-colors">
                  <FaSignOutAlt className="text-lg opacity-50" /> Desconectarme
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <FaBox size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest m-0">Pedidos Activos</p>
                <h2 className="text-3xl font-black text-gray-900 m-0 leading-tight">{activeOrders}</h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <FaCheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest m-0">Finalizados</p>
                <h2 className="text-3xl font-black text-gray-900 m-0 leading-tight">{completedOrders}</h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                <FaClipboardList size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest m-0">Pedidos Totales</p>
                <h2 className="text-3xl font-black text-gray-900 m-0 leading-tight">{totalOrders}</h2>
              </div>
            </div>
          </div>

          {/* Mis Datos Section */}
          <div id="datos-cuenta" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-32">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 m-0">Mis Datos</h2>
              <p className="text-sm text-gray-500 mt-1 mb-0">Información principal de tu cuenta registrada.</p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">👤</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">Nombre y apellido</h6>
                  <p className="text-sm font-bold text-gray-900 m-0">{user.name || 'No informado'}</p>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">◎</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">Usuario</h6>
                  <p className="text-sm font-bold text-gray-900 m-0">{user.email?.split('@')[0] || 'No informado'}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">✉</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">Email</h6>
                  <p className="text-sm font-bold text-gray-900 m-0 break-all">{user.email}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">☎</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">Teléfono</h6>
                  <p className="text-sm font-bold text-gray-900 m-0">{user.phone || 'No informado'}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">▣</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">Empresa</h6>
                  <p className="text-sm font-bold text-gray-900 m-0">No informada</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 flex items-center gap-4 bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">▤</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">CUIT / DNI</h6>
                  <p className="text-sm font-bold text-gray-900 m-0">{user.dni || 'No informado'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mi Dirección Section */}
          <div id="direccion-cuenta" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-32">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 m-0">Mi Dirección</h2>
              <p className="text-sm text-gray-500 mt-1 mb-0">Dirección registrada para tus entregas.</p>
            </div>
            <div className="p-8">
              <div className="border border-gray-100 rounded-xl p-6 flex items-center gap-5 bg-gray-50/30">
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-500 shrink-0 text-xl">⌖</div>
                <div>
                  <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest m-0 mb-1">Dirección registrada</h6>
                  <p className="text-sm font-bold text-gray-900 m-0">
                    {user.address ? `${user.address.street} ${user.address.apartment ? ` - Depto: ${user.address.apartment}` : ''} · ${user.address.city} · ${user.address.state} · CP ${user.address.zip}` : 'Sin dirección registrada.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pedidos Recientes Section */}
          <div id="pedidos-cuenta" className="scroll-mt-32">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b-2 border-gray-900">
              <h2 className="text-2xl font-black text-gray-900 m-0 uppercase tracking-tight">Pedidos Recientes</h2>
              <button onClick={() => router.push('/')} className="text-sm font-bold text-gray-900 uppercase tracking-widest hover:underline mt-4 sm:mt-0 bg-transparent border-0 cursor-pointer">
                SEGUIR COMPRANDO
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 font-medium">
                No tienes pedidos registrados.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => {
                  const date = new Date(order.createdAt);
                  const isExpanded = openOrderId === order.id;

                  return (
                    <article key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:border-gray-300">
                      
                      {/* Order Header Info */}
                      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 border-b border-gray-100">
                        {/* Meta */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <span className="text-lg font-black text-gray-900 bg-gray-100 px-3 py-1 rounded w-fit">#{order.id.slice(0,8).toUpperCase()}</span>
                          <span className="text-sm text-gray-600 font-medium flex items-center gap-2">📅 {date.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                          <span className="text-sm text-gray-600 font-medium flex items-center gap-2">🕒 {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</span>
                        </div>

                        {/* Status Grid */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Numero de Guia:</span>
                            <strong className="text-sm text-gray-900">
                              {order.trackingCode ? (
                                <a href={`https://pago.andreani.com/seguimiento/${order.trackingCode}`} target="_blank" rel="noopener noreferrer" className="text-[#405D99] hover:underline flex items-center gap-1">
                                  {order.trackingCode} <FaExternalLinkAlt size={10} />
                                </a>
                              ) : (
                                "El correo enviará por Email su número"
                              )}
                            </strong>
                          </div>

                          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estado:</span>
                            <div className={`px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wide inline-block w-fit ${getStatusColorClass(order.status)}`}>
                              {getStatusText(order.status)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Body / Total & Proof */}
                      <div className="p-6 md:p-8 bg-gray-50/30 flex flex-col lg:flex-row items-center justify-between gap-6">
                        
                        <div className="flex flex-col items-center lg:items-start shrink-0">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total estimado</span>
                          <strong className="text-2xl font-black text-gray-900">${order.total.toLocaleString('es-AR')}</strong>
                          <small className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ESTIMADO</small>
                        </div>

                        {/* Proof Accordion Toggle */}
                        <div className="w-full max-w-lg">
                          <button 
                            onClick={() => setOpenOrderId(isExpanded ? null : order.id)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold text-lg">$</div>
                              <div className="text-left">
                                <strong className="block text-sm text-gray-900">Comprobantes de pago</strong>
                                <small className="text-xs text-gray-500">
                                  {order.proofUrl ? 'Ya recibimos el comprobante de este pedido.' : 'Subir comprobante o realizar pago.'}
                                </small>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {order.proofUrl && <span className="bg-[#e6f4ea] text-[#137333] px-2 py-1 rounded text-[10px] font-black uppercase">✓ Recibido</span>}
                              {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                            </div>
                          </button>

                          {/* Proof Accordion Panel */}
                          {isExpanded && (
                            <div className="mt-4 bg-white border border-[#137333]/20 rounded-xl p-6 shadow-inner animate-in slide-in-from-top-2 duration-300">
                              {order.proofUrl ? (
                                <div className="flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-[#137333] text-white flex items-center justify-center text-xl mb-2">✓</div>
                                  <strong className="text-lg text-gray-900">Comprobante principal cargado</strong>
                                  <p className="text-sm text-gray-500">Ya recibimos el comprobante. Podés visualizarlo a continuación.</p>
                                  
                                  <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 max-w-full overflow-hidden mt-4 w-full">
                                    {order.proofUrl.startsWith('data:image') ? (
                                      <img src={order.proofUrl} alt="Comprobante" className="max-w-full h-auto max-h-[300px] object-contain rounded mx-auto" />
                                    ) : order.proofUrl.startsWith('data:application/pdf') ? (
                                      <iframe src={order.proofUrl} className="w-full h-[300px] border-0 rounded" title="Comprobante PDF" />
                                    ) : (
                                      <a href={order.proofUrl} download="comprobante" className="text-[#137333] font-bold hover:underline text-sm flex items-center justify-center gap-2">
                                        <FaExternalLinkAlt /> Descargar Comprobante
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-6">
                                  <p className="text-sm text-gray-600 mb-6">Aún no se ha registrado el pago para este pedido.</p>
                                  <button 
                                    onClick={() => router.push(`/figuritas/transfer/${order.id}`)}
                                    className="bg-[#405D99] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all text-sm uppercase tracking-widest w-full sm:w-auto"
                                  >
                                    Ir a Pagar / Subir Comprobante
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
