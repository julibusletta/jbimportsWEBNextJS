'use client';

import { useState, useEffect, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaChevronLeft, 
  FaCheckCircle, 
  FaLock,
  FaCreditCard,
  FaSpinner,
  FaShieldAlt,
  FaStore
} from 'react-icons/fa';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  type: 'DOMICILIO' | 'SUCURSAL';
}

function CheckoutContent() {
  const { cartItems, total: cartTotal } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingOption[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingOption | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [loadingBranches, setLoadingBranches] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    street: '',
    number: '',
    floor: '',
    city: '',
    state: 'Buenos Aires',
    zipCode: '',
    phone: ''
  });

  const [error, setError] = useState<string | null>(null);

  // Auto-calculate rates when zipCode is 4 digits
  useEffect(() => {
    if (formData.zipCode.length === 4) {
      calculateShipping();
    }
  }, [formData.zipCode]);

  // Fetch branches if SUCURSAL is selected
  useEffect(() => {
    if (selectedRate?.type === 'SUCURSAL') {
      fetchBranches();
    } else {
      setSelectedBranch(null);
    }
  }, [selectedRate]);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    try {
      const resp = await fetch(`/api/shipping/branches?zipCode=${formData.zipCode}`);
      const data = await resp.json();
      if (data.success) {
        setBranches(data.branches);
      }
    } catch (err) {
      console.error('Failed to fetch branches');
    } finally {
      setLoadingBranches(false);
    }
  };

  const calculateShipping = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode: formData.zipCode,
          items: cartItems.map(item => ({
            weight: item.weight || 0.5,
            quantity: item.quantity
          }))
        })
      });
      const data = await response.json();
      if (data.success) {
        setShippingRates(data.rates);
        // Auto-select first option if none selected
        if (data.rates.length > 0 && !selectedRate) {
          setSelectedRate(data.rates[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch shipping rates');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedRate) {
      setError('Por favor selecciona un método de envío');
      return;
    }

    if (!formData.email || !formData.street || !formData.firstName) {
      setError('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    const finalTotal = cartTotal + selectedRate.price;

    try {
      const response = await fetch('/api/checkout/nave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total: finalTotal,
          orderId: `JB-${Date.now()}`,
          shipping: {
            method: selectedRate.name,
            cost: selectedRate.price,
            address: {
              street: selectedBranch ? selectedBranch.direccion : formData.street,
              number: selectedBranch ? '' : formData.number,
              city: selectedBranch ? selectedBranch.localidad : formData.city,
              state: selectedBranch ? selectedBranch.provincia : formData.state,
              zipCode: formData.zipCode,
              branchDetail: selectedBranch ? `${selectedBranch.nombre} - ${selectedBranch.direccion}` : null
            }
          }
        }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Error al procesar el pago');
      }
    } catch (err) {
      setError('Error de conexión con el servidor de pagos');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <FaTruck className="text-gray-200 text-6xl mb-4" />
        <h2 className="text-xl font-bold mb-4">Tu carrito está vacío</h2>
        <button onClick={() => router.push('/')} className="bg-[#0066cc] text-white px-6 py-2 rounded-md">
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-40 pb-8 w-full flex flex-col items-center">
      <div className="w-full max-w-[1240px] px-4 md:px-10">
        <div className="flex items-center gap-2 mb-8 text-[#0066cc] cursor-pointer hover:underline" onClick={() => router.back()}>
          <FaChevronLeft size={12} /> <span className="text-sm font-bold uppercase tracking-wider">Volver al carrito</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Contact Info */}
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-[14px]">1</span>
                Datos de Contacto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="ejemplo@correo.com"
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Teléfono / WhatsApp</label>
                  <input 
                   type="text" 
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   placeholder="11 1234 5678"
                   className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc] transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-[14px]">2</span>
                Entrega
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Nombre</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Apellido</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1 flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Código Postal</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value.replace(/\D/g, '')})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc] font-bold"
                  />
                </div>
                <div className="md:col-span-1 flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Provincia</label>
                  <select 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  >
                    <option value="CABA">Capital Federal</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Santa Fe">Santa Fe</option>
                  </select>
                </div>
                <div className="md:col-span-1 flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Ciudad</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Calle</label>
                  <input 
                    type="text" 
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  />
                </div>
                <div className="md:col-span-1 flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Número</label>
                  <input 
                    type="text" 
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  />
                </div>
                <div className="md:col-span-1 flex flex-col gap-1">
                  <label className="text-[12px] text-gray-500 font-bold uppercase">Piso/Depto (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    className="border border-gray-200 p-3 rounded-md outline-none focus:border-[#0066cc]"
                  />
                </div>
              </div>
            </section>

            {/* 3. Shipping Options */}
            <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-[14px] font-bold text-gray-700 mb-4 flex items-center gap-2">
                <FaTruck className="text-[#0066cc]" /> Opciones de Envío (Andreani)
              </h3>
              
              {loading ? (
                <div className="flex items-center gap-3 text-gray-400 text-sm italic py-4">
                  <FaSpinner className="animate-spin" /> Consultando tarifas...
                </div>
              ) : shippingRates.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {shippingRates.map((rate) => (
                    <div 
                      key={rate.id}
                      onClick={() => setSelectedRate(rate)}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${selectedRate?.id === rate.id ? 'border-[#0066cc] bg-blue-50/30 ring-1 ring-[#0066cc]' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedRate?.id === rate.id ? 'border-[#0066cc] bg-[#0066cc]' : 'border-gray-300'}`}>
                          {selectedRate?.id === rate.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-[15px]">{rate.name}</span>
                          <span className="text-[12px] text-gray-500">Llega en {rate.estimatedDays} días hábiles aprox.</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#0066cc]">
                        {rate.price === 0 ? 'SIN CARGO' : `$${rate.price.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : formData.zipCode.length === 4 ? (
                <p className="text-gray-400 text-sm italic">No se encontraron métodos de envío para este CP.</p>
              ) : (
                <p className="text-gray-400 text-sm italic">Ingresa tu código postal para ver opciones.</p>
              )}

              {/* Branch Selection UI */}
              {selectedRate?.type === 'SUCURSAL' && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-[14px] font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <FaStore className="text-[#0066cc]" /> Selecciona una Sucursal Andreani
                  </h4>

                  {loadingBranches ? (
                     <div className="flex items-center gap-2 text-gray-400 text-sm italic">
                       <FaSpinner className="animate-spin" /> Buscando sucursales...
                     </div>
                  ) : branches.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {branches.map((branch) => (
                        <div 
                          key={branch.id || branch.numero}
                          onClick={() => setSelectedBranch(branch)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedBranch?.numero === branch.numero ? 'border-[#0066cc] bg-blue-50/20 ring-1 ring-[#0066cc]' : 'border-gray-100 hover:border-blue-200'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-[14px]">{branch.nombre}</span>
                              <span className="text-[12px] text-gray-500 mt-1">{branch.direccion}, {branch.localidad}</span>
                              <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{branch.provincia}</span>
                            </div>
                            {selectedBranch?.numero === branch.numero && <FaCheckCircle className="text-[#0066cc]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-600 text-[13px] bg-amber-50 p-3 rounded-md">No se encontraron sucursales para este código postal.</p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-[140px] flex flex-col gap-6">
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                <h2 className="text-lg font-bold mb-6 pb-2 border-b">Resumen de Compra</h2>
                
                <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-md p-1 border flex items-center justify-center flex-shrink-0">
                        <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[12px] text-gray-500">x{item.quantity}</span>
                          <span className="text-[13px] font-bold text-gray-800">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-4 border-t border-b border-gray-50 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="font-bold text-[#0066cc]">
                      {selectedRate 
                        ? (selectedRate.price === 0 ? 'SIN CARGO' : `$${selectedRate.price.toLocaleString()}`) 
                        : <span className="text-gray-300 italic text-sm font-normal">A calcular</span>
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-[18px] font-bold text-gray-900 pt-2">
                    <span>Total Final</span>
                    <span>${(cartTotal + (selectedRate?.price || 0)).toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-[13px] rounded-md mb-4 flex items-center gap-2">
                    <span className="font-bold">Error:</span> {error}
                  </div>
                )}

                <button 
                  onClick={handlePayment}
                  disabled={loading || !selectedRate}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all ${loading || !selectedRate ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#000] text-[#fff] hover:bg-gray-900 hover:scale-[1.02]'}`}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <><FaLock /> <span>PAGAR CON NAVE</span></>}
                </button>
                
                <div className="mt-4 flex flex-col items-center gap-2">
                  <img src="/images/nave.jpg" alt="Nave" className="h-[20px] grayscale opacity-50" />
                  <p className="text-[11px] text-gray-400">Pago procesado por Galicia Negocios</p>
                </div>
              </div>

              {/* Security features badge */}
              <div className="flex justify-center gap-8 py-2">
                <div className="flex flex-col items-center gap-1">
                  <FaShieldAlt className="text-green-500 text-2xl" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Pago Seguro</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FaTruck className="text-blue-500 text-2xl" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Envío Andreani</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FaCreditCard className="text-purple-500 text-2xl" />
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Cuotas Sin Interés</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando Pago...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
