'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Product as BaseProduct } from '@/lib/api/mockCategoryProducts';
import { Spec } from '@/lib/api/productSpecifications';
import { FaUpload, FaSave, FaInfoCircle, FaSearch, FaTable, FaThList, FaTimesCircle, FaTags, FaBoxOpen, FaCogs, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa';

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
    const updated = { ...products };
    const p = updated[category]?.find(x => x.id === id);
    if (p) {
      p[field] = value;
      if (field === 'images' && Array.isArray(value)) {
        p.image = (value[0] as string) || '/images/placeholder.jpg';
      }
    }
    setProducts(updated);
    if (editingProduct?.id === id) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
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
          const originalPrice = priceDiscount ? priceOriginal : undefined;
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
            images: allImages, // Store all detected images (up to 4)
            category: resolveCategory(rawCategory),
            description: String(getVal(row, 'Descripción', 'description', 'descripcion', 'detalle') || ''),
            stock: Number(getVal(row, 'Cantidad', 'stock', 'stock', 'cantidad') || 0),
            badge: String(getVal(row, 'Badge', 'badge', 'etiqueta', 'promo', 'tipo') || ''),
            weight: Number(getVal(row, 'Peso (gr)', 'pesogr', 'peso') || 0),
            length: Number(getVal(row, 'Largo (cm)', 'largocm', 'largo') || 0),
            width: Number(getVal(row, 'Ancho (cm)', 'anchocm', 'ancho') || 0),
            height: Number(getVal(row, 'Alto (cm)', 'altocm', 'alto') || 0),
            attributes: [
              {
                name: String(getVal(row, 'Nombre Atributo1 (No editable)', 'nombreatributo1noeditable', 'nombreatributo1') || ''),
                value: String(getVal(row, 'Valor Atributo1 (No editable)', 'valoratributo1noeditable', 'valoratributo1') || '')
              }
            ].filter(attr => attr.name && attr.value),
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Productos</h1>
          <p className="text-sm text-slate-500 mt-1">Administra el stock, precios e importa nuevos items masivamente.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveProducts}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm font-semibold text-sm"
          >
            <FaSave /> Guardar Cambios
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl shrink-0">
            <FaUpload />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-slate-800">Importar desde Excel</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Soportamos formatos de Tienda Nube y personalizados. Asegúrate de incluir las columnas ID y Nombre.
            </p>
            <div className="inline-block relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition border border-slate-200">
                Seleccionar Archivo
              </div>
            </div>
          </div>
          <div className="hidden xl:block w-px h-12 bg-slate-100"></div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 max-w-[200px]">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-[10px] uppercase tracking-wider mb-1">
              <FaInfoCircle /> Tips
            </div>
            <p className="text-[10px] text-amber-700 leading-tight italic">
              Usa el mismo ID para actualizar stock/precio de productos existentes.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold whitespace-nowrap">Todos</span>
            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-slate-100 cursor-pointer">En Stock</span>
            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-slate-100 cursor-pointer">Sin Stock</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm font-semibold flex items-center gap-3 animate-slideDown">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          {error}
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 animate-slideDown ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {message}
        </div>
      )}

      {/* Product Tables */}
      <div className="space-y-8 pb-20">
        {products && Object.entries(products).map(([category, items]) => {
          const filteredItems = items.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredItems.length === 0 && searchTerm) return null;

          return (
            <div key={category} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600">{category}</h3>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{filteredItems.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">ID</th>
                      <th className="px-6 py-4 font-semibold">Producto</th>
                      <th className="px-6 py-4 font-semibold w-36 text-center">Precio ($)</th>
                      <th className="px-6 py-4 font-semibold w-32 text-center">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-slate-400">#{p.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all relative group"
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveTab('general');
                              }}
                            >
                              <img src={p.image} alt="" className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-white font-bold tracking-tight text-center px-1">EDITAR</span>
                              </div>
                            </div>
                            <span
                              className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition-colors cursor-pointer"
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveTab('general');
                              }}
                            >
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            value={p.price}
                            onChange={(e) => handlePriceChange(category, p.id, Number(e.target.value))}
                            className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-slate-700 text-center shadow-inner"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleStockChange(category, p.id, Number(e.target.value))}
                            className={`w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-center shadow-inner ${p.stock <= 5 ? 'text-red-600' : 'text-slate-700'}`}
                          />
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
        <div className="fixed top-0 right-0 bottom-0 left-64 z-40 bg-slate-50 flex flex-col animate-slideInRight border-l border-slate-200 shadow-2xl">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                title="Descartar cambios"
              >
                <FaTimesCircle size={24} />
              </button>
              <div>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{editingProduct.name || 'Nuevo Producto'}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider">{editingProduct.category}</span>
                  <span className="text-[10px] text-slate-400 font-medium">#{editingProduct.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition-all"
              >
                CANCELAR
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                LISTO
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 gap-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Configuración</h4>
              {[
                { id: 'general', label: 'Información Básica', icon: FaTags, desc: 'Nombre, precio y categoría' },
                { id: 'media', label: 'Imágenes y Galería', icon: FaBoxOpen, desc: 'Gestiona las fotos del producto' },
                { id: 'specs', label: 'Ficha Técnica', icon: FaCogs, desc: 'Atributos y características' },
                { id: 'seo', label: 'SEO y Propiedades', icon: FaGlobe, desc: 'Posicionamiento y logística' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all text-left group ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                >
                  <div className={`mt-0.5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    <tab.icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{tab.label}</div>
                    <div className="text-[11px] opacity-70 font-medium mt-0.5">{tab.desc}</div>
                  </div>
                </button>
              ))}

              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resumen de cambios</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Recuerda presionar "Guardar" en el panel principal para confirmar tus ediciones en la base de datos de MongoDB.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50/30 p-12">
              <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
                {activeTab === 'general' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FaTags size={14} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">Información General</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Nombre del Producto</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'name', e.target.value)}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-base font-semibold text-slate-700"
                          placeholder="Ej: iPhone 15 Pro Max"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Precio de Venta ($)</label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'price', Number(e.target.value))}
                            className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-base font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Categoría</label>
                        <input
                          type="text"
                          value={editingProduct.category}
                          onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'category', e.target.value)}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-base font-semibold text-slate-700"
                          placeholder="iphone, apple-watch, etc."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Descripción Detallada</label>
                      <textarea
                        rows={6}
                        value={editingProduct.description || ''}
                        onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'description', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-base text-slate-600 leading-relaxed"
                        placeholder="Describe las virtudes del producto para tus clientes..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FaBoxOpen size={14} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">Galería de Imágenes</h4>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[0, 1, 2, 3].map((index) => {
                        const currentImg = (editingProduct.images || [])[index] || '';
                        return (
                          <div key={index} className="space-y-4">
                            <div className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center relative group transition-all hover:border-blue-300">
                              {uploadingIndex === index ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-[10px] font-bold text-blue-600">SUBIENDO</span>
                                </div>
                              ) : currentImg ? (
                                <>
                                  <img src={currentImg} alt="" className="w-full h-full object-contain p-2" />
                                  <button
                                    onClick={() => {
                                      const newImages = [...(editingProduct.images || [])];
                                      newImages.splice(index, 1);
                                      handleProductChange(editingProduct.id, editingProduct.category, 'images', newImages);
                                    }}
                                    className="absolute top-3 right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10"
                                  >
                                    <FaTimesCircle size={16} />
                                  </button>
                                </>
                              ) : (
                                <div className="text-slate-300 flex flex-col items-center gap-2">
                                  <FaUpload size={24} />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Añadir</span>
                                </div>
                              )}
                              {index === 0 && currentImg && !uploadingIndex && (
                                <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase z-10 tracking-widest">Principal</span>
                              )}
                            </div>
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="URL externa"
                                value={currentImg}
                                onChange={(e) => {
                                  const newImages = [...(editingProduct.images || [])];
                                  newImages[index] = e.target.value;
                                  handleProductChange(editingProduct.id, editingProduct.category, 'images', newImages.filter(Boolean));
                                }}
                                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium truncate"
                              />
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, index)}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <button className="w-full py-2 bg-white text-blue-600 text-[10px] font-bold rounded-lg transition-all border border-blue-100 hover:bg-blue-50 shadow-sm uppercase tracking-widest">
                                  Subir Foto
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FaCogs size={14} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">Ficha Técnica</h4>
                      </div>
                      <button
                        onClick={() => {
                          const newSpecs = [...(editingProduct.specifications || [])];
                          newSpecs.push({ label: '', value: '' });
                          handleProductChange(editingProduct.id, editingProduct.category, 'specifications', newSpecs);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                      >
                        <FaPlus size={10} /> Añadir Atributo
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(editingProduct.specifications || []).length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 bg-slate-50/50">
                          <FaCogs size={48} className="mb-4 opacity-10" />
                          <span className="text-sm font-bold tracking-widest uppercase opacity-40">No hay detalles técnicos</span>
                        </div>
                      )}
                      {(editingProduct.specifications || []).map((spec, idx) => (
                        <div key={idx} className="flex gap-4 animate-fadeIn p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-sm">
                          <div className="w-1/3">
                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 px-1">Atributo</label>
                            <input
                              type="text"
                              placeholder="Ej: Memoria RAM"
                              value={spec.label}
                              onChange={(e) => {
                                const newSpecs = [...(editingProduct.specifications || [])];
                                newSpecs[idx].label = e.target.value;
                                handleProductChange(editingProduct.id, editingProduct.category, 'specifications', newSpecs);
                              }}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs font-bold text-slate-700"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 px-1">Valor</label>
                            <input
                              type="text"
                              placeholder="Ej: 8GB LPDDR5X"
                              value={spec.value}
                              onChange={(e) => {
                                const newSpecs = [...(editingProduct.specifications || [])];
                                newSpecs[idx].value = e.target.value;
                                handleProductChange(editingProduct.id, editingProduct.category, 'specifications', newSpecs);
                              }}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs text-slate-600 font-medium"
                            />
                          </div>
                          <div className="flex items-end mb-0.5">
                            <button
                              onClick={() => {
                                const newSpecs = (editingProduct.specifications || []).filter((_, i) => i !== idx);
                                handleProductChange(editingProduct.id, editingProduct.category, 'specifications', newSpecs);
                              }}
                              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-10 animate-fadeIn">
                    {/* Physical Properties */}
                    <div>
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FaBoxOpen size={14} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">Dimensiones y Logística</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Peso (kg)</label>
                          <input
                            type="text"
                            value={editingProduct.properties?.weight || ''}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'properties', { ...editingProduct.properties, weight: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-base font-semibold text-slate-700"
                            placeholder="Ej: 0.187kg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Dimensiones</label>
                          <input
                            type="text"
                            value={editingProduct.properties?.dimensions || ''}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'properties', { ...editingProduct.properties, dimensions: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-base font-semibold text-slate-700"
                            placeholder="Ej: 146.6 x 70.6 mm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Color Principal</label>
                          <input
                            type="text"
                            value={editingProduct.properties?.color || ''}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'properties', { ...editingProduct.properties, color: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-base font-semibold text-slate-700"
                            placeholder="Ej: Titanio Natural"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SEO Config */}
                    <div>
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FaGlobe size={14} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">Posicionamiento SEO</h4>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center justify-between">
                            Meta Title
                            <span className="text-[9px] lowercase font-normal opacity-60">Sugerido: 50-60 caracteres</span>
                          </label>
                          <input
                            type="text"
                            value={editingProduct.seo?.title || ''}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'seo', { ...editingProduct.seo, title: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-base font-semibold text-slate-700"
                            placeholder="Título optimizado para Google..."
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center justify-between">
                            Meta Description
                            <span className="text-[9px] lowercase font-normal opacity-60">Sugerido: 150-160 caracteres</span>
                          </label>
                          <textarea
                            rows={4}
                            value={editingProduct.seo?.description || ''}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'seo', { ...editingProduct.seo, description: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-base text-slate-600 leading-relaxed"
                            placeholder="Descripción corta que atraerá clics en resultados de búsqueda..."
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Palabras Clave (Keywords)</label>
                          <input
                            type="text"
                            value={editingProduct.seo?.keywords || ''}
                            onChange={(e) => handleProductChange(editingProduct.id, editingProduct.category, 'seo', { ...editingProduct.seo, keywords: e.target.value })}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-base font-semibold text-slate-700"
                            placeholder="Ej: iphone, tecnología, apple, premium..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Actions Footer Area */}
              <div className="max-w-4xl mx-auto mt-12 flex items-center justify-between px-4 pb-12">
                <div className="flex items-center gap-3 text-slate-400 italic text-sm">
                  <FaInfoCircle size={14} />
                  <span>Los cambios se consolidan al presionar el botón azul arriba.</span>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-all text-sm group"
                >
                  Descartar cambios actuales
                  <FaTimesCircle className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </main>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

