import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt, FaCircle } from 'react-icons/fa';

export default async function SeguimientoPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const activeOrder = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const steps = [
    { label: 'Pedido Realizado', date: '12 Mar, 2024', status: 'completed' },
    { label: 'Procesando Pago', date: '12 Mar, 2024', status: 'completed' },
    { label: 'En Preparación', date: '13 Mar, 2024', status: 'current' },
    { label: 'Enviado', date: '-', status: 'pending' },
    { label: 'Entregado', date: '-', status: 'pending' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Seguimiento</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Rastreo en tiempo real de tus envíos activos.</p>
        </div>
        {activeOrder && (
          <div className="px-6 py-3 bg-slate-900 border-l-4 border-blue-600 rounded-none shadow-xl">
             <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mr-3">Nro Guía:</span>
             <span className="text-sm font-black text-white uppercase select-all tracking-[0.1em]">JB-{activeOrder.id.substring(0, 15).toUpperCase()}</span>
          </div>
        )}
      </div>

      {activeOrder ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Tracking Status Card */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-[0_15px_40px_rgba(37,99,235,0.3)] shrink-0">
                    <FaTruck size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight uppercase">En Camino</h3>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-3">Llegada estimada: <span className="text-blue-600 font-black ml-1">18 de Marzo</span></p>
                  </div>
               </div>

               {/* Stepper Vertical */}
               <div className="relative pl-1">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                  
                  <div className="space-y-20 py-4">
                    {steps.map((step, idx) => (
                      <div key={idx} className="relative pl-12 group">
                        {/* Dot */}
                        <div className={`absolute left-0 top-1.5 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                          step.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 
                          step.status === 'current' ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] ring-4 ring-blue-50' : 
                          'bg-white border-2 border-slate-200 text-slate-300'
                        }`}>
                          {step.status === 'completed' ? <FaCheckCircle size={16} /> : <FaCircle size={10} />}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <p className={`font-black text-lg tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                          <p className={`text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${step.status === 'pending' ? 'text-slate-200' : 'text-slate-400 bg-slate-50 border border-slate-100'}`}>{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 pb-4 border-b-2 border-slate-100 flex items-center gap-3">
                   <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                   Detalle del Envío
                </h4>
                <div className="space-y-10">
                   <div className="flex gap-5">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FaBox className="text-slate-400" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Producto Logístico</p>
                        <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">Apple iPhone 15 Pro Max 256GB - Titanium</p>
                      </div>
                   </div>
                   <div className="flex gap-5">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-blue-500" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Punto de Entrega</p>
                        <p className="text-base font-bold text-slate-900 leading-relaxed italic">{(session.user as any).address?.street} {(session.user as any).address?.number}<br /><span className="text-slate-400 not-italic">{(session.user as any).address?.city}, {(session.user as any).address?.state}</span></p>
                      </div>
                   </div>
                </div>
                <button className="w-full mt-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 leading-none">
                  Ver Mapa en Tiempo Real
                </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
              <FaTruck size={32} />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2">No tienes envíos activos</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">Cuando realices una compra, podrás ver el estado del envío en tiempo real desde aquí.</p>
        </div>
      )}
    </div>
  );
}
