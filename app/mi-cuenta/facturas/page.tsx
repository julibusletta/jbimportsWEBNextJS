import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { FaFileInvoice, FaDownload } from 'react-icons/fa';

export default async function FacturasPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Placeholder for invoices - typically fetched from a separate collection or computed from orders
  const invoices = [
    { id: 'INV-2024-001', date: '2024-03-15', amount: 1250000, orderId: 'OR-8B3F2A' },
    { id: 'INV-2024-002', date: '2024-03-10', amount: 850000, orderId: 'OR-9C1D4E' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Facturas</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Descargá los comprobantes fiscales de tus compras.</p>
        </div>
        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          Facturación Electrónica
        </div>
      </div>

      <div className="grid gap-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-all hover:border-slate-300 group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                  <FaFileInvoice size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{invoice.id}</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-wider">
                    {new Date(invoice.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })} • Pedido #{invoice.orderId}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                <p className="text-lg font-bold text-slate-900 tracking-tight">${invoice.amount.toLocaleString()}</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                  <FaDownload />
                  PDF
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50/50 border border-slate-100 border-dashed rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-sm">
              <FaFileInvoice size={32} />
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-2">No hay facturas disponibles</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Las facturas se generan automáticamente una vez procesado el pago de tus pedidos.</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-bold text-lg mb-1">¿Necesitás Factura A?</p>
          <p className="text-slate-400 text-sm font-medium">Cargá tu CUIT en la sección de datos fiscales para automatizar el proceso.</p>
        </div>
        <button className="px-6 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">
          CARGAR CUIT
        </button>
      </div>
    </div>
  );
}
