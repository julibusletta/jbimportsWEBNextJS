'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaCheckCircle, 
  FaInfoCircle, 
  FaUpload, 
  FaHome, 
  FaCopy, 
  FaExclamationTriangle,
  FaFileInvoiceDollar
} from 'react-icons/fa';

export default function TransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
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
        // Refresh order status if needed
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-40">Cargando datos de transferencia...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center pt-40 text-red-500">Orden no encontrada</div>;

  const deadline = new Date(order.createdAt || Date.now());
  deadline.setDate(deadline.getDate() + 2); // 48 hours deadline

  return (
    <div className="min-h-screen bg-[#eee] pt-48 pb-12 font-[Montserrat,sans-serif]">
      <style jsx global>{`
        @keyframes pulse-yellow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pulse-yellow {
          animation: pulse-yellow 2s infinite ease-in-out;
        }
      `}</style>
      <div className="max-w-[1000px] mx-auto px-4 lg:px-10">
        
        {/* Reservation Header (CompraGamer Style) */}
        <div className="bg-gradient-to-b from-white to-[#fff6df] rounded-[32px] p-10 mb-8 flex flex-col items-center text-center shadow-sm border border-amber-100">
          <div className="w-48 h-48 flex items-center justify-center bg-white rounded-full shadow-inner border border-amber-50 mb-6 animate-pulse-yellow">
             <div className="flex flex-col items-center text-[#fcbb11]">
                <FaExclamationTriangle size={80} />
                <span className="text-xs font-black mt-2 tracking-widest uppercase">PENDIENTE</span>
             </div>
          </div>
          
          <div className="flex-1 max-w-[800px]">
            <h1 className="text-2xl md:text-3xl text-gray-800 mb-6 leading-tight">
              Tu reserva <b className="text-black">{order.id}</b> ya fue confirmada. Sólo falta que realices el pago para que podamos avanzar.
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Tenés tiempo hasta el <b>{deadline.toLocaleDateString('es-AR')}</b> para abonar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label className={`cursor-pointer bg-[#f0320a] hover:bg-[#d62b08] text-white px-10 py-5 rounded-none font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                <FaUpload />
                {uploading ? 'SUBIENDO...' : 'SUBIR COMPROBANTE'}
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
              </label>
              
              <button 
                onClick={() => router.push('/')}
                className="bg-white border-2 border-gray-200 hover:border-[#f0320a] hover:text-[#f0320a] text-gray-700 px-10 py-5 rounded-none font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <FaHome /> VOLVER AL INICIO
              </button>
            </div>
          </div>
        </div>

        {/* Status Message for Upload */}
        {uploadSuccess && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-center gap-3 animate-bounce">
            <FaCheckCircle /> <b>¡Comprobante subido con éxito!</b> Revisaremos tu pago a la brevedad.
          </div>
        )}

        {/* Bank Details Container (CompraGamer Style) */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h2 className="text-xl font-bold mb-8 border-b pb-4">Datos para el pago</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            {/* Vertical Splitter (Desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 -translate-x-1/2"></div>
            
            {/* Transferencia Column */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#f0300a13] rounded-full flex items-center justify-center text-[#f0320a]">
                  <FaFileInvoiceDollar size={20} />
                </div>
                <h3 className="text-lg font-bold">Transferencia</h3>
              </div>
              
              <div className="space-y-4 text-sm md:text-base">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">Banco</span>
                  <div className="font-bold flex justify-between items-center group">
                    <span>BANCO GALICIA</span>
                    <FaCopy className="opacity-0 group-hover:opacity-100 cursor-pointer text-[#f0320a]" onClick={() => copyToClipboard('BANCO GALICIA')} />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">CBU</span>
                  <div className="font-bold flex justify-between items-center group bg-gray-50 p-2 rounded">
                    <span className="font-mono">0070000000000000000000</span>
                    <FaCopy className="cursor-pointer text-[#f0320a]" onClick={() => copyToClipboard('0070000000000000000000')} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">Alias</span>
                  <div className="font-bold flex justify-between items-center group bg-gray-50 p-2 rounded">
                    <span>JBIMPORTS.GALICIA</span>
                    <FaCopy className="cursor-pointer text-[#f0320a]" onClick={() => copyToClipboard('JBIMPORTS.GALICIA')} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">Titular</span>
                  <span className="font-bold">JULIAN BUSLETTA</span>
                </div>
              </div>
            </div>

            {/* Depósito Column */}
            <div className="flex flex-col gap-6 pt-12 lg:pt-0">
               {/* Horizontal Splitter (Mobile) */}
               <div className="lg:hidden absolute left-0 right-0 top-[45%] h-[1px] bg-gray-200"></div>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <FaHome size={20} />
                </div>
                <h3 className="text-lg font-bold">Depósito Bancario</h3>
              </div>
              
              <div className="space-y-4 text-sm md:text-base">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">Tipo de Cuenta</span>
                  <span className="font-bold">CAJA DE AHORRO $</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">Número de Cuenta</span>
                  <div className="font-bold flex justify-between items-center group">
                    <span>000-000000/0</span>
                    <FaCopy className="opacity-0 group-hover:opacity-100 cursor-pointer text-blue-600" onClick={() => copyToClipboard('000-000000/0')} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">CUIT</span>
                  <div className="font-bold flex justify-between items-center group">
                    <span>20-00000000-0</span>
                    <FaCopy className="opacity-0 group-hover:opacity-100 cursor-pointer text-blue-600" onClick={() => copyToClipboard('20-00000000-0')} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase mb-1">Importe a abonar</span>
                  <span className="text-2xl font-bold text-[#f0320a]">${order.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Info Alert */}
          <div className="mt-12 p-6 rounded-2xl border border-blue-200 bg-blue-50/50 flex gap-4">
            <FaInfoCircle className="text-blue-500 shrink-0 mt-1" size={24} />
            <div className="text-sm md:text-base text-gray-700 leading-relaxed">
              <h4 className="font-bold text-blue-800 mb-1 leading-snug">IMPORTANTE</h4>
              <p>
                Una vez realizado el pago recordá <b>subir el comprobante</b> utilizando el botón superior para que podamos procesar tu envío.
                Las transferencias suelen acreditarse en el acto, pero los depósitos mediante cajero pueden demorar hasta 24hs hábiles.
              </p>
            </div>
          </div>
        </div>

        {/* Items Summary (Mini) */}
        <div className="mt-8 bg-white/50 backdrop-blur rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
           <div className="flex items-center gap-3">
              <span className="text-gray-500 italic">Estás pagando por:</span>
              <div className="flex -space-x-2">
                {order.items?.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-white bg-white shadow-sm flex items-center justify-center overflow-hidden" title={item.name}>
                    <img src={item.image} alt="" className="max-h-full" />
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="w-8 h-8 rounded-full border border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
           </div>
           <div className="font-bold">Total: ${order.total?.toLocaleString()}</div>
        </div>

      </div>
    </div>
  );
}
