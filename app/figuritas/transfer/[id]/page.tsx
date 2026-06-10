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
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pt-24 pb-24 px-4 md:px-8 font-sans w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] flex flex-col items-center justify-center mx-auto">
        {/* Main Card Container */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-16 lg:p-20 mb-10 w-full flex flex-col items-center justify-center" style={{ gap: '4rem' }}>
          
          {/* Progress Flow Steps */}
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-8 hidden sm:flex w-full max-w-4xl mx-auto" style={{ marginBottom: '2rem' }}>
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
          <div className="text-center flex flex-col items-center w-full" style={{ gap: '1.5rem', marginTop: '1rem' }}>
            <span className="inline-block bg-[#eaf2ff] text-[#001489] text-sm font-black px-6 py-2.5 rounded-full tracking-widest uppercase shadow-sm">Paso 2 · Transferencia</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight text-center w-full">Realizá la transferencia bancaria</h2>
            <div className="flex flex-col items-center text-gray-600 text-lg md:text-xl" style={{ gap: '0.75rem' }}>
              <p>Transferí únicamente a la cuenta indicada según tu pedido.</p>
              <p>Tu envío seleccionado: <strong className="text-gray-900 font-black">{order.shippingAddress?.shippingMethod === 'via_cargo_domicilio' ? 'Vía Cargo a domicilio' : 'Vía Cargo a sucursal'}</strong></p>
            </div>
          </div>

          {/* Transfer Method Box */}
          <div className="border-4 border-[#001489] rounded-3xl p-10 md:p-14 bg-[#f8fbff] flex flex-col items-center text-center w-full max-w-4xl mx-auto shadow-md" style={{ gap: '2rem' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#001489] text-white flex items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <strong className="text-2xl md:text-3xl font-black text-gray-900 text-center">Transferencia bancaria</strong>
            </div>
            <div className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl flex flex-col items-center text-center" style={{ gap: '1.5rem' }}>
              <p>La cuenta que realiza el pago debe ser la misma a la que se factura.</p>
              <p>Para las Figuritas del Mundial se transfiere <strong className="text-gray-900 font-black text-xl bg-[#ffed00] px-2 py-1 rounded">únicamente a la cuenta de Mercado Pago JB Imports</strong>.</p>
            </div>
          </div>

          {/* Bank Accounts Grid */}
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 md:p-16 shadow-xl w-full max-w-5xl mx-auto flex flex-col items-center" style={{ gap: '3rem' }}>
            <div className="text-center flex flex-col items-center w-full" style={{ gap: '1.5rem' }}>
              <span className="inline-block bg-[#ffed00] text-black text-xs font-black px-5 py-2.5 rounded-full tracking-widest uppercase shadow-sm">Cuentas para realizar el pago</span>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 text-center">Revisá bien la cuenta antes de transferir</h3>
            </div>

            <div className="w-full max-w-lg mx-auto">
              {/* Card MP */}
              <div className="border-[3px] border-red-500 rounded-3xl bg-white relative overflow-hidden flex flex-col shadow-2xl w-full">
                <div className="p-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-5 border-b-2 border-gray-100 text-center sm:text-left">
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="Mercado Pago" className="w-20 h-20 object-contain shrink-0" />
                  <div className="flex-col flex" style={{ gap: '0.25rem' }}>
                    <strong className="text-2xl font-black text-gray-900">JB Imports / MP</strong>
                    <span className="text-base text-gray-500 font-medium">Solo figuritas del Mundial</span>
                  </div>
                  <span className="bg-red-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full absolute top-4 right-4 sm:top-6 sm:right-6 uppercase tracking-widest shadow-md">ACTIVA</span>
                </div>
                
                <div className="p-8 md:p-12 flex-1 flex flex-col items-center text-center" style={{ gap: '1.5rem' }}>
                  <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Total a pagar</span>
                  <div className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter" style={{ marginBottom: '1rem' }}>
                    ${order.total?.toLocaleString('es-AR')}
                  </div>
                  
                  <div className="w-full flex flex-col" style={{ gap: '1rem' }}>
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between border-2 border-gray-200 gap-5 shadow-sm w-full">
                      <div className="flex flex-col items-center sm:items-start" style={{ gap: '0.5rem' }}>
                        <span className="text-xs text-gray-500 font-black uppercase tracking-widest">Alias / cuenta</span>
                        <strong className="text-2xl font-black text-gray-900">{ALIAS_MP}</strong>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(ALIAS_MP, 'alias')}
                        className={`w-full sm:w-auto px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest transition-all border-2 ${
                          copiedField === 'alias' 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' 
                            : 'bg-white text-red-500 border-red-500 hover:bg-red-50 hover:shadow-lg'
                        }`}
                      >
                        {copiedField === 'alias' ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <span className="text-red-500 text-sm font-black uppercase tracking-widest text-center mt-2">Requiere comprobante de pago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total general black bar */}
            <div className="bg-[#111] text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between w-full max-w-3xl mx-auto shadow-2xl" style={{ gap: '1.5rem' }}>
              <span className="font-black text-lg uppercase tracking-widest text-gray-300 text-center">Total general del pedido</span>
              <strong className="text-3xl md:text-4xl font-black text-white text-center">${order.total?.toLocaleString('es-AR')}</strong>
            </div>

            <div className="text-base text-gray-700 bg-gray-50 p-6 md:p-8 rounded-2xl border-2 border-gray-200 text-center w-full max-w-3xl mx-auto flex flex-col" style={{ gap: '0.5rem' }}>
              <strong className="text-gray-900 font-bold">Transferí únicamente a la cuenta indicada.</strong> No se aceptan pagos en otras cuentas bancarias.
            </div>
          </div>

          {/* Section 2: Upload Proof */}
          <div className="w-full flex flex-col items-center" style={{ gap: '3rem' }}>
            <div className="flex flex-col items-center text-center w-full" style={{ gap: '2rem' }}>
              <div className="flex flex-col items-center w-full" style={{ gap: '1.5rem' }}>
                <span className="inline-block bg-[#e6f4ea] text-[#137333] text-sm font-black px-6 py-2.5 rounded-full tracking-widest uppercase shadow-sm">Paso 3 · Comprobantes</span>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 flex flex-col sm:flex-row items-center justify-center text-center w-full" style={{ gap: '1rem' }}>
                  <span>Cargá tu comprobante de pago</span>
                  <span className="text-3xl">🔒</span>
                </h3>
                <p className="text-gray-600 text-xl">Necesitamos verificar tu pago para continuar con el pedido.</p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-10 py-6 text-center flex flex-col items-center shadow-sm" style={{ gap: '0.5rem' }}>
                <div className="text-5xl font-black text-[#137333] flex items-center justify-center" style={{ gap: '0.5rem' }}>
                  {uploadSuccess ? '1' : '0'} <span className="text-gray-500 text-2xl font-black">de 1</span>
                </div>
                <span className="text-xs uppercase font-black tracking-[0.2em] text-gray-500">comprobante cargado</span>
              </div>
            </div>

            {/* Upload Area */}
            <div className="border-4 border-gray-200 rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-center bg-white shadow-xl w-full max-w-5xl mx-auto" style={{ gap: '4rem' }}>
              <div className="flex flex-col items-center text-center flex-1" style={{ gap: '1.5rem' }}>
                <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="MP" className="w-24 h-24 rounded-3xl bg-white shadow-md object-contain p-4 border border-gray-100" />
                <div className="flex flex-col items-center w-full" style={{ gap: '0.75rem' }}>
                  <strong className="block text-2xl text-gray-900 font-black">Comprobante Mercado Pago</strong>
                  <span className="block text-lg text-gray-600">Monto a transferir: <strong className="text-gray-900 font-black">${order.total?.toLocaleString('es-AR')}</strong></span>
                  <span className={`inline-block px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm mt-2 ${uploadSuccess ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    {uploadSuccess ? 'Cargado' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full relative min-h-[220px]">
                {uploadSuccess ? (
                  <div className="w-full h-full min-h-[220px] bg-emerald-50 border-4 border-emerald-500 border-dashed rounded-3xl flex flex-col items-center justify-center text-emerald-600 p-8 text-center shadow-inner" style={{ gap: '1.5rem' }}>
                    <FaCheckCircle size={56} />
                    <span className="font-black text-2xl">Comprobante subido exitosamente</span>
                  </div>
                ) : (
                  <label className={`w-full h-full min-h-[220px] flex flex-col items-center justify-center p-10 border-4 border-dashed ${uploading ? 'bg-gray-50 border-gray-300 text-gray-400' : 'bg-[#f4fbf6] border-[#34a853] text-[#137333] hover:bg-[#eaf6ec] cursor-pointer'} rounded-3xl transition-all shadow-inner`} style={{ gap: '1rem' }}>
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf,.webp" onChange={handleFileUpload} disabled={uploading} />
                    {uploading ? (
                      <div className="flex items-center text-xl font-black" style={{ gap: '1rem' }}><FaSpinner className="animate-spin" /> Procesando archivo...</div>
                    ) : (
                      <>
                        <span className="text-5xl font-black">↑</span>
                        <strong className="text-xl font-black uppercase tracking-widest text-center mt-2">Subir comprobante</strong>
                        <small className="text-sm opacity-80 font-bold text-gray-500 text-center">JPG, PNG, PDF o WEBP. Máx. 8MB.</small>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="text-lg md:text-xl text-[#137333] bg-[#e6f4ea] p-8 rounded-2xl border-2 border-[#ceead6] font-black text-center w-full max-w-4xl mx-auto shadow-sm">
              Una vez subido el comprobante requerido podrás finalizar tu pedido.
            </div>
          </div>

          {/* Checkbox Terminos */}
          <div className="bg-[#fffdf0] border-2 border-[#f9e285] rounded-3xl p-10 md:p-12 flex flex-col sm:flex-row items-center justify-center w-full max-w-4xl mx-auto text-center sm:text-left shadow-sm" style={{ gap: '2rem' }}>
            <div className="relative flex items-center justify-center shrink-0">
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-10 h-10 rounded-xl bg-white border-4 border-[#856404] text-[#856404] focus:ring-[#856404] cursor-pointer appearance-none checked:bg-[#856404] checked:border-[#856404] flex items-center justify-center relative before:content-['✓'] before:absolute before:text-white before:font-black before:text-2xl before:opacity-0 checked:before:opacity-100 transition-all shadow-md"
              />
            </div>
            <span className="text-xl font-black text-[#856404]">Confirmo nuevamente los términos y condiciones de la compra.</span>
          </div>

          {/* Progress Summary */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-10 md:p-12 shadow-sm w-full max-w-4xl mx-auto flex flex-col items-center" style={{ gap: '2.5rem' }}>
            <h4 className="text-2xl font-black text-gray-900 text-center uppercase tracking-widest">Resumen de progreso</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center w-full" style={{ gap: '3rem' }}>
              
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
          <div className="flex flex-col md:flex-row items-stretch h-full w-full max-w-5xl mx-auto" style={{ gap: '2rem' }}>
            {!uploadSuccess ? (
              <div className="bg-[#fff9e6] border-[3px] border-[#ffe082] rounded-[2rem] p-10 flex-1 flex flex-col justify-center text-center shadow-sm" style={{ gap: '0.75rem' }}>
                <strong className="text-amber-900 text-2xl font-black block">Falta cargar 1 comprobante</strong>
                <span className="text-amber-800 text-lg font-bold">Para continuar, subí el comprobante pendiente.</span>
              </div>
            ) : !termsAccepted ? (
               <div className="bg-[#fff9e6] border-[3px] border-[#ffe082] rounded-[2rem] p-10 flex-1 flex flex-col justify-center text-center shadow-sm" style={{ gap: '0.75rem' }}>
                <strong className="text-amber-900 text-2xl font-black block">Términos no aceptados</strong>
                <span className="text-amber-800 text-lg font-bold">Aceptá los términos para finalizar.</span>
              </div>
            ) : (
              <div className="bg-[#e6f4ea] border-[3px] border-[#34a853] rounded-[2rem] p-10 flex-1 flex flex-col justify-center text-[#137333] text-center shadow-sm" style={{ gap: '0.75rem' }}>
                <strong className="text-2xl font-black block">¡Todo listo!</strong>
                <span className="text-lg font-bold">Podés finalizar tu pedido.</span>
              </div>
            )}

            <button 
              onClick={handleFinalize}
              disabled={!uploadSuccess || !termsAccepted}
              className={`md:w-1/2 flex items-center justify-center rounded-[2rem] py-8 font-black uppercase text-2xl tracking-[0.2em] transition-all ${
                uploadSuccess && termsAccepted 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl hover:shadow-2xl hover:-translate-y-1' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border-4 border-gray-300'
              }`}
              style={{ gap: '1rem' }}
            >
              {!uploadSuccess || !termsAccepted ? <FaLock size={24} /> : <FaCheck size={24} />}
              Finalizar Pedido
            </button>
          </div>

          <div className="text-center w-full mt-4">
            <a href="/figuritas" className="inline-block text-[#001489] font-black text-lg uppercase tracking-widest hover:underline bg-[#f8fbff] px-10 py-5 rounded-full border-2 border-[#c4dbf6]">← Volver al inicio</a>
          </div>

        </div>
      </div>
    </div>
  );
}
