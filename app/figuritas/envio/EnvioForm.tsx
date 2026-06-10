'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';

interface PackType {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  popular: boolean;
  badge?: string;
}

export default function EnvioForm({ pack }: { pack: PackType }) {
  const router = useRouter();
  const [shippingMethod, setShippingMethod] = useState<'via_cargo_domicilio' | 'via_cargo_sucursal' | null>(null);
  const [address, setAddress] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shippingMethod) {
      setError('Por favor seleccioná un método de envío.');
      return;
    }
    if (!address.trim()) {
      setError('Por favor completá los datos de la dirección o sucursal.');
      return;
    }
    if (!termsAccepted) {
      setError('Necesitás aceptar los términos y condiciones para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout/figuritas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packId: pack.id,
          title: pack.title,
          price: pack.price,
          shippingMethod,
          shippingAddress: {
            street: address,
            city: 'Ingresado por usuario',
            state: 'Ingresado por usuario',
            zip: '0000',
            shippingCost: 0,
          }
        }),
      });

      const data = await response.json();
      
      if (data.success && data.orderId) {
        router.push(`/checkout/transfer/${data.orderId}`);
      } else {
        setError('Hubo un error al procesar la solicitud. Por favor intenta de nuevo.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl text-gray-800 font-sans mx-auto flex flex-col items-center justify-center">
      <div className="mb-10 text-center w-full">
        <span className="inline-block bg-[#eaf2ff] text-[#001489] text-sm md:text-base font-bold px-4 py-1.5 rounded-full mb-4">Paso 1</span>
        <h2 className="text-3xl md:text-5xl font-black text-[#001489] mb-4 tracking-tight">Elegí cómo querés recibir tu pedido</h2>
        <p className="text-gray-500 text-base md:text-lg">Seleccioná una de las opciones disponibles:</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Opción Domicilio */}
          <label 
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all ${
              shippingMethod === 'via_cargo_domicilio' 
                ? 'border-[#001489] bg-white shadow-md' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {shippingMethod === 'via_cargo_domicilio' && (
              <span className="absolute top-3 right-3 bg-[#ffed00] text-black text-[10px] font-bold px-3 py-1 rounded-full">
                Seleccionado
              </span>
            )}
            <input 
              type="radio" 
              name="metodo_envio" 
              value="via_cargo_domicilio"
              className="sr-only"
              checked={shippingMethod === 'via_cargo_domicilio'}
              onChange={() => setShippingMethod('via_cargo_domicilio')}
            />
            <div className={`mb-4 p-4 rounded-xl ${shippingMethod === 'via_cargo_domicilio' ? 'bg-[#eaf2ff] text-[#001489]' : 'bg-gray-50 text-[#001489]'}`}>
              <svg viewBox="0 0 64 64" fill="currentColor" className="w-10 h-10"><path d="M6 18h34v27H6V18Zm4 4v19h26V22H10Z"></path><path d="M40 28h10l8 10v7H40V28Zm4 4v9h10v-2l-6-7h-4Z"></path><path d="M15 47a6 6 0 1 0 12 0H15Zm29 0a6 6 0 1 0 12 0H44Z"></path><path d="M30 34h10v5H30z"></path></svg>
            </div>
            <strong className="text-xl font-bold mb-2 text-gray-800">Vía Cargo a domicilio</strong>
            <small className="text-gray-500 text-center text-sm">Entrega en la dirección que indiques</small>
          </label>

          {/* Opción Sucursal */}
          <label 
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 cursor-pointer transition-all ${
              shippingMethod === 'via_cargo_sucursal' 
                ? 'border-[#001489] bg-white shadow-md' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {shippingMethod === 'via_cargo_sucursal' && (
              <span className="absolute top-3 right-3 bg-[#ffed00] text-black text-[10px] font-bold px-3 py-1 rounded-full">
                Seleccionado
              </span>
            )}
            <input 
              type="radio" 
              name="metodo_envio" 
              value="via_cargo_sucursal"
              className="sr-only"
              checked={shippingMethod === 'via_cargo_sucursal'}
              onChange={() => setShippingMethod('via_cargo_sucursal')}
            />
            <div className={`mb-4 p-4 rounded-xl ${shippingMethod === 'via_cargo_sucursal' ? 'bg-[#eaf2ff] text-[#001489]' : 'bg-gray-50 text-[#001489]'}`}>
              <svg viewBox="0 0 64 64" fill="currentColor" className="w-10 h-10"><path d="M14 14h36v40H14V14Zm4 4v32h28V18H18Z"></path><path d="M23 24h6v6h-6v-6Zm12 0h6v6h-6v-6ZM23 36h6v6h-6v-6Zm12 0h6v14h-6V36Z"></path><path d="M8 50h48v4H8z"></path></svg>
            </div>
            <strong className="text-xl font-bold mb-2 text-gray-800">Vía Cargo a sucursal</strong>
            <small className="text-gray-500 text-center text-sm">Retiro en la sucursal/localidad elegida</small>
          </label>

        </div>

        {/* Detalles de Envío dinámicos */}
        {shippingMethod === 'via_cargo_domicilio' && (
          <div className="bg-white p-6 md:p-10 rounded-xl border-2 border-[#c4dbf6] animate-fadeInUp shadow-sm text-center mt-8">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Información importante de la Entrega a domicilio</h3>
            <div className="text-base text-gray-600 space-y-5 mb-10 leading-relaxed">
              <p>Al elegir esta opción, <strong className="text-[#001489] font-bold">autorizás el envío de tu pedido a través de Vía Cargo</strong>. El costo del envío es a cargo del comprador.</p>
              <p>Nosotros realizamos la entrega de nuestros productos en la Provincia de Buenos Aires, en la sucursal de Vicente López. Desde ese punto, Vía Cargo se encarga del traslado hasta tu domicilio.</p>
              <p><strong className="text-[#001489] font-bold">Muy Importante:</strong> Durante el Mundial la gestión del pedido puede demorarse, una vez procesada toda la gestión y entregado en Vía Cargo la ⏱ Entrega estimada: 3 a 5 días hábiles (según destino definido por Vía Cargo) No es un compromiso de tiempo.</p>
              
              <ul className="list-none space-y-3 pt-4 text-left inline-block bg-gray-50 p-6 rounded-xl border border-gray-100">
                <li className="flex items-start gap-3"><span className="text-2xl leading-none">📌</span> <strong className="text-[#001489] font-bold text-lg">Muy Importante:</strong></li>
                <li className="pl-9">• Durante el Mundial pueden generarse Demoras lógicas por la Altísima Demanda.</li>
                <li className="pl-9">• Nosotros operamos y entregamos en y desde la Provincia de Buenos Aires.</li>
                <li className="pl-9">• El Envío a Sucursal es más rápido.</li>
                <li className="pl-9">• Nosotros Entregamos los productos con un estricto control, verificación y control de los productos, cualquier faltante o rotura de las fajas de seguridad no es nuestra responsabilidad.</li>
                <li className="pl-9">• Cualquier manipulación de las cajas o productos, o faltante deberán realizarse a la empresa del envío.</li>
                <li className="pl-9">• Vía Cargo solo realiza el envío, SOLO se puede retirar en la Sucursal de Destino.</li>
                <li className="pl-9">• No se pueden hacer consultas de compras en Vía Cargo.</li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center space-y-4 mt-12 pt-10 border-t-2 border-gray-100">
              <label htmlFor="direccion_domicilio" className="font-black text-[#001489] text-xl md:text-2xl text-center px-4">Escribí correctamente la dirección completa de entrega</label>
              <input 
                type="text" 
                id="direccion_domicilio" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número, piso/depto, localidad y provincia" 
                className="w-full max-w-2xl border-2 border-gray-300 rounded-xl p-5 text-lg md:text-xl text-center focus:ring-4 focus:ring-blue-100 focus:border-[#001489] outline-none transition-all bg-gray-50 shadow-inner"
              />
            </div>
          </div>
        )}

        {shippingMethod === 'via_cargo_sucursal' && (
          <div className="bg-white p-6 md:p-10 rounded-xl border-2 border-[#c4dbf6] animate-fadeInUp shadow-sm text-center mt-8">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Información importante de la Entrega a Sucursal</h3>
            <div className="text-base text-gray-600 space-y-5 mb-10 leading-relaxed">
              <p>Al elegir esta opción, <strong className="text-[#001489] font-bold">autorizás el envío de tu pedido a través de Vía Cargo</strong>. El costo del envío es a cargo del comprador.</p>
              <p>Nosotros realizamos la entrega de nuestros productos en la Provincia de Buenos Aires, en la sucursal de Vicente López. Desde ese punto, Vía Cargo se encarga del traslado hasta la sucursal de destino.</p>
              <p><strong className="text-[#001489] font-bold">Muy Importante:</strong> Durante el Mundial la gestión del pedido puede demorarse, una vez procesada toda la gestión y entregado en Vía Cargo la ⏱ Entrega estimada: 2 a 4 días hábiles (según destino definido por Vía Cargo) No es un compromiso de tiempo.</p>
              
              <ul className="list-none space-y-3 pt-4 text-left inline-block bg-gray-50 p-6 rounded-xl border border-gray-100">
                <li className="flex items-start gap-3"><span className="text-2xl leading-none">📌</span> <strong className="text-[#001489] font-bold text-lg">Muy Importante:</strong></li>
                <li className="pl-9">• Durante el Mundial pueden generarse Demoras lógicas por la Altísima Demanda.</li>
                <li className="pl-9">• Nosotros operamos y entregamos en y desde la Provincia de Buenos Aires.</li>
                <li className="pl-9">• El Envío a Sucursal es más rápido.</li>
                <li className="pl-9">• Nosotros Entregamos los productos con un estricto control, verificación y control de los productos, cualquier faltante o rotura de las fajas de seguridad no es nuestra responsabilidad.</li>
                <li className="pl-9">• Cualquier manipulación de las cajas o productos, o faltante deberán realizarse a la empresa del envío.</li>
                <li className="pl-9">• Vía Cargo solo realiza el envío, SOLO se puede retirar en la Sucursal de Destino.</li>
                <li className="pl-9">• No se pueden hacer consultas de compras en Vía Cargo.</li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center space-y-4 mt-12 pt-10 border-t-2 border-gray-100">
              <label htmlFor="sucursal_destino" className="font-black text-[#001489] text-xl md:text-2xl text-center px-4">Escribí la sucursal o localidad de destino</label>
              <input 
                type="text" 
                id="sucursal_destino" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Sucursal, localidad y provincia" 
                className="w-full max-w-2xl border-2 border-gray-300 rounded-xl p-5 text-lg md:text-xl text-center focus:ring-4 focus:ring-blue-100 focus:border-[#001489] outline-none transition-all bg-gray-50 shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Términos y Condiciones */}
        {shippingMethod && (
          <div className="bg-[#fffdf0] border-2 border-[#f9e285] p-6 rounded-xl animate-fadeInUp shadow-sm text-center flex flex-col items-center">
            <strong className="block text-center text-[#856404] mb-4 text-base md:text-lg">Al avanzar acepto los Términos y Condiciones de la Compra y autorizo el envio de mi pedido</strong>
            <label className="flex items-center justify-center gap-4 cursor-pointer group">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-6 h-6 rounded border-gray-300 text-[#001489] focus:ring-[#001489] cursor-pointer"
                />
              </div>
              <span className="text-[#856404] text-base md:text-lg group-hover:text-black transition-colors font-medium">Confirmo que leí y acepto los términos y condiciones de compras en mi pedido*</span>
            </label>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium animate-fadeInUp">
            {error}
          </div>
        )}

        {/* Botón de Submit */}
        {shippingMethod && (
          <div className="pt-6 flex justify-center animate-fadeInUp w-full">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full max-w-md bg-[#001489] text-white font-black text-xl py-5 rounded-xl hover:bg-[#0022cc] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><FaSpinner className="animate-spin" /> Procesando...</>
              ) : (
                'Aceptar y Continuar con Pago'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
