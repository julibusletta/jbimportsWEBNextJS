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
          <div className="mb-16 text-center flex flex-col items-center">
            <span className="inline-block bg-[#eaf2ff] text-[#001489] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">Paso 2 · Transferencia</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5 tracking-tight">Realizá la transferencia bancaria</h2>
            <p className="text-gray-600 text-lg mb-2">Transferí únicamente a la cuenta indicada según tu pedido.</p>
            <p className="text-gray-600 text-lg">Tu envío seleccionado: <strong className="text-gray-900 font-bold">{order.shippingAddress?.shippingMethod === 'via_cargo_domicilio' ? 'Vía Cargo a domicilio' : 'Vía Cargo a sucursal'}</strong></p>
          </div>

          {/* Transfer Method Box */}
          <div className="border-2 border-[#001489] rounded-xl p-8 md:p-10 mb-16 bg-[#f8fbff] flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-6 h-6 rounded-full bg-[#001489] text-white flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <strong className="text-xl font-bold text-gray-900">Transferencia bancaria</strong>
            </div>
            <div className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl">
              <p className="mb-2">La cuenta que realiza el pago debe ser la misma a la que se factura.</p>
              <p>Para las Figuritas del Mundial se transfiere <strong className="text-gray-900 font-black text-lg">únicamente a la cuenta de Mercado Pago JB Imports</strong>.</p>
            </div>
          </div>

          {/* Bank Accounts Grid */}
          <div className="bg-[#fcfdfd] border-2 border-gray-200 rounded-2xl p-8 md:p-12 mb-20">
            <div className="mb-10 text-center flex flex-col items-center">
              <span className="inline-block bg-[#ffed00] text-black text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">Cuentas para realizar el pago</span>
              <h3 className="text-3xl font-black text-gray-900 mb-2">Revisá bien la cuenta antes de transferir</h3>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-10 max-w-lg mx-auto">
              {/* Card MP */}
              <div className="border-2 border-red-500 rounded-2xl bg-white relative overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6 md:p-8 flex items-center gap-4 border-b border-gray-100 text-left">
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="Mercado Pago" className="w-14 h-14 object-contain" />
                  <div className="flex-1">
                    <strong className="block text-xl font-black text-gray-900">JB Imports / MP</strong>
                    <span className="text-base text-gray-500">Solo figuritas del Mundial</span>
                  </div>
                  <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full absolute top-6 right-6 uppercase tracking-wider">ACTIVA</span>
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col text-center">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total a pagar</span>
                  <div className="text-5xl font-black text-gray-900 mb-10 text-center">
                    ${order.total?.toLocaleString('es-AR')}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="bg-gray-50 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between border-2 border-gray-100 mb-4 gap-4 text-center md:text-left">
                      <div className="flex flex-col items-center md:items-start">
                        <span className="block text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Alias / cuenta</span>
                        <strong className="text-xl font-black text-gray-900">{ALIAS_MP}</strong>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(ALIAS_MP, 'alias')}
                        className={`w-full md:w-auto px-6 py-3 rounded-full text-sm font-bold transition-all border-2 ${
                          copiedField === 'alias' 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' 
                            : 'bg-white text-red-500 border-red-500 hover:bg-red-50 hover:shadow-md'
                        }`}
                      >
                        {copiedField === 'alias' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <span className="text-red-500 text-sm font-bold block mt-2 text-center">Requiere comprobante de pago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total general black bar */}
            <div className="bg-[#111] text-white rounded-xl p-6 md:p-8 flex items-center justify-between mx-auto max-w-2xl">
              <span className="font-bold text-lg">Total general del pedido</span>
              <strong className="text-3xl font-black">${order.total?.toLocaleString('es-AR')}</strong>
            </div>

            <div className="mt-8 text-base text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100 text-center mx-auto max-w-2xl">
              <strong className="text-gray-900 font-bold">Transferí únicamente a la cuenta indicada.</strong> No se aceptan pagos en otras cuentas bancarias.
            </div>
          </div>

          {/* Section 2: Upload Proof */}
          <div className="mb-20">
            <div className="flex flex-col items-center text-center mb-10 gap-4">
              <div className="flex flex-col items-center">
                <span className="inline-block bg-[#e6f4ea] text-[#137333] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">Paso 3 · Comprobantes</span>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">Cargá tu comprobante de pago <span className="text-2xl">🔒</span></h3>
                <p className="text-gray-600 text-lg">Necesitamos verificar tu pago para continuar con el pedido.</p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-center mt-4 min-w-[200px]">
                <div className="text-3xl font-black text-[#137333] mb-1">
                  {uploadSuccess ? '1' : '0'} <span className="text-gray-500 text-lg font-bold">de 1</span>
                </div>
                <span className="text-xs uppercase font-black tracking-widest text-gray-500">comprobante cargado</span>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 bg-white shadow-md mb-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 min-w-[300px]">
                <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="MP" className="w-16 h-16 rounded-xl bg-white shadow-md object-contain p-2" />
                <div className="flex flex-col items-center md:items-start">
                  <strong className="block text-xl text-gray-900 font-black mb-1">Comprobante Mercado Pago</strong>
                  <span className="block text-base text-gray-500 mb-2">Monto a transferir: <strong className="text-gray-900">${order.total?.toLocaleString('es-AR')}</strong></span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${uploadSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {uploadSuccess ? 'Cargado' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full relative min-h-[120px]">
                {uploadSuccess ? (
                  <div className="w-full h-full min-h-[120px] bg-emerald-50 border-4 border-emerald-500 border-dashed rounded-2xl flex flex-col items-center justify-center text-emerald-600 gap-3 p-6 text-center">
                    <FaCheckCircle size={32} />
                    <span className="font-black text-lg">Comprobante subido exitosamente</span>
                  </div>
                ) : (
                  <label className={`w-full h-full min-h-[120px] flex flex-col items-center justify-center p-6 border-4 border-dashed ${uploading ? 'bg-gray-50 border-gray-300 text-gray-400' : 'bg-[#f4fbf6] border-[#34a853] text-[#137333] hover:bg-[#eaf6ec] cursor-pointer'} rounded-2xl transition-all shadow-inner`}>
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.webp" onChange={handleFileUpload} disabled={uploading} />
                    {uploading ? (
                      <div className="flex items-center gap-3 text-lg font-bold"><FaSpinner className="animate-spin" /> Procesando archivo...</div>
                    ) : (
                      <>
                        <span className="text-3xl mb-2 font-black">↑</span>
                        <strong className="text-lg font-black uppercase tracking-wider">Subir comprobante</strong>
                        <small className="text-xs opacity-80 mt-2 font-bold">JPG, PNG, PDF o WEBP. Máx. 8MB.</small>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="text-base text-[#137333] bg-[#e6f4ea] p-5 rounded-xl border-2 border-[#ceead6] font-bold text-center max-w-3xl mx-auto shadow-sm">
              Una vez subido el comprobante requerido podrás finalizar tu pedido.
            </div>
          </div>

          {/* Checkbox Terminos */}
          <div className="bg-[#fffdf0] border-2 border-[#f9e285] rounded-2xl p-8 mb-12 flex flex-col sm:flex-row items-center justify-center gap-5 max-w-3xl mx-auto text-center sm:text-left shadow-sm">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-8 h-8 rounded-lg bg-white border-2 border-[#856404] text-[#856404] focus:ring-[#856404] cursor-pointer appearance-none checked:bg-[#856404] checked:border-[#856404] flex items-center justify-center relative before:content-['✓'] before:absolute before:text-white before:font-black before:text-lg before:opacity-0 checked:before:opacity-100 transition-all shadow-sm"
              />
            </div>
            <span className="text-lg font-black text-[#856404]">Confirmo nuevamente los términos y condiciones de la compra.</span>
          </div>

          {/* Progress Summary */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-10 mb-12 shadow-sm">
            <h4 className="text-xl font-black text-gray-900 mb-8 text-center uppercase tracking-widest">Resumen de progreso</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-8 md:gap-16">
              
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
          <div className="flex flex-col md:flex-row gap-6 items-stretch h-full max-w-4xl mx-auto">
            {!uploadSuccess ? (
              <div className="bg-[#fff9e6] border-2 border-[#ffe082] rounded-2xl p-6 flex-1 flex flex-col justify-center text-center md:text-left shadow-sm">
                <strong className="text-amber-900 text-lg font-black block mb-1">Falta cargar 1 comprobante</strong>
                <span className="text-amber-800 text-sm font-bold">Para continuar, subí el comprobante pendiente.</span>
              </div>
            ) : !termsAccepted ? (
               <div className="bg-[#fff9e6] border-2 border-[#ffe082] rounded-2xl p-6 flex-1 flex flex-col justify-center text-center md:text-left shadow-sm">
                <strong className="text-amber-900 text-lg font-black block mb-1">Términos no aceptados</strong>
                <span className="text-amber-800 text-sm font-bold">Aceptá los términos para finalizar.</span>
              </div>
            ) : (
              <div className="bg-[#e6f4ea] border-2 border-[#34a853] rounded-2xl p-6 flex-1 flex flex-col justify-center text-[#137333] text-center md:text-left shadow-sm">
                <strong className="text-lg font-black block mb-1">¡Todo listo!</strong>
                <span className="text-sm font-bold">Podés finalizar tu pedido.</span>
              </div>
            )}

            <button 
              onClick={handleFinalize}
              disabled={!uploadSuccess || !termsAccepted}
              className={`md:w-1/2 flex items-center justify-center gap-4 rounded-2xl py-6 font-black uppercase text-xl tracking-widest transition-all ${
                uploadSuccess && termsAccepted 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl hover:shadow-2xl hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
              }`}
            >
              {!uploadSuccess || !termsAccepted ? <FaLock size={20} /> : <FaCheck size={20} />}
              Finalizar Pedido
            </button>
          </div>

          <div className="mt-12 text-center">
            <a href="/figuritas" className="inline-block text-[#001489] font-black text-sm uppercase tracking-widest hover:underline bg-[#f8fbff] px-6 py-3 rounded-full border border-[#c4dbf6]">← Volver al inicio</a>
          </div>

        </div>
      </div>
    </div>
  );
}
