import { FaExternalLinkAlt, FaEye } from 'react-icons/fa';
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function MisComprasPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);

  // Helper for status classes
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'CANCELLED': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Mis Compras</h1>
          <p className="text-gray-500 text-sm mt-1">Historial detallado de todas tus adquisiciones</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-600">
          {userOrders.length} {userOrders.length === 1 ? 'ORDEN' : 'ÓRDENES'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">N° Compra</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Fecha</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Estado</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Pago</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Detalle</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Correo</th>
              <th className="py-4 px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Seguimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {userOrders.length > 0 ? (
              userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((compra) => (
                <tr key={compra.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-5 px-2 text-center text-sm font-bold text-blue-600">
                    #{compra.id.substring(0, 8)}
                  </td>
                  <td className="py-5 px-2 text-center text-sm text-gray-600">
                    {new Date(compra.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="py-5 px-2 text-right text-sm font-bold text-gray-900">
                    ${compra.total.toLocaleString('es-AR')}
                  </td>
                  {/* ESTADO Column: Plain text "Procesado" if approved */}
                  <td className={`py-5 px-2 text-center text-xs font-bold ${compra.status === 'APPROVED' ? 'text-green-600' : 'text-gray-500'}`}>
                    {compra.status === 'APPROVED' ? 'Procesado' : 'Pendiente'}
                  </td>
                  {/* PAGO Column: Eye icon or similar */}
                  <td className="py-5 px-2 text-center">
                    <button className="text-gray-400 hover:text-blue-600 bg-transparent border-0 cursor-pointer flex items-center justify-center w-full">
                      <FaEye size={16} />
                    </button>
                  </td>
                  {/* DETALLE Column: Eye icon */}
                  <td className="py-5 px-2 text-center">
                    <button className="text-blue-600 hover:text-blue-800 bg-transparent border-0 cursor-pointer flex items-center justify-center w-full">
                      <FaEye size={16} />
                    </button>
                  </td>
                  {/* CORREO Column */}
                  <td className="py-5 px-2 text-center text-sm text-gray-500">
                    Nave
                  </td>
                  {/* SEGUIMIENTO Column: Status Pill */}
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(compra.status)}`}>
                        {compra.status === 'APPROVED' ? 'Envío pendiente' : 
                         compra.status === 'PENDING' ? 'Pago pendiente' : 
                         compra.status === 'SHIPPED' ? 'Enviado' : 
                         compra.status === 'CANCELLED' ? 'Cancelado' : 'Rechazado'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400 italic">
                  No se encontraron compras
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
