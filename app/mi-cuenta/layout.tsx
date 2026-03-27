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
            <div className="sticky top-[100px] bg-white rounded-none shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-2 border-slate-900 overflow-hidden">
              {/* Profile Brief */}
              <div className="p-8 bg-slate-900 flex items-center gap-5 border-b-4 border-blue-600">
                <div className="w-14 h-14 bg-slate-800 rounded-none flex items-center justify-center text-white text-xl font-black border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                  {firstInitial}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-black text-base m-0 tracking-tight uppercase">Hola {userName.split(' ')[0]}</h3>
                  <p className="text-slate-400 text-[12px] m-0 truncate font-bold uppercase tracking-widest opacity-60 italic">{userEmail}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-4 px-6 py-4.5 rounded-none text-[15px] font-bold transition-all duration-300 border-2 ${
                        isActive 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10' 
                          : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`text-xl ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>{item.icon}</span>
                      <span className="tracking-tight">{item.label}</span>
                    </Link>
                  );
                })}
                
                <div className="mt-8 pt-4 border-t-2 border-slate-50">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-4 px-6 py-4.5 rounded-none text-[15px] font-bold text-red-500 hover:bg-red-50 transition-all duration-300 bg-transparent border-2 border-transparent cursor-pointer text-left"
                  >
                    <FaSignOutAlt className="text-xl" />
                    Cerrar Sesión
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-slate-100 p-8 sm:p-10 min-h-[600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
