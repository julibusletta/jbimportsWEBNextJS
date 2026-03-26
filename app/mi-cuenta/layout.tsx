'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FaUser, FaShoppingBag, FaFileAlt, FaMapMarkerAlt, FaTruck, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { label: 'Mi perfil', href: '/mi-cuenta', icon: <FaUser /> },
    { label: 'Mis Compras', href: '/mi-cuenta/compras', icon: <FaShoppingBag /> },
    { label: 'Facturas', href: '/mi-cuenta/facturas', icon: <FaFileAlt /> },
    { label: 'Direcciones', href: '/mi-cuenta/direcciones', icon: <FaMapMarkerAlt /> },
    { label: 'Seguimiento', href: '/mi-cuenta/seguimiento', icon: <FaTruck /> },
    { label: 'Ayuda', href: '/mi-cuenta/ayuda', icon: <FaQuestionCircle /> },
  ];

  const userName = session?.user?.name || 'Usuario';
  const userEmail = session?.user?.email || '';
  const firstInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center selection:bg-slate-200">
      {/* Minimal Spacer for Global Header Clearance */}
      <div className="h-4 w-full flex-shrink-0" />

      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 flex-1 relative">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-[100px] bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-200 overflow-hidden">
              {/* Profile Brief */}
              <div className="p-6 bg-slate-900 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white text-lg font-bold border border-slate-600 shadow-sm">
                  {firstInitial}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-sm m-0 truncate">Hola {userName.split(' ')[0]}</h3>
                  <p className="text-slate-400 text-[11px] m-0 truncate font-medium">{userEmail}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'bg-slate-100 text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`text-lg ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="mt-4 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 bg-transparent border-0 cursor-pointer text-left"
                  >
                    <FaSignOutAlt className="text-lg" />
                    Cerrar Sesión
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 p-8 sm:p-10 min-h-[600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
