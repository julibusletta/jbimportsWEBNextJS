'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FaUser, FaShoppingBag, FaFileAlt, FaMapMarkerAlt, FaTruck, FaQuestionCircle, FaSignOutAlt, FaChevronRight } from 'react-icons/fa';

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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center pt-32 pb-20">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-[140px] bg-white border border-[#f1f5f9] shadow-sm">
              
              {/* Profile Brief - Modern & Sober */}
              <div className="p-8 border-b border-[#f1f5f9] flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center text-slate-300 border border-[#f1f5f9] mb-4">
                  <FaUser size={24} />
                </div>
                <h3 className="text-slate-900 font-black text-sm tracking-widest uppercase m-0">Hola, {userName.split(' ')[0]}</h3>
                <p className="text-slate-400 text-[10px] mt-1 m-0 font-bold uppercase tracking-[0.15em]">{userEmail}</p>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-200 group ${
                        isActive 
                          ? 'bg-[#f0f7ff] text-blue-600 border-l-4 border-blue-600' 
                          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-base ${isActive ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {isActive && <FaChevronRight size={10} />}
                    </Link>
                  );
                })}
                
                <div className="mt-4 pt-2 border-t border-[#f1f5f9]">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 bg-transparent border-0 cursor-pointer text-left"
                  >
                    <FaSignOutAlt className="text-base" />
                    Cerrar Sesión
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white border border-[#f1f5f9] shadow-sm p-10 min-h-[600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
