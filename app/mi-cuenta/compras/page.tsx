import { FaExternalLinkAlt, FaEye } from 'react-icons/fa';

export default function MisComprasPage() {
  const compras = [
    {
      id: '245678',
      fecha: '12/03/2026',
      total: '$423.189',
      estado: 'Entregado',
      estadoClass: 'bg-green-100 text-green-700',
      pago: 'Aprobado',
      pagoClass: 'text-green-600',
      correo: 'Andreani',
      seguimiento: 'AND123456789'
    },
    {
      id: '245512',
      fecha: '05/03/2026',
      total: '$166.969',
      estado: 'En camino',
      estadoClass: 'bg-blue-100 text-blue-700',
      pago: 'Aprobado',
      pagoClass: 'text-green-600',
      correo: 'Andreani',
      seguimiento: 'AND987654321'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Mis Compras</h1>
          <p className="text-gray-500 text-sm mt-1">Historial detallado de todas tus adquisiciones</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-600">
          {compras.length} ÓRDENES
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
            {compras.length > 0 ? (
              compras.map((compra) => (
                <tr key={compra.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-5 px-2 text-center text-sm font-bold text-blue-600">
                    #{compra.id}
                  </td>
                  <td className="py-5 px-2 text-center text-sm text-gray-600">
                    {compra.fecha}
                  </td>
                  <td className="py-5 px-2 text-right text-sm font-bold text-gray-900">
                    {compra.total}
                  </td>
                  <td className="py-5 px-2 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${compra.estadoClass}`}>
                      {compra.estado}
                    </span>
                  </td>
                  <td className={`py-5 px-2 text-center text-xs font-bold ${compra.pagoClass}`}>
                    {compra.pago}
                  </td>
                  <td className="py-5 px-2 text-center">
                    <button className="text-blue-600 hover:text-blue-800 bg-transparent border-0 cursor-pointer flex items-center justify-center w-full">
                      <FaEye size={16} />
                    </button>
                  </td>
                  <td className="py-5 px-2 text-center text-sm text-gray-500">
                    {compra.correo}
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {compra.seguimiento}
                      </span>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors bg-transparent border-0 cursor-pointer">
                        <FaExternalLinkAlt size={12} />
                      </button>
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
