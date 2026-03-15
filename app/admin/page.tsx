'use client';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Product } from '@/lib/api/mockCategoryProducts';
import { Spec } from '@/lib/api/productSpecifications';

export default function AdminPage() {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [specifications, setSpecifications] = useState<Record<string, Spec[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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

  const saveProducts = async () => {
    setMessage('Guardando...');
    const resp = await fetch('/api/admin', {
      method: 'POST',
      body: JSON.stringify({ action: 'save_products', data: products }),
      headers: { 'Content-Type': 'application/json' }
    });
    const res = await resp.json();
    setMessage(res.message);
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Parsed Excel:', json);
      // Logic for merging/replacing data would go here
      setMessage('Excel leído. Implementá el mapeo según tu formato.');
    };
    reader.readAsArrayBuffer(file);
  };

  if (loading) return <div className="p-10 font-sans">Cargando Panel...</div>;

  if (error) return (
    <div className="p-10 font-sans text-red-600">
      <h1 className="text-2xl font-bold mb-4">Error al cargar el panel</h1>
      <p className="bg-red-50 p-4 border border-red-200 rounded-lg">{error}</p>
      <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Reintentar</button>
    </div>
  );

  return (
    <div className="p-10 font-sans bg-gray-50 min-h-screen text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Panel de Control JBimports</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Mantenimiento Rápido</h2>
        <div className="flex gap-4">
          <button 
            onClick={saveProducts}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md shadow-blue-100"
          >
            Guardar Cambios
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Importar desde Excel:</span>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleExcelImport}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
            />
          </div>
        </div>
        {message && <p className="mt-3 text-sm font-semibold text-green-600">{message}</p>}
      </div>

      <div className="space-y-10">
        {products && Object.entries(products).map(([category, items]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="bg-gray-100 px-6 py-3 text-lg font-bold uppercase tracking-wider text-gray-700">{category}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Producto</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 w-32">Precio ($)</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 w-32">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {items && items.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-gray-500">{p.id}</td>
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={p.price}
                          onChange={(e) => handlePriceChange(category, p.id, Number(e.target.value))}
                          className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="number" 
                          value={p.stock}
                          onChange={(e) => handleStockChange(category, p.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
