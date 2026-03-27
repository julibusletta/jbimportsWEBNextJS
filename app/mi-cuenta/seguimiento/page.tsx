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

  const orderDate = new Date(activeOrder?.createdAt || Date.now());
  const formatDate = (date: Date) => date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  const estimatedArrival = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);

  const steps = [
    { label: 'Pedido Realizado', date: formatDate(orderDate), status: 'completed' },
    { label: 'Procesando Pago', date: formatDate(orderDate), status: 'completed' },
    { label: 'En Preparación', date: formatDate(orderDate), status: 'current' },
    { label: 'Enviado', date: '-', status: 'pending' },
    { label: 'Entregado', date: '-', status: 'pending' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-slate-50 pb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Seguimiento</h1>
          <p className="text-slate-500 text-sm mt-3 font-bold uppercase tracking-widest opacity-60">Rastreo en tiempo real de tus envíos activos.</p>
        </div>
      </div>

      {activeOrder ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          {/* Tracking Status Card */}
          <div className="xl:col-span-2 space-y-10">
            <div className="bg-white border-2 border-slate-200 rounded-none p-10 relative overflow-hidden shadow-2xl shadow-slate-200/50">
               <div className="flex items-center gap-6 mb-16 border-b border-slate-50 pb-10">
                   <div className="w-16 h-16 bg-blue-600 text-white rounded-none flex items-center justify-center shadow-[0_15px_40px_rgba(37,99,235,0.3)] shrink-0">
                     <FaTruck size={28} />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight uppercase">En Camino</h3>
                     <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-3">Llegada estimada: <span className="text-blue-600 font-black ml-1">{formatDate(estimatedArrival)}</span></p>
                   </div>
               </div>

               {/* Stepper Logic with Flex for Stability */}
               <div className="relative pl-2">
                  {/* Vertical Line - Adjusted for new flex layout */}
                  <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-slate-100" />
                  
                  <div className="space-y-16">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-8 relative z-10 group">
                        {/* Dot Container */}
                        <div className="shrink-0 flex items-center justify-center pt-1.5">
                           <div className={`w-7 h-7 rounded-none flex items-center justify-center transition-all duration-500 group-hover:scale-125 ${
                             step.status === 'completed' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 
                             step.status === 'current' ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] ring-4 ring-blue-50' : 
                             'bg-white border-2 border-slate-200 text-slate-300'
                           }`}>
                             {step.status === 'completed' ? <FaCheckCircle size={16} /> : <FaCircle size={10} />}
                           </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                          <p className={`font-black text-lg tracking-tight ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                          <p className={`text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-none border-b-2 border-transparent transition-all ${
                            step.status === 'pending' ? 'text-slate-200' : 'text-slate-400 bg-slate-50 border-slate-200/50 italic opacity-80'
                          }`}>{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-8">
             <div className="bg-white border-2 border-slate-200 rounded-none p-10 shadow-xl shadow-slate-200/40">
                <div className="mb-10 p-6 bg-slate-900 rounded-none border-l-[12px] border-blue-600 shadow-xl -mx-4">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2 opacity-60">Nro Guía Oficial</p>
                   <p className="text-sm font-black text-white uppercase tracking-widest select-all">JB-{activeOrder.id.substring(0, 15).toUpperCase()}</p>
                </div>

                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 pb-4 border-b-2 border-slate-100 flex items-center gap-3">
                   <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                   Detalle del Envío
                </h4>
                <div className="space-y-10">
                   <div className="flex gap-5">
                      <div className="w-10 h-10 bg-slate-50 rounded-none flex items-center justify-center flex-shrink-0">
                        <FaBox className="text-slate-400" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Producto</p>
                        <p className="text-lg font-black text-slate-900 leading-tight tracking-tight">Apple iPhone 15 Pro Max 256GB - Titanium</p>
                      </div>
                   </div>
                   <div className="flex gap-5">
                      <div className="w-10 h-10 bg-slate-50 rounded-none flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-blue-500" size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Punto de Entrega</p>
                        <p className="text-base font-bold text-slate-900 leading-relaxed italic">{(session.user as any).address?.street} {(session.user as any).address?.number}<br /><span className="text-slate-400 not-italic">{(session.user as any).address?.city}, {(session.user as any).address?.state}</span></p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/50 border-2 border-slate-100 border-dashed rounded-none p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-none border-2 border-slate-100 flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
              <FaTruck size={32} />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-4 uppercase tracking-tighter">No tienes envíos activos</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 font-bold uppercase tracking-widest opacity-60">Cuando realices una compra, podrás ver el estado del envío en tiempo real desde aquí.</p>
        </div>
      )}
    </div>
  );
}
