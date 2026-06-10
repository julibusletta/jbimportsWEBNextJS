'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCheck, FaLock, FaSpinner, FaCopy, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function FiguritasTransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);

  const ALIAS_MP = 'jbimports.mp';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const resp = await fetch(`/api/checkout/verify/${id}`);
        const data = await resp.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    setFileName(file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', id as string);

    try {
      const resp = await fetch('/api/checkout/proof', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (data.success) {
        setUploadSuccess(true);
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFinalize = () => {
    if (!uploadSuccess || !termsAccepted) return;
    router.push('/mi-cuenta');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <FaSpinner className="animate-spin text-[#001489]" size={32} />
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Validando Operación...</p>
       </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
       <div className="bg-white border border-[#f1f5f9] p-12 text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 mx-auto mb-6" size={40} />
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-4">Orden No Encontrada</h2>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed uppercase tracking-wider">La orden solicitada no existe o no tienes permisos para verla.</p>
          <button onClick={() => router.push('/')} className="px-10 py-4 border border-slate-900 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all">Regresar a Tienda</button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto w-full">
        {/* Main Card Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-8 lg:p-12 mb-8">
          
          {/* Progress Flow Steps */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-10 hidden sm:flex">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                <FaCheck />
              </div>
              <div className="flex flex-col">
                <strong className="text-sm font-bold text-gray-900">Datos de envío</strong>
                <small className="text-xs text-gray-500">Completado</small>
              </div>
            </div>
            
            <div className="flex-1 h-[2px] bg-emerald-500 mx-4"></div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                <FaCheck />
              </div>
              <div className="flex flex-col">
                <strong className="text-sm font-bold text-gray-900">Transferencia</strong>
                <small className="text-xs text-gray-500">Disponible</small>
              </div>
            </div>

            <div className="flex-1 h-[2px] bg-gray-200 mx-4"></div>
            
            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#001489] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                3
              </div>
              <div className="flex flex-col">
                <strong className="text-sm font-bold text-gray-900">Comprobantes</strong>
                <small className="text-xs text-gray-500">Pendiente</small>
              </div>
            </div>

            <div className="flex-1 h-[2px] bg-gray-200 mx-4"></div>
            
            {/* Step 4 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm">
                4
              </div>
              <div className="flex flex-col">
                <strong className="text-sm font-bold text-gray-500">Finalizar pedido</strong>
                <small className="text-xs text-gray-400">Pendiente</small>
              </div>
            </div>
          </div>

          {/* Section 1: Transfer Header */}
          <div className="mb-10 text-left">
            <span className="inline-block bg-[#eaf2ff] text-[#001489] text-xs font-black px-3 py-1 rounded mb-3 tracking-widest uppercase">Paso 2 · Transferencia</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Realizá la transferencia bancaria</h2>
            <p className="text-gray-600 mb-2">Transferí únicamente a la cuenta indicada según tu pedido.</p>
            <p className="text-gray-600">Tu envío seleccionado: <strong className="text-gray-900">{order.shippingAddress?.shippingMethod === 'via_cargo_domicilio' ? 'Vía Cargo a domicilio' : 'Vía Cargo a sucursal'}</strong></p>
          </div>

          {/* Transfer Method Box */}
          <div className="border border-[#001489] rounded-xl p-6 mb-10 bg-[#f8fbff]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 rounded-full bg-[#001489] text-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <strong className="text-lg font-bold text-gray-900">Transferencia bancaria</strong>
            </div>
            <div className="pl-8 text-gray-700 text-sm md:text-base leading-relaxed">
              <p>La cuenta que realiza el pago debe ser la misma a la que se factura.</p>
              <p>Para las Figuritas del Mundial se transfiere <strong className="text-gray-900 font-bold">únicamente a la cuenta de Mercado Pago JB Imports</strong>.</p>
            </div>
          </div>

          {/* Bank Accounts Grid */}
          <div className="bg-[#fcfdfd] border border-gray-200 rounded-2xl p-6 md:p-8 mb-12">
            <div className="mb-6">
              <span className="inline-block bg-[#ffed00] text-black text-[10px] font-black px-3 py-1 rounded mb-3 tracking-widest uppercase">Cuentas para realizar el pago</span>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Revisá bien la cuenta antes de transferir</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Card MP */}
              <div className="border-2 border-red-500 rounded-xl bg-white relative overflow-hidden flex flex-col">
                <div className="p-5 flex items-start gap-4 border-b border-gray-100">
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="Mercado Pago" className="w-12 h-12 object-contain" />
                  <div className="flex-1">
                    <strong className="block text-lg font-black text-gray-900">JB Imports / MP</strong>
                    <span className="text-sm text-gray-500">Solo figuritas del Mundial</span>
                  </div>
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full absolute top-5 right-5 uppercase tracking-wider">ACTIVA</span>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total a pagar</span>
                  <div className="text-3xl font-black text-gray-900 mb-6">
                    ${order.total?.toLocaleString('es-AR')}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-200 mb-3">
                      <div>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Alias / cuenta</span>
                        <strong className="text-base font-black text-gray-900">{ALIAS_MP}</strong>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(ALIAS_MP, 'alias')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          copiedField === 'alias' 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'bg-white text-red-500 border-red-500 hover:bg-red-50'
                        }`}
                      >
                        {copiedField === 'alias' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <span className="text-red-500 text-xs font-bold">Requiere comprobante de pago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total general black bar */}
            <div className="bg-[#111] text-white rounded-xl p-5 flex items-center justify-between">
              <span className="font-bold text-sm md:text-base">Total general del pedido</span>
              <strong className="text-2xl font-black">${order.total?.toLocaleString('es-AR')}</strong>
            </div>

            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <strong className="text-gray-900 font-bold">Transferí únicamente a la cuenta indicada.</strong> No se aceptan pagos en otras cuentas bancarias.
            </div>
          </div>

          {/* Section 2: Upload Proof */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-block bg-[#e6f4ea] text-[#137333] text-xs font-black px-3 py-1 rounded mb-3 tracking-widest uppercase">Paso 3 · Comprobantes</span>
                <h3 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">Cargá tu comprobante de pago <span className="text-xl">🔒</span></h3>
                <p className="text-gray-600">Necesitamos verificar tu pago para continuar con el pedido.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center min-w-[150px]">
                <div className="text-xl font-black text-[#137333]">
                  {uploadSuccess ? '1' : '0'} <span className="text-gray-500 text-sm font-bold">de 1</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">comprobante cargado</span>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 bg-white shadow-sm mb-6">
              <div className="flex items-center gap-4 min-w-[300px]">
                <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="MP" className="w-12 h-12 rounded bg-white shadow-sm object-contain p-1" />
                <div>
                  <strong className="block text-gray-900 font-bold">Comprobante Mercado Pago</strong>
                  <span className="block text-xs text-gray-500 mb-1">Monto a transferir: ${order.total?.toLocaleString('es-AR')}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${uploadSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
                    {uploadSuccess ? 'Cargado' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full relative">
                {uploadSuccess ? (
                  <div className="w-full h-full min-h-[80px] bg-emerald-50 border-2 border-emerald-500 border-dashed rounded-xl flex items-center justify-center text-emerald-600 gap-2">
                    <FaCheckCircle size={20} />
                    <span className="font-bold">Comprobante subido exitosamente</span>
                  </div>
                ) : (
                  <label className={`w-full h-full min-h-[80px] flex flex-col items-center justify-center p-4 border-2 border-dashed ${uploading ? 'bg-gray-50 border-gray-300 text-gray-400' : 'bg-[#f4fbf6] border-[#34a853] text-[#137333] hover:bg-[#eaf6ec] cursor-pointer'} rounded-xl transition-colors`}>
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.webp" onChange={handleFileUpload} disabled={uploading} />
                    {uploading ? (
                      <div className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Procesando...</div>
                    ) : (
                      <>
                        <span className="text-xl mb-1 font-black">↑</span>
                        <strong className="text-sm font-bold">Subir comprobante</strong>
                        <small className="text-[10px] opacity-80 mt-1">JPG, PNG, PDF o WEBP. Máx. 8MB.</small>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="text-sm text-[#137333] bg-[#e6f4ea] p-4 rounded-lg border border-[#ceead6] font-medium">
              Una vez subido el comprobante requerido podrás finalizar tu pedido.
            </div>
          </div>

          {/* Checkbox Terminos */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 flex items-center gap-4">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-6 h-6 rounded bg-black text-black border-transparent focus:ring-black cursor-pointer appearance-none checked:bg-black checked:border-black flex items-center justify-center relative before:content-['✓'] before:absolute before:text-white before:font-bold before:opacity-0 checked:before:opacity-100"
              />
            </div>
            <span className="text-sm font-bold text-gray-900">Confirmo nuevamente los términos y condiciones de la compra.</span>
          </div>

          {/* Progress Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="text-base font-black text-gray-900 mb-6">Resumen de progreso</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                  <FaCheck />
                </div>
                <div>
                  <strong className="block text-xs text-gray-900">Transferencia</strong>
                  <span className="text-[10px] text-gray-500 uppercase">Disponible</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${uploadSuccess ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {uploadSuccess ? <FaCheck /> : '2'}
                </div>
                <div>
                  <strong className="block text-xs text-gray-900">Comprobante MP</strong>
                  <span className={`text-[10px] uppercase ${uploadSuccess ? 'text-emerald-500 font-bold' : 'text-gray-500'}`}>{uploadSuccess ? 'Completado' : 'Pendiente'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${uploadSuccess && termsAccepted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <div>
                  <strong className="block text-xs text-gray-900">Finalizar pedido</strong>
                  <span className="text-[10px] text-gray-500 uppercase">Pendiente</span>
                </div>
              </div>

            </div>
          </div>

          {/* Finalize Row */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch h-full">
            {!uploadSuccess ? (
              <div className="bg-[#fff9e6] border border-[#ffe082] rounded-xl p-4 flex-1 flex flex-col justify-center">
                <strong className="text-amber-900 text-sm block">Falta cargar 1 comprobante</strong>
                <span className="text-amber-800 text-xs">Para continuar, subí el comprobante pendiente.</span>
              </div>
            ) : !termsAccepted ? (
               <div className="bg-[#fff9e6] border border-[#ffe082] rounded-xl p-4 flex-1 flex flex-col justify-center">
                <strong className="text-amber-900 text-sm block">Términos no aceptados</strong>
                <span className="text-amber-800 text-xs">Aceptá los términos para finalizar.</span>
              </div>
            ) : (
              <div className="bg-[#e6f4ea] border border-[#34a853] rounded-xl p-4 flex-1 flex flex-col justify-center text-[#137333]">
                <strong className="text-sm block">¡Todo listo!</strong>
                <span className="text-xs">Podés finalizar tu pedido.</span>
              </div>
            )}

            <button 
              onClick={handleFinalize}
              disabled={!uploadSuccess || !termsAccepted}
              className={`md:w-1/3 flex items-center justify-center gap-3 rounded-xl py-4 font-black uppercase text-sm tracking-wider transition-all ${
                uploadSuccess && termsAccepted 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md' 
                  : 'bg-[#d1d5db] text-gray-500 cursor-not-allowed'
              }`}
            >
              {!uploadSuccess || !termsAccepted ? <FaLock /> : <FaCheck />}
              Finalizar Pedido
            </button>
          </div>

          <div className="mt-8 text-center md:text-left">
            <a href="/figuritas" className="text-[#001489] font-bold text-sm hover:underline">← Volver al envío</a>
          </div>

        </div>
      </div>
    </div>
  );
}
