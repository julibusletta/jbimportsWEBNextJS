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
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Nro Guía:</span>
             <span className="text-[11px] font-bold text-slate-900 uppercase select-all">JB-{activeOrder.id.substring(0, 10).toUpperCase()}</span>
          </div>
        )}
      </div>

      {activeOrder ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Tracking Status Card */}
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <FaTruck size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">En Camino</h3>
                    <p className="text-slate-400 text-sm font-medium">Llegada estimada: <span className="text-slate-900 font-bold">18 de Marzo</span></p>
                  </div>
               </div>

               {/* Stepper Vertical */}
               <div className="relative pl-1">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                  
                  <div className="space-y-12">
                    {steps.map((step, idx) => (
                      <div key={idx} className="relative pl-10">
                        {/* Dot */}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                          step.status === 'completed' ? 'bg-green-500 text-white' : 
                          step.status === 'current' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 
                          'bg-white border-2 border-slate-100 text-slate-200'
                        }`}>
                          {step.status === 'completed' ? <FaCheckCircle size={14} /> : <FaCircle size={8} />}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className={`font-bold text-sm ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-slate-200' : 'text-slate-400'}`}>{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
             <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-3">Detalle del Envío</h4>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <FaBox className="text-slate-300 mt-1" size={16} />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Producto</p>
                        <p className="text-sm font-bold text-slate-900">Apple iPhone 15 Pro Max 256GB - Titanium</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <FaMapMarkerAlt className="text-slate-300 mt-1" size={16} />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Destino</p>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed">{(session.user as any).address?.street} {(session.user as any).address?.number}<br />{(session.user as any).address?.city}, {(session.user as any).address?.state}</p>
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
