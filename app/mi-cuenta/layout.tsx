'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, FaShoppingBag, FaFileAlt, FaMapMarkerAlt, FaTruck, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Mi perfil', href: '/mi-cuenta', icon: <FaUser /> },
    { label: 'Mis Compras', href: '/mi-cuenta/compras', icon: <FaShoppingBag /> },
    { label: 'Facturas', href: '/mi-cuenta/facturas', icon: <FaFileAlt /> },
    { label: 'Direcciones', href: '/mi-cuenta/direcciones', icon: <FaMapMarkerAlt /> },
    { label: 'Seguimiento', href: '/mi-cuenta/seguimiento', icon: <FaTruck /> },
    { label: 'Ayuda', href: '/mi-cuenta/ayuda', icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center" style={{ paddingTop: '180px' }}>
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  J
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base m-0">Hola Julián</h3>
                  <p className="text-gray-500 text-xs m-0">julian@ejemplo.com</p>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all bg-transparent border-0 cursor-pointer text-left mt-4"
                >
                  <FaSignOutAlt className="text-lg" />
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
