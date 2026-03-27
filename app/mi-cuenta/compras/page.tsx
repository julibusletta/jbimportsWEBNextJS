import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OrdersManager from "@/app/components/Profile/OrdersManager";
import StatusChecker from '@/app/components/Checkout/StatusChecker';
import { Suspense } from 'react';

export default async function MisComprasPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-in fade-in duration-700">
      <Suspense fallback={null}>
        <StatusChecker />
      </Suspense>
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase m-0">Mis Compras</h1>
          <p className="text-slate-500 text-sm mt-3 font-bold uppercase tracking-widest opacity-60">Historial detallado de todas tus órdenes.</p>
        </div>
        <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
          {userOrders.length} {userOrders.length === 1 ? 'Pedido' : 'Pedidos'} en total
        </div>
      </div>

      <OrdersManager orders={JSON.parse(JSON.stringify(sortedOrders))} />
    </div>
  );
}
