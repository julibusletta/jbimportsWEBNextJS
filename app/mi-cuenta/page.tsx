import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import OrderCard from '@/app/components/Profile/OrderCard';

export default async function MiCuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const latestOrder = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header - Clean & Minimal */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[2px] bg-blue-600"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Resumen General</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase m-0">Mi Perfil</h1>
        <p className="text-slate-500 text-[11px] mt-2 font-bold uppercase tracking-[0.1em] opacity-40">Gestión de datos personales, envíos y actividad reciente.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Personal Info */}
        <section className="space-y-6">
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <FaUser className="text-blue-600" size={14} /> Información Personal
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Nombre Completo', value: session.user.name || 'Sin nombre' },
              { label: 'Dni / Documento', value: (session.user as any).dni || 'No especificado' },
              { label: 'Correo Electrónico', value: session.user.email },
            ].map((field) => (
              <div key={field.label} className="bg-[#f8fafc] p-6 border border-[#f1f5f9] transition-all hover:bg-white hover:border-blue-100 group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 group-hover:text-blue-600 transition-colors">{field.label}</label>
                <p className="text-slate-900 font-bold text-sm m-0 tracking-tight uppercase">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="space-y-6">
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <FaMapMarkerAlt className="text-blue-600" size={14} /> Domicilio Registrado
          </h2>
          {(session.user as any).address ? (
            <div className="bg-white p-8 border border-[#f1f5f9] shadow-sm flex flex-col justify-between h-[320px] group">
              <div>
                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {(session.user as any).address.street} {(session.user as any).address.number}
                </p>
                <p className="text-slate-500 text-[11px] mt-2 font-black uppercase tracking-[0.15em]">
                  {(session.user as any).address.city}, {(session.user as any).address.state}
                </p>
                <div className="mt-8 inline-block bg-[#0f172a] text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em]">
                   C.P. {(session.user as any).address.zip}
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-[#f1f5f9]">
                <button className="bg-transparent border-0 p-0 text-blue-600 font-black text-[9px] uppercase tracking-[0.4em] hover:text-slate-900 cursor-pointer flex items-center gap-3 transition-colors">
                  <FaMapMarkerAlt size={10} /> Editar Datos de Envío
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-[#f8fafc] border border-dashed border-[#e2e8f0] flex flex-col items-center justify-center text-center h-[320px]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">Sin domicilio registrado</p>
              <button className="px-8 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-700 transition-all cursor-pointer border-0 shadow-lg shadow-blue-100">
                Añadir Dirección
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="mt-20 pt-16 border-t border-[#f1f5f9]">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em] m-0 flex items-center gap-3">
             <FaHistory className="text-blue-600" /> Actividad Reciente
           </h2>
           <Link href="/mi-cuenta/compras" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] no-underline hover:text-slate-900 transition-colors">
             Historial Completo →
           </Link>
        </div>
        {latestOrder ? (
          <div className="bg-white border border-[#f1f5f9] shadow-sm">
            <OrderCard order={JSON.parse(JSON.stringify(latestOrder))} />
          </div>
        ) : (
          <div className="bg-[#f8fafc] border border-[#f1f5f9] p-16 text-center">
            <div className="w-16 h-16 bg-white border border-[#f1f5f9] rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
              <FaShoppingBag size={24} />
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-8 opacity-40">Aún no has realizado pedidos</p>
            <Link href="/" className="inline-block px-10 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all no-underline border-0 cursor-pointer">
              Explorar Catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
