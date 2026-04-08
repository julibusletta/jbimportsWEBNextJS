'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Product } from '@/lib/api/productService';
import { Spec } from '@/lib/api/productSpecifications';
import Link from 'next/link';
import { FaUpload, FaSave, FaInfoCircle, FaSearch, FaTable, FaTimesCircle, FaTags, FaBoxOpen, FaCogs, FaGlobe, FaPlus, FaTrash, FaExclamationTriangle, FaPercentage } from 'react-icons/fa';
import { useCallback } from 'react';

const CATEGORIES = [
  'celulares', 'samsung', 'xiaomi', 'motorola', 'realme', 'iphone',
  'apple', 'macbook', 'watch', 'ipad', 'airpods',
  'jbl', 'parlantes', 'auriculares', 'sounds-bars',
  'smart-home', 'amazon', 'google', 'xiaomi-home', 'aspiradoras-robot', 'camaras-seguridad',
  'smart-watches', 'xiaomi-watches', 'notebooks', 'accesorios-starlink', 'general'
];

export default function ProductsPage() {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, Spec[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'specs' | 'seo'>('general');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'no-image' | 'no-description' | 'low-stock'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1500);

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
      setCategories(data.categories || []);
      setSpecifications(data.specifications || {});
      
      const settingsResp = await fetch('/api/admin/settings');
      const settingsData = await settingsResp.json();
      if (settingsData.success) {
        setExchangeRate(settingsData.settings.exchangeRate);
      }
      
      setLoading(false);
      setIsDataLoaded(true);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStockChange = (category: string, id: string, newValue: number) => {
    const updated = { ...products };
    if (updated[category]) {
      const p = updated[category].find(x => x.id === id);
      if (p) p.stock = newValue;
    }
    setProducts(updated);
  };

  const handlePriceChange = (category: string, id: string, newValue: number) => {
    const updated = { ...products };
    if (updated[category]) {
      const p = updated[category].find(x => x.id === id);
      if (p) p.price = newValue;
    }
    setProducts(updated);
  };

  const handleProductChange = <K extends keyof Product>(id: string, category: string, field: K, value: Product[K]) => {
    setProducts(prevProducts => {
      const updated = { ...prevProducts };
      if (!updated[category]) updated[category] = [];
      
      const exists = updated[category].some(p => p.id === id);
      if (exists) {
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
      } else {
        const newProduct: any = { 
          id, category, name: '', price: 0, image: '/images/placeholder.jpg', stock: 0, [field]: value 
        };
        updated[category].push(newProduct);
      }
      return updated;
    });

    setEditingProduct(prev => {
      if (prev?.id === id) {
        const newP = { ...prev, [field]: value };
        if (field === 'costPrice') {
          const cost = Number(value);
          const categoryData = categories.find(c => c.slug === category);
          if (categoryData && cost > 0) {
            const markupPercent = categoryData.markupPercent || 0;
            const markupFixed = categoryData.markupFixed;
            const margin = 1 + (markupPercent / 100);
            let finalPrice = 0;
            
            if (cost >= 500) {
              finalPrice = (cost * 1.10) * exchangeRate * margin;
            } else {
              let fixedAdj = 0;
              if (markupFixed) {
                const cleanFixed = markupFixed.toUpperCase();
                const usdMatch = cleanFixed.match(/\$(\d+)\s*USD/i);
                const arsMatch = cleanFixed.match(/\$(\d+)(K)?\s*ARS/i);
                if (arsMatch) {
                  fixedAdj = parseFloat(arsMatch[1]);
                  if (arsMatch[2]) fixedAdj *= 1000;
                  finalPrice = (cost * exchangeRate + fixedAdj) * margin;
                } else if (usdMatch) {
                  fixedAdj = parseFloat(usdMatch[1]);
                  finalPrice = ((cost + fixedAdj) * exchangeRate) * margin;
                } else {
                  finalPrice = (cost * exchangeRate) * margin;
                }
              } else {
                finalPrice = (cost * exchangeRate) * margin;
              }
            }
            finalPrice = finalPrice > 100000 ? Math.round(finalPrice / 100) * 100 : Math.round(finalPrice / 10) * 10;
            newP.price = finalPrice;
            setTimeout(() => {
               setProducts(prevProducts => {
                 const updated = { ...prevProducts };
                 if (updated[category]) {
                   updated[category] = updated[category].map(item => item.id === id ? { ...item, price: finalPrice } : item);
                 }
                 return updated;
               });
            }, 0);
          }
        }
        return newP;
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
      const resp = await fetch('/api/admin/upload', { method: 'POST', body: formData });
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
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return;
    setDeletingId(productId);
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_product', data: { productId } }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage('Producto eliminado con éxito');
        setEditingProduct(null);
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err) {
      alert('Error de conexión al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNewProduct = useCallback((categoryOverride?: string) => {
    const newId = `prod_${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: '',
      price: 0,
      costPrice: 0,
      image: '/images/placeholder.jpg',
      images: ['/images/placeholder.jpg'],
      category: categoryOverride || 'general',
      stock: 0,
      description: '',
      published: true
    };
    const cat = categoryOverride || 'general';
    setProducts(prev => ({
      ...prev,
      [cat]: [...(prev[cat] || []), newProduct]
    }));
    setEditingProduct(newProduct);
    setActiveTab('general');
    setMessage('Nuevo producto inicializado. Completa los datos y guarda.');
    setTimeout(() => setMessage(''), 3000);
  }, []);

  const toggleSelectProduct = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAllInCategory = (categoryItems: Product[]) => {
    const allIds = categoryItems.map(p => p.id);
    const allSelected = allIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${selectedIds.length} productos permanentemente?`)) return;
    setIsSaving(true);
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'bulk_delete', data: { productIds: selectedIds } }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage(`${selectedIds.length} productos eliminados con éxito`);
        setSelectedIds([]);
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err) {
      alert('Error de conexión al eliminar');
    } finally {
      setIsSaving(false);
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
        const resolveCategory = (raw: string, productName: string = ''): string => {
          const s = raw.toLowerCase();
          const p = productName.toLowerCase();
          if (s.includes('iphone')) return 'iphone';
          if (s.includes('celular')) return 'celulares';
          if (s.includes('parlante')) return 'parlantes';
          if (s.includes('auricular')) return 'auriculares';
          if (s.includes('macbook')) return 'macbook';
          if (s.includes('watch')) return 'watch';
          if (s.includes('notebook')) return 'notebooks';
          if (p.includes('jbl')) {
            if (['boombox', 'charge', 'flip', 'go', 'clip', 'xtreme', 'party box'].some(k => p.includes(k))) return 'parlantes';
            if (['fone', 'tune', 'sense', 'live', 'quantum', 'reflect', 'wave', 'buds'].some(k => p.includes(k))) return 'auriculares';
          }
          if (p.includes('samsung')) return 'samsung';
          if (p.includes('motorola')) return 'motorola';
          if (p.includes('xiaomi')) {
            if (p.includes('vacuum') || p.includes('robot')) return 'aspiradoras-robot';
            return 'xiaomi';
          }
          return s.split(',')[0].trim() || 'general';
        };

        const mappedProducts = json.map((row: any) => {
          const rawId = getVal(row, 'ID', 'id', 'codigo');
          const rawName = getVal(row, 'Nombre', 'name', 'producto');
          if (!rawId || !rawName) return null;
          const priceOriginal = Number(getVal(row, 'Precio', 'price') || 0);
          const priceDiscount = getVal(row, 'Descuento', 'oferta');
          const finalPrice = priceDiscount ? Number(priceDiscount) : priceOriginal;
          const imagesRaw = String(getVal(row, 'Imágenes', 'imagen', 'image') || '');
          const allImages = imagesRaw.split(/[,\s+]/).map(s => s.trim()).filter(Boolean).slice(0, 8);
          const firstImage = allImages[0] || '/images/placeholder.jpg';
          const rawCategory = String(getVal(row, 'Categoría', 'category') || 'general');
          return {
            id: String(rawId).trim(),
            name: String(rawName).trim(),
            price: finalPrice,
            image: firstImage,
            images: allImages,
            category: resolveCategory(rawCategory, rawName),
            description: String(getVal(row, 'Descripción', 'description') || ''),
            stock: Number(getVal(row, 'Cantidad', 'stock') || 0)
          };
        }).filter(Boolean);

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
        setMessage(`Error: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <ProductsContent 
        {...{
          products, setProducts, categories, setCategories, specifications, setSpecifications,
          loading, setLoading, isDataLoaded, setIsDataLoaded, error, setError, message, setMessage,
          searchTerm, setSearchTerm, editingProduct, setEditingProduct, activeTab, setActiveTab,
          uploadingIndex, setUploadingIndex, isSaving, setIsSaving, filterType, setFilterType,
          deletingId, setDeletingId, selectedIds, setSelectedIds, exchangeRate, setExchangeRate,
          fetchData, handleStockChange, handlePriceChange, handleProductChange, handleFileUpload,
          saveProducts, handleDeleteProduct, handleAddNewProduct, toggleSelectProduct,
          toggleSelectAllInCategory, handleBulkDelete, handleExcelImport
        }} 
      />
    </Suspense>
  );
}

function ProductsContent({
  products, loading, isDataLoaded, message, searchTerm, setSearchTerm, editingProduct,
  setEditingProduct, activeTab, setActiveTab, uploadingIndex, isSaving, filterType,
  setFilterType, deletingId, selectedIds, setSelectedIds, exchangeRate, fetchData, handleStockChange,
  handlePriceChange, handleProductChange, handleFileUpload, saveProducts, handleDeleteProduct,
  handleAddNewProduct, toggleSelectProduct, toggleSelectAllInCategory, handleBulkDelete,
  handleExcelImport, setProducts
}: any) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isDataLoaded && searchParams.get('new') === 'true') {
      const category = searchParams.get('category') || undefined;
      handleAddNewProduct(category);
      router.replace('/admin/products');
    }
  }, [isDataLoaded, searchParams, handleAddNewProduct, router]);

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-gray-500 animate-pulse font-medium">Cargando inventario...</div>;

  const allFlatProducts = products ? (Object.values(products).flat().filter(Boolean) as Product[]) : [];

  return (
    <div className="animate-fadeIn pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Productos</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span className="opacity-30">/</span>
            <span className="text-gray-900">Catálogo</span>
          </nav>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => handleAddNewProduct()}
            className="flex-1 sm:flex-none px-10 py-5 bg-[#058c8c] text-white rounded-2xl shadow-2xl shadow-[#058c8c]/30 hover:bg-[#047a7a] hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] animate-pulse-subtle z-50 border-4 border-white"
          >
            <FaPlus size={16} /> NUEVO PRODUCTO
          </button>
          <button
            onClick={saveProducts}
            className="flex-1 sm:flex-none px-8 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
          >
            <FaSave /> Guardar Cambios Globales
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="admin-v2-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl"><FaBoxOpen /></div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Total Items</div>
             <div className="text-xl font-black text-gray-900">{allFlatProducts.length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5 border-l-4 border-l-red-500">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl"><FaExclamationTriangle /></div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Stock Crítico</div>
             <div className="text-xl font-black text-gray-900">{allFlatProducts.filter((p: any) => p.stock <= 5).length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5 border-l-4 border-l-orange-400">
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-xl"><FaTable /></div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Faltantes</div>
             <div className="text-xl font-black text-gray-900">
               {allFlatProducts.filter((p: any) => !p.image || p.image.includes('placeholder') || p.image.includes('default')).length}
             </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'no-image', 'no-description', 'low-stock'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterType === tab ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
          >
            {tab === 'all' ? 'Todos' : tab === 'no-image' ? 'Sin Foto' : tab === 'no-description' ? 'Sin Desc.' : 'Stock Bajo'}
          </button>
        ))}
      </div>

      <div className="admin-v2-card mb-10 overflow-hidden">
        <div className="p-6 bg-gray-50/50 flex flex-wrap gap-10 items-center justify-between">
          <div className="flex gap-6 items-center flex-1">
             <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-gray-400"><FaSearch /></div>
             <input
               type="text"
               placeholder="Buscar por ID o nombre..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 w-full"
             />
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4 border-r border-gray-200">Importar Excel</span>
             <input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} className="text-xs text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-slideDown ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {message}
        </div>
      )}

      <div className="space-y-12">
        {products && Object.entries(products).map(([category, items]: [any, any]) => {
          const filteredItems = items.filter((p: Product) => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;
            if (filterType === 'no-image') return !p.image || p.image.includes('placeholder');
            if (filterType === 'low-stock') return p.stock <= 5;
            return true;
          });
          if (filteredItems.length === 0 && searchTerm) return null;

          return (
            <div key={category} className="admin-v2-card overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/20 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{category}</h3>
                <input 
                  type="checkbox" 
                  checked={filteredItems.length > 0 && filteredItems.every((p: any) => selectedIds.includes(p.id))}
                  onChange={() => toggleSelectAllInCategory(filteredItems)}
                  className="w-4 h-4 rounded border-gray-200"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50">
                    {filteredItems.map((p: Product) => (
                      <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(p.id) ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4 w-12"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelectProduct(p.id)} /></td>
                        <td className="px-6 py-4 w-16 text-[10px] font-bold text-gray-300">#{p.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setEditingProduct(p)}>
                            <div className="w-10 h-10 bg-white rounded border border-gray-100 overflow-hidden group-hover:border-[#058c8c] transition-colors">
                              <img src={p.image} className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-gray-900 text-xs group-hover:text-[#058c8c] transition-colors">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 w-40">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400">$</span>
                             <input type="number" value={p.price} onChange={(e) => handlePriceChange(category, p.id, Number(e.target.value))} className="w-24 bg-transparent border-b border-transparent hover:border-gray-100 focus:border-[#058c8c] outline-none text-xs font-black" />
                          </div>
                        </td>
                        <td className="px-6 py-4 w-28 text-center">
                           <input type="number" value={p.stock} onChange={(e) => handleStockChange(category, p.id, Number(e.target.value))} className={`w-12 bg-transparent text-center font-bold text-xs ${p.stock <= 5 ? 'text-red-500' : 'text-gray-900'}`} />
                        </td>
                        <td className="px-6 py-4 w-16 text-right">
                           <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-200 hover:text-red-500 transition-colors"><FaTrash size={12} /></button>
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

      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 flex flex-col backdrop-blur-sm animate-fadeIn">
          {(() => {
            const p = editingProduct;
            return (
              <div className="absolute top-0 right-0 bottom-0 left-[250px] bg-white flex flex-col shadow-2xl">
                <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setEditingProduct(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"><FaTimesCircle size={20} className="text-gray-300" /></button>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{p.name || 'Nuevo Producto'}</h3>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">#{p.id}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Listo</button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  <aside className="w-60 border-r border-gray-50 flex flex-col p-6 gap-2 bg-gray-50/30">
                    {(['general', 'media', 'specs', 'seo'] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#058c8c]' : 'text-gray-400 hover:text-gray-600'}`}>{tab}</button>
                    ))}
                  </aside>
                  <main className="flex-1 overflow-y-auto p-12 bg-gray-50/20">
                    <div className="max-w-3xl mx-auto admin-v2-card p-10">
                      {activeTab === 'general' && (
                        <div className="space-y-8">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nombre</label>
                             <input type="text" value={p.name} onChange={(e) => handleProductChange(p.id, p.category, 'name', e.target.value)} className="w-full p-4 bg-gray-50 border border-transparent focus:border-[#058c8c] focus:bg-white rounded-xl outline-none font-bold text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Categoría</label>
                               <select value={p.category} onChange={(e) => handleProductChange(p.id, p.category, 'category', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-xs uppercase appearance-none">
                                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</label>
                               <input type="number" value={p.stock} onChange={(e) => handleProductChange(p.id, p.category, 'stock', Number(e.target.value))} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-sm" />
                            </div>
                          </div>
                          <div className="p-8 bg-[#058c8c]/5 rounded-2xl border border-[#058c8c]/10 space-y-6">
                             <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <div>
                                   <label className="text-[9px] font-black text-[#058c8c] uppercase tracking-widest block mb-1">Costo (USD)</label>
                                   <input type="number" value={p.costPrice || 0} onChange={(e) => handleProductChange(p.id, p.category, 'costPrice', Number(e.target.value))} className="bg-transparent text-xl font-black text-gray-900 outline-none w-32 border-b-2 border-transparent focus:border-[#058c8c] transition-all" />
                                </div>
                                <div className="text-right">
                                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Precio Final (ARS)</label>
                                   <div className="text-2xl font-black text-[#058c8c]">$ {p.price?.toLocaleString()}</div>
                                </div>
                             </div>
                          </div>
                        </div>
                      )}
                      {activeTab === 'media' && (
                        <div className="grid grid-cols-4 gap-6">
                          {Array.from({ length: 8 }).map((_: any, idx: number) => {
                            const img = p.images?.[idx];
                            return (
                              <div key={idx} className="aspect-square bg-white rounded-2xl border-2 border-dashed border-gray-200 relative group flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#058c8c]/50 transition-all shadow-sm">
                                {img ? <img src={img} className="w-full h-full object-contain p-2" /> : <div className="flex flex-col items-center gap-2 text-gray-300 font-black text-[8px] uppercase tracking-tighter"><FaPlus /> Subir</div>}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, idx)} />
                                {uploadingIndex === idx && (
                                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-[#058c8c] border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {activeTab === 'specs' && (
                        <div className="space-y-6">
                           <button onClick={() => handleProductChange(p.id, p.category, 'specifications', [...(p.specifications || []), { label: '', value: '' }])} className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl text-[10px] font-black text-gray-400 hover:text-[#058c8c] hover:border-[#058c8c]/30 transition-all uppercase tracking-widest">+ Añadir Ficha Técnica</button>
                           {(p.specifications || []).map((s: any, idx: number) => (
                             <div key={idx} className="flex gap-4 items-center animate-fadeIn">
                               <input type="text" value={s.label} onChange={(e) => {
                                 const nx = [...(p.specifications || [])];
                                 nx[idx].label = e.target.value;
                                 handleProductChange(p.id, p.category, 'specifications', nx);
                               }} className="w-1/3 p-3 bg-gray-50 rounded-lg outline-none text-[10px] font-black uppercase" placeholder="Etiqueta" />
                               <input type="text" value={s.value} onChange={(e) => {
                                 const nx = [...(p.specifications || [])];
                                 nx[idx].value = e.target.value;
                                 handleProductChange(p.id, p.category, 'specifications', nx);
                               }} className="flex-1 p-3 bg-gray-50 rounded-lg outline-none text-xs font-bold" placeholder="Valor" />
                               <button onClick={() => handleProductChange(p.id, p.category, 'specifications', (p.specifications || []).filter((_: any, i: number) => i !== idx))} className="text-gray-200 hover:text-red-500 transition-colors"><FaTrash size={12} /></button>
                             </div>
                           ))}
                        </div>
                      )}
                      {activeTab === 'seo' && (
                        <div className="space-y-4">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pr-4">Descripción General</label>
                           <textarea value={p.description || ''} onChange={(e) => handleProductChange(p.id, p.category, 'description', e.target.value)} rows={10} className="w-full p-6 bg-gray-50 rounded-2xl outline-none font-medium text-sm leading-relaxed" />
                        </div>
                      )}
                    </div>
                  </main>
                </div>
                
                <div className="bg-white border-t border-gray-100 p-8 flex justify-between items-center sm:px-12">
                   <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${p.published !== false ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.published !== false ? 'Producto Publicado' : 'Borrador'}</span>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setEditingProduct(null)} className="px-8 py-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Cerrar</button>
                      <button onClick={() => {
                        const updated = { ...products };
                        if (updated[p.category]) {
                          updated[p.category] = updated[p.category].map((item: any) => item.id === p.id ? p : item);
                        }
                        setProducts(updated);
                        setEditingProduct(null);
                      }} className="px-10 py-3 bg-[#058c8c] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#058c8c]/20">Guardar Cambios Locales</button>
                   </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-10 py-5 rounded-full shadow-2xl flex items-center gap-10 animate-slideUp">
           <div className="flex items-center gap-4 border-r border-gray-700 pr-10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Seleccionados</span>
              <span className="text-xl font-black">{selectedIds.length}</span>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={() => setSelectedIds([])} className="text-[10px] font-black uppercase tracking-widest hover:text-gray-400 transition-colors">Cancelar</button>
              <button onClick={handleBulkDelete} disabled={isSaving} className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-red-500/20">
                <FaTrash size={12} /> Eliminar Masivamente
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
