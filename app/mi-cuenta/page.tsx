import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FaUser, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
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
    <div className="animate-in fade-in duration-700">
      <div className="mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-4 border-slate-900 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 bg-blue-600 rounded-none shadow-[4px_4px_0px_rgba(37,99,235,0.2)]"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Panel de Control</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase m-0">Mi Cuenta</h1>
          <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.1em] opacity-60">Resumen de perfil, envíos y actividad reciente.</p>
        </div>
        <div className="hidden sm:block">
          <div className="px-5 py-2 bg-slate-50 text-slate-500 border border-slate-100 rounded-none text-[9px] font-black uppercase tracking-[0.3em] shadow-sm">
            Sincronizado: {new Date().toLocaleDateString('es-AR')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Personal Info */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-none border border-slate-200 text-slate-400">
              <FaUser size={18} />
            </div>
            <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">Información Legal</h2>
          </div>
          <div className="grid gap-4">
            {[
              { label: 'Titular de Cuenta', value: session.user.name || 'Sin nombre' },
              { label: 'Documento Nacional', value: (session.user as any).dni || 'No especificado' },
              { label: 'Correo Electrónico', value: session.user.email },
            ].map((field) => (
              <div key={field.label} className="bg-white p-6 rounded-none border-2 border-slate-100 transition-all hover:border-slate-900 group">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 group-hover:text-blue-600 transition-colors">{field.label}</label>
                <p className="text-slate-900 font-black text-base m-0 tracking-tight uppercase">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-none border border-slate-200 text-slate-400">
              <FaMapMarkerAlt size={18} />
            </div>
            <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">Logística de Entrega</h2>
          </div>
          {(session.user as any).address ? (
            <div className="bg-white text-slate-900 p-8 rounded-none border border-slate-200 shadow-sm h-[calc(100%-60px)] flex flex-col justify-between relative group">
              <div>
                <p className="text-2xl font-black leading-tight tracking-tighter uppercase">
                  {(session.user as any).address.street} {(session.user as any).address.number}
                </p>
                <p className="text-slate-500 text-xs mt-4 font-black uppercase tracking-[0.2em]">
                  {(session.user as any).address.city}, {(session.user as any).address.state}
                </p>
                <div className="mt-8 inline-block bg-blue-600 text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-md">
                   C.P. {(session.user as any).address.zip}
                </div>
              </div>
              <div className="mt-10 pt-6 border-t border-slate-100">
                <button className="bg-transparent border-0 p-0 text-slate-900 font-black text-[9px] uppercase tracking-[0.4em] hover:text-blue-600 cursor-pointer flex items-center gap-3 transition-colors">
                  <span className="w-5 h-[1px] bg-blue-600 group-hover:w-8 transition-all"></span> Actualizar Domicilio
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-none flex flex-col items-center justify-center text-center h-[calc(100%-60px)]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-60">Sin logística registrada</p>
              <button className="px-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-none hover:bg-slate-800 transition-all shadow-xl cursor-pointer border-0">
                Vincular Dirección
              </button>
            </div>
          )}
        </section>
      </div>

      <div className="mt-24 pt-20 border-t-2 border-slate-100">
        <div className="flex items-center justify-between mb-12">
           <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.5em] m-0">Movimientos Recientes</h2>
           <Link href="/mi-cuenta/compras" className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] no-underline hover:text-slate-900 transition-colors">
             Ver Historial Completo →
           </Link>
        </div>
        {latestOrder ? (
          <div className="border border-slate-200 shadow-sm">
            <OrderCard order={JSON.parse(JSON.stringify(latestOrder))} />
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-900 p-20 text-center rounded-none shadow-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-none flex items-center justify-center text-slate-300 mx-auto mb-8 border border-slate-200">
              <FaShoppingBag size={32} />
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-10 opacity-60">No se detectaron compras vinculadas</p>
            <Link href="/" className="inline-block px-12 py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.6em] rounded-none hover:bg-slate-800 transition-all shadow-2xl leading-none no-underline border-0 cursor-pointer">
              Iniciar Compras
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
