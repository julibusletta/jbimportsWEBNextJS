'use client';

import React from 'react';
import { FaCog, FaLock, FaUser, FaBell, FaGlobe } from 'react-icons/fa';

export default function SettingsPage() {
  const settingsGroups = [
    { title: 'Perfil', icon: <FaUser />, desc: 'Administra tus datos de acceso.' },
    { title: 'Seguridad', icon: <FaLock />, desc: 'Cambia tu contraseña y autenticación.' },
    { title: 'Notificaciones', icon: <FaBell />, desc: 'Configura avisos de nuevos pedidos.' },
    { title: 'Tienda', icon: <FaGlobe />, desc: 'Información pública y SEO.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">Ajusta las preferencias de tu panel y cuenta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsGroups.map((group, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                {group.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{group.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{group.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
         <h4 className="text-sm font-bold text-amber-800 mb-2">Nota de Desarrollo</h4>
         <p className="text-sm text-amber-700">
           Esta sección se habilitará completamente una vez que hayamos consolidado la migración de todos los servicios desde el hosting actual.
         </p>
      </div>
    </div>
  );
}
