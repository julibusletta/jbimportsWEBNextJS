import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';
import OrderCard from '@/app/components/Profile/OrderCard';

export default async function MisComprasPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Compras</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Historial detallado de todas tus órdenes.</p>
        </div>
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          {userOrders.length} {userOrders.length === 1 ? 'Pedido' : 'Pedidos'} en total
        </div>
      </div>

      <div className="space-y-4">
        {sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <OrderCard key={order.id} order={JSON.parse(JSON.stringify(order))} />
          ))
        ) : (
          <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
              <FaShoppingBag size={32} />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2">Aún no realizaste compras</h3>
            <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">Cuando realices un pedido, aparecerá en esta sección con todos los detalles.</p>
            <Link href="/" className="inline-block px-10 py-4 bg-slate-900 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 leading-none">
              Explorar Tienda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
