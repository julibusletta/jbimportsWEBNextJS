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
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaLock,
  FaUniversity
} from 'react-icons/fa';

export default function TransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-40">Cargando datos de transferencia...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center pt-40 text-red-500 font-bold">Orden no encontrada</div>;

  const deadline = new Date(order.createdAt || Date.now());
  deadline.setDate(deadline.getDate() + 2);

  return (
    <div className="min-h-screen bg-[#f4f7f6] pt-48 pb-20 font-[Montserrat,sans-serif] flex flex-col items-center w-full">
      <style jsx global>{`
        @keyframes subtle-glow {
          0% { box-shadow: 0 0 5px rgba(252, 187, 17, 0.2); }
          50% { box-shadow: 0 0 20px rgba(252, 187, 17, 0.4); }
          100% { box-shadow: 0 0 5px rgba(252, 187, 17, 0.2); }
        }
        .animate-glow {
          animation: subtle-glow 3s infinite ease-in-out;
        }
      `}</style>
      
      <div className="w-full max-w-[900px] px-4 flex flex-col items-center">
        
        {/* Main Status Card */}
        <div className="w-full bg-white shadow-xl border border-gray-100 rounded-none overflow-hidden mb-10 text-center">
          <div className="bg-[#fffcf0] p-10 flex flex-col items-center border-b border-amber-100/50">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 animate-glow border border-amber-100 shadow-sm">
               <div className="flex flex-col items-center text-[#fcbb11]">
                  <FaExclamationTriangle size={50} />
                  <span className="text-[10px] font-black mt-2 tracking-[0.2em] uppercase">Pendiente</span>
               </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 max-w-[700px] leading-tight">
              Tu reserva <span className="text-[#f0320a]">#{order.id}</span> está confirmada
            </h1>
            <p className="text-gray-500 text-lg">
              Sólo falta que realices el pago para que podamos avanzar con tu envío.
            </p>
          </div>
          
          <div className="p-8 bg-white">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-400 font-medium bg-gray-50 px-4 py-2 border border-gray-100">
                <FaLock className="text-xs" />
                <span className="text-xs tracking-widest uppercase">Pago Seguro SSL</span>
              </div>
              <p className="text-gray-400 text-sm italic">
                Cierre de reserva: <b>{deadline.toLocaleDateString('es-AR')}</b>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label className={`cursor-pointer bg-[#f0320a] hover:bg-black text-white px-12 py-5 rounded-none font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-red-100 ${uploading ? 'opacity-70 pointer-events-none text-gray-300 bg-gray-800' : ''}`}>
                <FaUpload />
                {uploading ? 'Procesando...' : 'Subir Comprobante'}
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
              </label>
              
              <button 
                onClick={() => router.push('/')}
                className="bg-white border-2 border-gray-200 hover:border-black hover:text-black text-gray-500 px-12 py-5 rounded-none font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <FaHome /> Inicio
              </button>
            </div>
          </div>
        </div>

        {uploadSuccess && (
          <div className="w-full mb-10 p-5 bg-green-600 text-white rounded-none flex items-center justify-center gap-4 font-bold shadow-lg animate-in slide-in-from-top duration-500">
            <FaCheckCircle className="text-xl" /> ¡Comprobante recibido! Lo verificaremos a la brevedad.
          </div>
        )}

        {/* Info Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-1 gap-0 bg-white shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-8 flex-1">
               <div className="flex items-center gap-4 border-l-4 border-[#f0320a] pl-4">
                  <FaUniversity className="text-[#f0320a] text-2xl" />
                  <h2 className="text-xl font-black uppercase tracking-widest">Datos Bancarios</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="flex flex-col border-b border-gray-50 pb-2 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Banco</span>
                    <span className="font-bold text-gray-800">BANCO GALICIA</span>
                  </div>
                  <div className="flex flex-col border-b border-gray-50 pb-2 group relative">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CBU</span>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-gray-800 font-bold">0070000000000000000000</span>
                      <button onClick={() => copyToClipboard('0070000000000000000000', 'cbu')} className="text-[#f0320a] hover:scale-110 transition-transform">
                        {copiedField === 'cbu' ? <FaCheckCircle /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col border-b border-gray-50 pb-2 group relative">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Alias</span>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 uppercase">JBIMPORTS.GALICIA</span>
                      <button onClick={() => copyToClipboard('JBIMPORTS.GALICIA', 'alias')} className="text-[#f0320a] hover:scale-110 transition-transform">
                        {copiedField === 'alias' ? <FaCheckCircle /> : <FaCopy />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col border-b border-gray-50 pb-2 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Titular</span>
                    <span className="font-bold text-gray-800">JULIAN BUSLETTA</span>
                  </div>
                  <div className="flex flex-col border-b border-gray-50 pb-2 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CUIT</span>
                    <span className="font-bold text-gray-800">20-00000000-0</span>
                  </div>
                  <div className="flex flex-col border-b border-gray-50 pb-2 group">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total a Transferir</span>
                    <span className="text-2xl font-black text-[#f0320a] tracking-tighter">${order.total?.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="p-10 bg-gray-50 flex items-start gap-6 border-t border-gray-100">
             <div className="bg-[#f0320a] text-white p-3 shadow-lg shadow-red-100">
                <FaInfoCircle size={20} />
             </div>
             <div className="text-sm text-gray-600 leading-relaxed font-medium">
                <h4 className="font-black text-black uppercase tracking-widest mb-2 flex items-center gap-2">
                   Importante
                   <span className="w-10 h-[1px] bg-red-200"></span>
                </h4>
                <p>
                  Una vez realizado el pago recordá <b>subir el comprobante</b> utilizando el botón superior para procesar tu envío de inmediato.
                  Las transferencias suelen acreditarse en el acto, pero los depósitos mediante cajero físico pueden demorar hasta 24hs hábiles.
                </p>
             </div>
          </div>
        </div>

        {/* Order Summary Line */}
        <div className="w-full mt-10 border-t border-gray-200 pt-8 flex flex-col items-center opacity-70">
           <div className="flex items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              <FaShieldAlt /> 
              <span>Compra 100% Protegida</span>
           </div>
           <div className="flex items-center gap-10">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pedido</span>
                 <span className="font-bold text-gray-500">#{order.id.substring(0,8)}</span>
              </div>
              <div className="w-[1px] h-6 bg-gray-200"></div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Items</span>
                 <span className="font-bold text-gray-500">{order.items?.length || 0} productos</span>
              </div>
              <div className="w-[1px] h-6 bg-gray-200"></div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total</span>
                 <span className="font-bold text-gray-900">${order.total?.toLocaleString()}</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
