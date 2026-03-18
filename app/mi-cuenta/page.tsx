import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FaUser, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';

export default async function MiCuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const latestOrder = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Panel de Control</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Mi Perfil</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Gestioná tu cuenta, direcciones y seguí tus compras.</p>
        </div>
        <div className="hidden sm:block">
          <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-100">
            Último ingreso: {new Date().toLocaleDateString('es-AR')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FaUser className="text-slate-300" />
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Información Personal</h2>
          </div>
          <div className="grid gap-3">
            {[
              { label: 'Nombre Completo', value: session.user.name || 'Sin nombre' },
              { label: 'DNI / Identificación', value: (session.user as any).dni || 'No especificado' },
              { label: 'Email Principal', value: session.user.email },
            ].map((field) => (
              <div key={field.label} className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 transition-colors hover:bg-slate-50">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{field.label}</label>
                <p className="text-slate-900 font-semibold text-sm">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-slate-300" />
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Dirección de Envío</h2>
          </div>
          {(session.user as any).address ? (
            <div className="bg-white p-7 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[calc(100%-40px)] flex flex-col justify-between">
              <div>
                <p className="text-xl font-bold text-slate-900 leading-tight">
                  {(session.user as any).address.street} {(session.user as any).address.number}
                </p>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  {(session.user as any).address.city}, {(session.user as any).address.state}
                </p>
                <p className="text-slate-400 text-[11px] mt-1 font-bold tracking-wider">CP {(session.user as any).address.zip}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50">
                <button className="text-blue-600 text-xs font-bold hover:underline bg-transparent border-0 p-0 cursor-pointer flex items-center gap-2">
                  Actualizar dirección
                </button>
              </div>
            </div>
          ) : (
            <div className="p-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-[calc(100%-40px)]">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Sin dirección registrada</p>
              <button className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline">Agregar ahora</button>
            </div>
          )}
        </section>
      </div>

      <div className="mt-16 pt-12 border-t border-slate-100">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 px-1">Actividad Reciente</h2>
        {latestOrder ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                <FaShoppingBag size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Pedido #{latestOrder.id.substring(0, 8).toUpperCase()}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-wider">{new Date(latestOrder.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900 tracking-tight">${latestOrder.total.toLocaleString()}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mt-1 ${
                latestOrder.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
              }`}>
                {latestOrder.status === 'APPROVED' ? 'Aprobado' : 'Pendiente'}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
              <FaShoppingBag size={28} />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">No tienes compras recientes</p>
            <Link href="/" className="inline-block px-10 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/10 active:scale-95 leading-none">
              Ir a la tienda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
