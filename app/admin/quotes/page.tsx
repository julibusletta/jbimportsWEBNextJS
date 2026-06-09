'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaPrint, FaSearch, FaTrash, FaPlus, FaMinus, FaUser, FaWhatsapp, FaInstagram, FaFileInvoiceDollar } from 'react-icons/fa';
import { Product } from '@/lib/api/productService';

interface QuoteItem {
  product: Product;
  quantity: number;
}

export default function QuotesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quote State
  const [clientName, setClientName] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin');
      const data = await resp.json();
      const fetchedProducts: Record<string, Product[]> = data.products || {};
      
      // Flatten products into a single array
      const flatProducts: Product[] = [];
      Object.values(fetchedProducts).forEach(categoryProducts => {
        flatProducts.push(...categoryProducts);
      });
      
      setProducts(flatProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const addToQuote = (product: Product) => {
    setQuoteItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setSearchTerm(''); // Clear search after adding
  };

  const updateQuantity = (productId: string, delta: number) => {
    setQuoteItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const setQuantity = (productId: string, qty: number) => {
    if (qty < 1 || isNaN(qty)) return;
    setQuoteItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: qty } : item
    ));
  };

  const removeItem = (productId: string) => {
    setQuoteItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return quoteItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [quoteItems]);

  const discountAmount = useMemo(() => {
    return subtotal * (discountPercent / 100);
  }, [subtotal, discountPercent]);

  const total = subtotal - discountAmount;

  // Filter products for search
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products
      .filter(p => 
        p.published !== false && 
        p.stock > 0 && 
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 10); // Limit to 10 results
  }, [searchTerm, products]);

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Cargando catálogo...</div>;

  return (
    <div className="quotes-container p-4 md:p-10 bg-[#f8fafb] min-h-screen">
      
      {/* HEADER - HIDDEN IN PRINT */}
      <div className="no-print mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Cotizador de Productos</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Genera presupuestos en PDF para tus clientes</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <button 
             onClick={handlePrint}
             disabled={quoteItems.length === 0}
             className="px-6 py-3 bg-[#058c8c] text-white rounded font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#047a7a] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <FaPrint /> Generar Presupuesto PDF
           </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN: CONTROLS (HIDDEN IN PRINT) */}
        <div className="no-print w-full xl:w-1/3 space-y-6">
          
          {/* CLIENT DATA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e1e3e5]">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-[#058c8c]" /> Datos del Cliente
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre / Empresa</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Juan Pérez / Tech Store SRL"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#058c8c] text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bonificación / Descuento (%)</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-24 px-4 py-2 border border-gray-200 rounded-l-lg outline-none focus:border-[#058c8c] text-sm font-black text-center"
                  />
                  <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg font-bold text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT SEARCH */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e1e3e5]">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
              <FaSearch className="text-[#058c8c]" /> Buscar Producto
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Código o nombre..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-inner outline-none focus:border-[#058c8c] focus:bg-white transition-all font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* SEARCH RESULTS */}
            {searchTerm.trim() !== '' && (
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 font-medium">No se encontraron productos.</div>
                ) : (
                  filteredProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs font-black text-gray-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">${p.price.toLocaleString('es-AR')} • Stock: {p.stock}</p>
                      </div>
                      <button 
                        onClick={() => addToQuote(p)}
                        className="px-3 py-1.5 bg-[#058c8c] text-white rounded font-bold text-[10px] uppercase hover:bg-[#047a7a] transition-colors whitespace-nowrap"
                      >
                        Agregar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
        </div>

        {/* RIGHT COLUMN: PRINTABLE QUOTE */}
        <div className="w-full xl:w-2/3">
          <div className="print-only-container bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-[#e1e3e5] min-h-[600px] flex flex-col relative">
            
            {/* WATERMARK BKG (Optional, just for aesthetics in print) */}
            <div className="hidden print-watermark absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <FaFileInvoiceDollar className="text-[400px] text-gray-900" />
            </div>

            {/* PDF HEADER */}
            <div className="print-header flex items-start justify-between border-b-2 border-black pb-8 mb-8 relative z-10">
               <div className="flex items-center gap-6">
                  <img src="/images/logotest9.png" alt="JBimports" className="h-16 w-auto object-contain" />
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Presupuesto</h1>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Cotización Oficial</p>
                  </div>
               </div>
               <div className="text-right space-y-1">
                  <div className="text-[10px] font-black text-gray-500 uppercase mb-2">
                    Fecha: <span className="text-black">{new Date().toLocaleDateString('es-AR')}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[11px] font-black text-black">
                    <FaWhatsapp className="text-green-600 text-sm" /> +54 9 11 5145-7720
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[11px] font-black text-black">
                    <FaInstagram className="text-pink-600 text-sm" /> @jbimportsarg
                  </div>
               </div>
            </div>

            {/* CLIENT INFO */}
            <div className="print-client-info mb-8 relative z-10">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preparado para:</p>
                <p className="text-base font-black text-gray-900 uppercase">
                  {clientName || <span className="text-gray-400 italic no-print">(Nombre del cliente vacío)</span>}
                  {(!clientName) && <span className="hidden print-client-placeholder">_______________________________</span>}
                </p>
              </div>
            </div>

            {/* QUOTE ITEMS */}
            <div className="flex-1 relative z-10">
              {quoteItems.length === 0 ? (
                <div className="no-print h-64 flex flex-col items-center justify-center text-gray-400">
                  <FaFileInvoiceDollar className="text-4xl mb-4 opacity-50" />
                  <p className="font-bold">Agrega productos para armar el presupuesto.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-2 py-3 text-left text-[10px] font-black uppercase text-gray-400 w-16">Cant.</th>
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-400">Producto</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-400 w-32">Precio Unit.</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-400 w-32">Subtotal</th>
                        <th className="px-2 py-3 no-print w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {quoteItems.map((item) => (
                        <tr key={item.product.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-2 py-4">
                            {/* PRINT QTY */}
                            <span className="hidden print-qty text-sm font-black text-center">{item.quantity}</span>
                            {/* WEB QTY CONTROLS */}
                            <div className="no-print flex items-center justify-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded">
                                <FaMinus className="text-[10px]" />
                              </button>
                              <input 
                                type="number" 
                                value={item.quantity}
                                onChange={(e) => setQuantity(item.product.id, parseInt(e.target.value))}
                                className="w-8 text-center text-xs font-black outline-none"
                              />
                              <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded">
                                <FaPlus className="text-[10px]" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs font-black text-gray-800 leading-tight">
                            {item.product.name}
                            <div className="text-[9px] text-gray-400 font-medium mt-1">Cod: {item.product.id}</div>
                          </td>
                          <td className="px-4 py-4 text-right text-xs font-bold text-gray-600">
                            ${item.product.price.toLocaleString('es-AR')}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-black text-black">
                            ${(item.product.price * item.quantity).toLocaleString('es-AR')}
                          </td>
                          <td className="px-2 py-4 text-center no-print">
                            <button 
                              onClick={() => removeItem(item.product.id)}
                              className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar producto"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* QUOTE TOTALS */}
            {quoteItems.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-black flex flex-col items-end gap-2 relative z-10">
                <div className="flex justify-between w-64 text-sm font-bold text-gray-500">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString('es-AR')}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between w-64 text-sm font-bold text-[#058c8c]">
                    <span>Bonificación ({discountPercent}%):</span>
                    <span>-${discountAmount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 text-xl font-black text-black mt-2 pt-2 border-t border-gray-200">
                  <span>TOTAL:</span>
                  <span>${total.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            )}

            {/* PRINT FOOTER */}
            <div className="print-footer hidden mt-12 pt-8 border-t border-gray-100 text-center relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Los precios de este presupuesto tienen una validez de 7 días.
              </p>
              <p className="text-[9px] font-bold text-gray-300 mt-2">
                Generado por JBimports • {new Date().getFullYear()}
              </p>
            </div>
          </div>
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
          .quotes-container {
            padding: 0 !important;
            background: white !important;
          }
          .print-only-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .print-watermark {
             display: flex !important;
          }
          .print-qty {
            display: block !important;
          }
          .print-client-placeholder {
             display: inline !important;
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
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
