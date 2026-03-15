export default function MiCuentaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
              <p className="text-gray-900 font-medium">Julián Busletta</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
              <p className="text-gray-900 font-medium">julian@ejemplo.com</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Teléfono</label>
              <p className="text-gray-900 font-medium">+54 9 11 1234-5678</p>
            </div>
          </div>
          <button className="text-blue-600 font-bold text-sm bg-transparent border-0 cursor-pointer hover:underline mt-4">
            Editar información
          </button>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Dirección de Envío</h2>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-900 font-medium">Av. Maipú 1234</p>
            <p className="text-gray-600 text-sm">Olivos, Vicente López</p>
            <p className="text-gray-600 text-sm">Buenos Aires, Argentina (B1636)</p>
          </div>
          <button className="text-blue-600 font-bold text-sm bg-transparent border-0 cursor-pointer hover:underline mt-2">
            Cambiar dirección
          </button>
        </section>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">Actividad Reciente</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
          <p className="text-blue-700 font-medium mb-1">No tienes compras recientes</p>
          <p className="text-blue-600 text-sm opacity-80">¡Explora nuestros productos y empieza a comprar!</p>
        </div>
      </div>
    </div>
  );
}
