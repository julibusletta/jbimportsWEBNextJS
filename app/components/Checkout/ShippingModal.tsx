'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaUser, FaPhone, FaIdCard } from 'react-icons/fa';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  initialData: any;
}

export default function ShippingModal({ isOpen, onClose, onConfirm, initialData }: ShippingModalProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 flex items-center gap-3">
            <FaMapMarkerAlt className="text-blue-600" /> Datos de Entrega y Contacto
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors border-0 bg-transparent cursor-pointer">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            
            {/* Contacto */}
            <section>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                <FaUser /> Información Personal
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Nombre</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Apellido</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">D.N.I.</label>
                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="number" 
                      required 
                      placeholder="Sin puntos"
                      className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                      value={formData.dni || ''}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Domicilio */}
            <section>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt /> Domicilio de Entrega
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Calle</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Número</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Piso/Depto</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Localidad</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Provincia</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all appearance-none"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  >
                    <option value="CABA">Capital Federal</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Mendoza">Mendoza</option>
                    {/* Add more as needed */}
                  </select>
                </div>
              </div>
            </section>

            {/* Teléfono */}
            <section>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                <FaPhone /> Contacto Final
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-2">Teléfono / WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="11 1234 5678"
                    className="w-full p-4 bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white outline-none font-bold text-sm transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>
          </div>

          <button 
            type="submit" 
            className="w-full mt-10 p-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 border-0 cursor-pointer"
          >
            Confirmar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
