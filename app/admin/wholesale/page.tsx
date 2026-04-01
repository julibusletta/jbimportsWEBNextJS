'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPrint, FaArrowLeft, FaWhatsapp, FaInstagram, FaDownload } from 'react-icons/fa';
import { Product } from '@/lib/api/productService';
import * as XLSX from 'xlsx';

export default function WholesalePage() {
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(15); // Default 15% discount
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin');
      const data = await resp.json();
      setProducts(data.products || {});
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateWholesale = (price: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToExcel = () => {
    const flatData: any[] = [];
    Object.entries(products).forEach(([category, items]) => {
      items.forEach(p => {
        flatData.push({
          'Categoría': category.toUpperCase(),
          'Código': p.id,
          'Producto': p.name,
          'Precio Retail': p.price,
          'Descuento %': discount,
          'Precio Mayorista': calculateWholesale(p.price)
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lista Mayorista');
    XLSX.writeFile(wb, `Lista_Mayorista_JBimports_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Cargando catálogo...</div>;

  return (
    <div className="wholesale-container p-4 md:p-10 bg-[#f8fafb] min-h-screen">
      {/* HEADER - HIDDEN IN PRINT */}
      <div className="no-print mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Generador de Lista Mayorista</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Configura el descuento y genera tu PDF</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="bg-white border border-[#e1e3e5] rounded-lg p-3 flex items-center gap-4 shadow-sm">
             <span className="text-[10px] font-black uppercase text-gray-400">Descuento Global:</span>
             <div className="flex items-center gap-2">
               <input 
                 type="number" 
                 value={discount}
                 onChange={(e) => setDiscount(Number(e.target.value))}
                 className="w-16 bg-gray-50 border-b-2 border-[#058c8c] text-center font-black text-gray-900 outline-none p-1"
               />
               <span className="font-bold text-[#058c8c]">%</span>
             </div>
           </div>

           <button 
             onClick={handlePrint}
             className="px-6 py-3 bg-[#058c8c] text-white rounded font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#047a7a] transition-all flex items-center gap-3"
           >
             <FaPrint /> Imprimir / PDF
           </button>

           <button 
             onClick={exportToExcel}
             className="px-6 py-3 bg-gray-900 text-white rounded font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-3"
           >
             <FaDownload /> Excel
           </button>
        </div>
      </div>

      {/* SEARCH - HIDDEN IN PRINT */}
      <div className="no-print mb-10">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full max-w-md px-6 py-4 bg-white border border-[#e1e3e5] rounded-xl shadow-sm outline-none focus:border-[#058c8c] transition-all font-medium text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PRINTABLE AREA */}
      <div className="print-only-container bg-white p-0 md:p-8 rounded-2xl shadow-sm border border-[#e1e3e5]">
        
        {/* PDF HEADER - ONLY VISIBLE IN PRINT */}
        <div className="print-header hidden mb-10 items-center justify-between border-b-4 border-black pb-8">
           <div className="flex items-center gap-6">
              <img src="/images/logotest9.png" alt="JBimports" className="h-16 w-auto object-contain" />
              <div>
                <h2 className="text-2xl font-black text-black leading-tight">JB IMPORTS</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Lista de Precios Mayorista</p>
              </div>
           </div>
           <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2 text-sm font-black text-black">
                <FaWhatsapp className="text-green-600" /> +54 9 11 5145-7720
              </div>
              <div className="flex items-center justify-end gap-2 text-sm font-black text-black">
                <FaInstagram className="text-pink-600" /> @jbimportsarg
              </div>
              <div className="text-[9px] font-bold text-gray-400 mt-2 italic">Fecha: {new Date().toLocaleDateString()}</div>
           </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="space-y-12">
          {Object.entries(products).map(([category, items]) => {
            const filteredItems = items.filter(p => 
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              p.id.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={category} className="category-block break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-black text-white px-6 py-2 mb-4 inline-block">
                  {category}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-400 w-24">Código</th>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-400">Producto</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-400 w-32">P. Mayorista</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredItems.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-[10px] font-bold text-gray-400">#{p.id}</td>
                          <td className="px-4 py-3 text-xs font-black text-gray-800">{p.name}</td>
                          <td className="px-4 py-3 text-right text-sm font-black text-black">
                            ${calculateWholesale(p.price).toLocaleString('es-AR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* PRINT FOOTER */}
        <div className="print-footer hidden mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Precios sujetos a cambios sin previo aviso • JBimports 2026
          </p>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .admin-v2-sidebar, .admin-v2-header {
            display: none !important;
          }
          .admin-v2-main, .admin-v2-content {
             padding: 0 !important;
             margin: 0 !important;
             background: white !important;
          }
          .admin-v2-container {
             display: block !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .wholesale-container {
            padding: 0 !important;
            background: white !important;
          }
          .print-only-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .print-header {
            display: flex !important;
          }
          .print-footer {
            display: block !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .category-block {
            page-break-inside: avoid;
            margin-bottom: 2rem;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
