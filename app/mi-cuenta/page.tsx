import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function MiCuentaPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const latestOrder = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
              <p className="text-gray-900 font-medium">{session.user.name || 'Julián Busletta'}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <p className="text-gray-900 font-medium">{session.user.email}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Dirección de Envío</h2>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-900 font-medium">Información pendiente</p>
            <p className="text-gray-600 text-sm italic">Completa tus datos en la siguiente compra</p>
          </div>
        </section>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">Actividad Reciente</h2>
        {latestOrder ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-900 font-bold">Pedido #${latestOrder.id.substring(0, 8)}</p>
              <p className="text-gray-500 text-sm">{new Date(latestOrder.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-bold">${latestOrder.total.toLocaleString()}</p>
              <span className={`text-[10px] font-bold uppercase ${latestOrder.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                {latestOrder.status === 'APPROVED' ? 'Aprobado' : 'Pendiente'}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
            <p className="text-blue-700 font-medium mb-1">No tienes compras recientes</p>
            <p className="text-blue-600 text-sm opacity-80">¡Explora nuestros productos y empieza a comprar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
