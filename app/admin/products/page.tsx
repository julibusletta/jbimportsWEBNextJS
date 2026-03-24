'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Product as BaseProduct } from '@/lib/api/mockCategoryProducts';
import { Spec } from '@/lib/api/productSpecifications';
import Link from 'next/link';
import { FaUpload, FaSave, FaInfoCircle, FaSearch, FaTable, FaThList, FaTimesCircle, FaTags, FaBoxOpen, FaCogs, FaGlobe, FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

import { Product } from '@/lib/api/mockCategoryProducts';

export default function ProductsPage() {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [specifications, setSpecifications] = useState<Record<string, Spec[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'specs' | 'seo'>('general');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch('/api/admin');
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || 'Error al cargar datos');
      }
      const data = await resp.json();
      setProducts(data.products || {});
      setSpecifications(data.specifications || {});
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStockChange = (category: string, id: string, newValue: number) => {
    const updated = { ...products };
    const p = updated[category].find(x => x.id === id);
    if (p) p.stock = newValue;
    setProducts(updated);
  };

  const handlePriceChange = (category: string, id: string, newValue: number) => {
    const updated = { ...products };
    const p = updated[category].find(x => x.id === id);
    if (p) p.price = newValue;
    setProducts(updated);
  };

  const handleProductChange = <K extends keyof Product>(id: string, category: string, field: K, value: Product[K]) => {
    setProducts(prevProducts => {
      const updated = { ...prevProducts };
      if (updated[category]) {
        updated[category] = updated[category].map(p => {
          if (p.id === id) {
             const newP = { ...p, [field]: value };
             if (field === 'images' && Array.isArray(value)) {
               newP.image = (value[0] as string) || '/images/placeholder.jpg';
             }
             return newP;
          }
          return p;
        });
      }
      return updated;
    });

    setEditingProduct(prev => {
      if (prev?.id === id) {
        return { ...prev, [field]: value };
      }
      return prev;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file || !editingProduct) return;

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const res = await resp.json();
      if (res.success) {
        const newImages = [...(editingProduct.images || [])];
        newImages[index] = res.url;
        handleProductChange(editingProduct.id, editingProduct.category, 'images', newImages.filter(Boolean));
      } else {
        alert(res.message || 'Error al subir archivo');
      }
    } catch (err) {
      alert('Error de conexión al subir');
    } finally {
      setUploadingIndex(null);
    }
  };

  const saveProducts = async () => {
    setMessage('Guardando cambios...');
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'save_products', data: products }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage('¡Cambios guardados con éxito!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${res.message}`);
      }
    } catch (err) {
      setMessage('Error de conexión al guardar');
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage('Procesando archivo Excel...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
        const getVal = (row: any, ...keys: string[]) => {
          const rowKeys = Object.keys(row);
          const normalizedTargetKeys = keys.map(normalize);
          const match = rowKeys.find(rk => normalizedTargetKeys.includes(normalize(rk)));
          return match !== undefined ? row[match] : undefined;
        };

        const resolveCategory = (raw: string): string => {
          const s = raw.toLowerCase();
          if (s.includes('iphone')) return 'iphone';
          if (s.includes('celular') || s.includes('telefono')) return 'celulares';
          if (s.includes('auricular') || s.includes('headset')) return 'auriculares';
          if (s.includes('parlante') || s.includes('audio') || s.includes('speaker')) return 'parlantes';
          if (s.includes('macbook')) return 'macbook';
          if (s.includes('watch') || s.includes('reloj')) return 'watch';
          if (s.includes('notebook') || s.includes('laptop')) return 'notebooks';
          if (s.includes('apple')) return 'apple';
          return s.split(',')[0].trim() || 'general';
        };

        const mappedProducts = json.map((row: any) => {
          const rawId = getVal(row, 'ID', 'id', 'idnoeditable', 'codigo');
          const rawName = getVal(row, 'Nombre', 'name', 'nombreproducto', 'producto', 'articulo');
          if (!rawId || !rawName) return null;

          const priceOriginal = Number(getVal(row, 'Precio', 'price', 'valor') || 0);
          const priceDiscount = getVal(row, 'Precio con descuento', 'preciocondescuento', 'descuento', 'oferta');
          const finalPrice = priceDiscount ? Number(priceDiscount) : priceOriginal;
          const imagesRaw = String(getVal(row, 'Imágenes producto', 'imagenesproducto', 'imagen', 'image', 'foto') || '');
          const allImages = imagesRaw.split(/[,\s+]/).map(s => s.trim()).filter(Boolean).slice(0, 4);
          const firstImage = allImages[0] || '/images/placeholder.jpg';
          const rawCategory = String(getVal(row, 'Categoría', 'category', 'categoria', 'rubro') || 'general');

          return {
            id: String(rawId).trim(),
            name: String(rawName).trim(),
            price: finalPrice,
            originalPrice: priceOriginal,
            image: firstImage,
            images: allImages,
            category: resolveCategory(rawCategory),
            description: String(getVal(row, 'Descripción', 'description', 'descripcion', 'detalle') || ''),
            stock: Number(getVal(row, 'Cantidad', 'stock', 'stock', 'cantidad') || 0),
            badge: String(getVal(row, 'Badge', 'badge', 'etiqueta', 'promo', 'tipo') || ''),
          };
        }).filter(Boolean);

        if (mappedProducts.length === 0) throw new Error("No se encontraron productos válidos en el Excel.");

        const resp = await fetch('/api/admin', {
          method: 'POST',
          body: JSON.stringify({ action: 'import_excel', data: { products: mappedProducts } }),
          headers: { 'Content-Type': 'application/json' }
        });

        const res = await resp.json();
        if (res.success) {
          setMessage(`¡Éxito! ${mappedProducts.length} productos importados.`);
          fetchData();
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        console.error('Error importing excel:', err);
        setMessage(`Error: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse font-medium">Cargando inventario...</div>;

  return (
    <div className="animate-fadeIn pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Productos</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Catálogo</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button
            onClick={saveProducts}
            className="px-5 py-2.5 bg-[#058c8c] text-white rounded text-sm font-bold hover:shadow-lg hover:bg-[#047a7a] transition flex items-center gap-2"
          >
            <FaSave /> Guardar Todo
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="admin-v2-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl">
             <FaBoxOpen />
          </div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Total Items</div>
             <div className="text-xl font-black text-gray-900">{Object.values(products).flat().length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5 border-l-4 border-l-red-500">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl">
             <FaExclamationTriangle />
          </div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Stock Crítico</div>
             <div className="text-xl font-black text-gray-900">{Object.values(products).flat().filter(p => p.stock <= 5).length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl">
             <FaTags />
          </div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Categorías</div>
             <div className="text-xl font-black text-gray-900">{Object.keys(products).length}</div>
          </div>
        </div>
      </div>

      {/* Tools Card */}
      <div className="admin-v2-card mb-10">
        <div className="p-6 border-b border-[#e1e3e5] bg-gray-50/50 flex justify-between items-center">
           <h3 className="font-bold text-gray-900 text-sm italic">Herramientas de Inventario</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
               <FaUpload />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Importación Masiva</h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">Sube tu archivo Excel para actualizar stock y precios.</p>
              <div className="inline-block relative">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button className="px-4 py-2 bg-white border border-[#e1e3e5] text-xs font-black rounded hover:bg-gray-50 transition uppercase tracking-widest">
                  Seleccionar Excel
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 shrink-0">
               <FaSearch />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Buscador Rápido</h4>
              <input
                type="text"
                placeholder="ID o nombre del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm transition focus:border-[#058c8c] focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-semibold flex items-center gap-3 animate-slideDown ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {message}
        </div>
      )}

      {/* Product Tables */}
      <div className="space-y-12">
        {products && Object.entries(products).map(([category, items]) => {
          const filteredItems = items.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0 && searchTerm) return null;

          return (
            <div key={category} className="admin-v2-card overflow-hidden">
              <div className="p-6 border-b border-[#e1e3e5] bg-gray-50/20 flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">{category}</h3>
                <span className="text-[10px] font-bold bg-[#edeeef] text-gray-600 px-3 py-1 rounded italic">{filteredItems.length} productos</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[9px] font-black uppercase tracking-widest border-b border-[#e1e3e5]">
                      <th className="px-6 py-4 w-16">ID</th>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4 w-40">Precio</th>
                      <th className="px-6 py-4 w-28">Stock</th>
                      <th className="px-6 py-4 w-28 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e3e5]">
                    {filteredItems.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/30 transition shadow-none hover:shadow-inner">
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold text-gray-300">#{p.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 bg-white rounded border border-[#e1e3e5] overflow-hidden p-1 cursor-pointer hover:border-[#058c8c] transition"
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveTab('general');
                              }}
                            >
                              <img src={p.image} alt="" className="w-full h-full object-contain" />
                            </div>
                            <span
                              className="font-bold text-gray-800 text-xs hover:text-[#058c8c] transition cursor-pointer"
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveTab('general');
                              }}
                            >
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400">$</span>
                            <input
                              type="number"
                              value={p.price}
                              onChange={(e) => handlePriceChange(category, p.id, Number(e.target.value))}
                              className="w-24 bg-transparent border-b border-transparent hover:border-[#e1e3e5] focus:border-[#058c8c] focus:outline-none text-sm font-black text-gray-900 transition-all px-1"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <input
                              type="number"
                              value={p.stock}
                              onChange={(e) => handleStockChange(category, p.id, Number(e.target.value))}
                              className={`w-16 bg-transparent border-b border-transparent hover:border-[#e1e3e5] focus:border-[#058c8c] focus:outline-none text-xs font-bold transition-all px-1 ${p.stock <= 5 ? 'text-red-500' : 'text-gray-900'}`}
                            />
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {p.stock > 0 ? 'Publicado' : 'Sin Stock'}
                           </span>
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

      {/* Product Editor Full-Screen Overlay */}
      {editingProduct && (
        <div className="fixed top-0 right-0 bottom-0 left-[250px] z-[100] bg-[#f8fafb] flex flex-col animate-fadeIn border-l border-[#e1e3e5] shadow-2xl">
          {(() => {
            const p = editingProduct;
            return (
              <>
                {/* Header */}
                <div className="bg-white border-b border-[#e1e3e5] px-8 py-4 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-400 font-bold"
                    >
                      <FaTimesCircle size={20} />
                    </button>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 leading-tight">{p.name || 'Nuevo Producto'}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded uppercase tracking-widest">{p.category}</span>
                        <span className="text-[9px] text-gray-300 font-bold">#{p.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="px-6 py-2 text-gray-500 hover:text-gray-900 h-10 font-bold text-xs uppercase tracking-widest transition"
                    >
                      Descartar
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="px-8 py-2 bg-[#058c8c] text-white rounded h-10 font-bold text-xs uppercase tracking-widest shadow-lg"
                    >
                      Listo
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  <aside className="w-64 bg-white border-r border-[#e1e3e5] flex flex-col p-6 gap-1 shrink-0">
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Navegación</h4>
                    {[
                      { id: 'general', label: 'Información', icon: <FaTags />, desc: 'Básicos y Precio' },
                      { id: 'media', label: 'Imágenes', icon: <FaBoxOpen />, desc: 'Galería visual' },
                      { id: 'specs', label: 'Ficha Técnica', icon: <FaCogs />, desc: 'Especificaciones' },
                      { id: 'seo', label: 'SEO', icon: <FaGlobe />, desc: 'Meta y Búsqueda' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-start gap-0.5 p-3 rounded transition-all text-left ${activeTab === tab.id ? 'bg-[#edeeef] text-[#058c8c]' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{tab.icon}</span>
                          <span className="text-xs font-bold leading-none">{tab.label}</span>
                        </div>
                        <span className="text-[10px] opacity-60 font-medium ml-7">{tab.desc}</span>
                      </button>
                    ))}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <div className="bg-gray-50 rounded p-4 border border-gray-100">
                        <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Cambios Locales</h5>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Recuerda guardar los cambios al final.</p>
                      </div>
                    </div>
                  </aside>

                  <main className="flex-1 overflow-y-auto bg-gray-50/30 p-12">
                    <div className="max-w-4xl mx-auto admin-v2-card bg-white p-10">
                      {activeTab === 'general' && (
                        <div className="space-y-8 animate-fadeIn">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Información General</h4>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="col-span-2">
                              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nombre</label>
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => handleProductChange(p.id, p.category, 'name', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold text-gray-900 focus:border-[#058c8c] focus:bg-white transition"
                              />
                            </div>
                            
                            <div className="col-span-2 bg-gray-50/50 p-6 border border-[#e1e3e5] rounded space-y-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={!!(p.discount && p.discount > 0)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const original = p.originalPrice || p.price;
                                      handleProductChange(p.id, p.category, 'originalPrice', original);
                                      handleProductChange(p.id, p.category, 'discount', 10);
                                      handleProductChange(p.id, p.category, 'price', original * 0.9);
                                    } else {
                                      handleProductChange(p.id, p.category, 'discount', 0);
                                      if (p.originalPrice) handleProductChange(p.id, p.category, 'price', p.originalPrice);
                                    }
                                  }}
                                  className="w-4 h-4 text-[#058c8c] rounded border-[#e1e3e5]"
                                />
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Aplica Descuento</span>
                              </label>

                              {!!(p.discount && p.discount > 0) && (
                                <div className="grid grid-cols-2 gap-6 pt-2 animate-fadeIn">
                                  <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Precio Original ($)</label>
                                    <input
                                      type="number"
                                      value={p.originalPrice ?? p.price}
                                      onChange={(e) => {
                                        const orig = Number(e.target.value);
                                        handleProductChange(p.id, p.category, 'originalPrice', orig);
                                        handleProductChange(p.id, p.category, 'price', orig * (1 - (p.discount || 0)/100));
                                      }}
                                      className="w-full px-4 py-2 bg-white border border-[#e1e3e5] rounded outline-none text-xs font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Descuento (%)</label>
                                    <input
                                      type="number"
                                      value={p.discount}
                                      onChange={(e) => {
                                        const disc = Number(e.target.value);
                                        handleProductChange(p.id, p.category, 'discount', disc);
                                        handleProductChange(p.id, p.category, 'price', (p.originalPrice || p.price) * (1 - disc/100));
                                      }}
                                      className="w-full px-4 py-2 bg-white border border-[#e1e3e5] rounded outline-none text-xs font-bold text-red-500"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Precio Final ($)</label>
                              <input
                                type="number"
                                value={p.price}
                                onChange={(e) => handleProductChange(p.id, p.category, 'price', Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-black text-[#058c8c]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Categoría</label>
                              <input
                                type="text"
                                value={p.category}
                                onChange={(e) => handleProductChange(p.id, p.category, 'category', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold text-gray-600"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Descripción</label>
                            <textarea
                              rows={5}
                              value={p.description || ''}
                              onChange={(e) => handleProductChange(p.id, p.category, 'description', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm text-gray-600 leading-relaxed"
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'media' && (
                        <div className="space-y-8 animate-fadeIn">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Galería de Imágenes</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[0, 1, 2, 3].map((index) => {
                              const currentImg = (p.images || [])[index] || '';
                              return (
                                <div key={index} className="space-y-3">
                                  <div className="aspect-square bg-gray-50 rounded border-2 border-dashed border-[#e1e3e5] overflow-hidden flex items-center justify-center relative group">
                                     {currentImg ? (
                                       <img src={currentImg} alt="" className="w-full h-full object-contain p-2" />
                                     ) : (
                                       <FaUpload className="text-gray-200" size={24} />
                                     )}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="URL"
                                    value={currentImg}
                                    onChange={(e) => {
                                      const newImgs = [...(p.images || [])];
                                      newImgs[index] = e.target.value;
                                      handleProductChange(p.id, p.category, 'images', newImgs.filter(Boolean));
                                    }}
                                    className="w-full text-[10px] px-2 py-1 bg-white border border-[#e1e3e5] rounded outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activeTab === 'specs' && (
                        <div className="space-y-8 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Especificaciones</h4>
                            <button
                              onClick={() => {
                                const newSpecs = [...(p.specifications || [])];
                                newSpecs.push({ label: '', value: '' });
                                handleProductChange(p.id, p.category, 'specifications', newSpecs);
                              }}
                              className="px-4 py-2 bg-gray-900 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm"
                            >
                              + Añadir
                            </button>
                          </div>
                          <div className="space-y-3">
                            {(p.specifications || []).map((spec, idx) => (
                              <div key={idx} className="flex gap-4 p-4 bg-gray-50 border border-[#e1e3e5] rounded">
                                <input
                                  type="text"
                                  placeholder="Etiqueta"
                                  value={spec.label}
                                  onChange={(e) => {
                                    const newSpecs = [...(p.specifications || [])];
                                    newSpecs[idx].label = e.target.value;
                                    handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                  }}
                                  className="w-1/3 px-3 py-2 bg-white border border-[#e1e3e5] rounded text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="Valor"
                                  value={spec.value}
                                  onChange={(e) => {
                                    const newSpecs = [...(p.specifications || [])];
                                    newSpecs[idx].value = e.target.value;
                                    handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                  }}
                                  className="flex-1 px-3 py-2 bg-white border border-[#e1e3e5] rounded text-xs"
                                />
                                <button
                                  onClick={() => {
                                    const newSpecs = (p.specifications || []).filter((_, i) => i !== idx);
                                    handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                  }}
                                  className="text-gray-300 hover:text-red-500 transition"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 'seo' && (
                        <div className="space-y-8 animate-fadeIn">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">SEO y Logística</h4>
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                               <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Peso (kg)</label>
                               <input
                                 type="text"
                                 value={p.properties?.weight || ''}
                                 onChange={(e) => handleProductChange(p.id, p.category, 'properties', { ...p.properties, weight: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold"
                               />
                            </div>
                            <div>
                               <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Dimensiones</label>
                               <input
                                 type="text"
                                 value={p.properties?.dimensions || ''}
                                 onChange={(e) => handleProductChange(p.id, p.category, 'properties', { ...p.properties, dimensions: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold"
                               />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </main>
                </div>
              </>
            );
          })()}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
