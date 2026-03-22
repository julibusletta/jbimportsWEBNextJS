'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useCart } from '@/app/context/CartContext';
import '../../styles/Header.css';

interface NavLink {
  label: string;
  href: string;
  id?: string;
  submenu?: NavLink[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navLinks: NavLink[] = [
    {
      label: 'CELULARES',
      href: '/category/celulares',
      id: 'celulares',
      submenu: [
        { label: 'XIAOMI', href: '/category/xiaomi' },
        { label: 'MOTOROLA', href: '/category/motorola' },
        { label: 'SAMSUNG', href: '/category/samsung' },
        { label: 'REALME', href: '/category/realme' },
      ],
    },
    {
      label: 'JBL',
      href: '/category/parlantes',
      id: 'jbl',
      submenu: [
        { label: 'AURICULARES', href: '/category/auriculares' },
        { label: 'PARLANTES', href: '/category/parlantes' },
      ],
    },
    {
      label: 'APPLE',
      href: '/category/apple',
      id: 'apple',
      submenu: [
        { label: 'IPHONE', href: '/category/iphone' },
        { label: 'MACBOOK', href: '/category/macbook' },
        { label: 'WATCH', href: '/category/watch' },
      ],
    },
    {
      label: 'SMART HOME',
      href: '/category/smart-home',
      id: 'smart-home',
      submenu: [
        { label: 'ASPIRADORAS ROBOT', href: '/category/aspiradoras-robot' },
        { label: 'CÁMARAS DE SEGURIDAD', href: '/category/camaras-seguridad' },
        { label: 'ALEXA', href: '/category/alexa' },
      ],
    },
    { label: 'NOTEBOOKS', href: '/category/notebooks', id: 'notebooks' },
    { label: 'ACCESORIOS STARLINK', href: '/category/accesorios-starlink', id: 'starlink' },
  ];

  // Update active link based on scroll position
  const updateActiveLink = () => {
    const sections = document.querySelectorAll('section, .hero');
    let currentSection = 'home';

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 150) {
        currentSection = section.id || 'home';
      }
    });

    setActiveLink(currentSection);
  };

  // Scroll effect - Add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      updateActiveLink();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header className={`main-site-header sticky top-0 z-100 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
      <div className="header-top flex items-center gap-6 px-6 md:px-10 py-3 md:py-4 justify-center">
        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 w-6 h-5 p-0 bg-transparent border-0 cursor-pointer absolute left-5"
          aria-label="Menú"
        >
          <span className="w-full h-0.5 bg-black rounded-sm"></span>
          <span className="w-full h-0.5 bg-black rounded-sm"></span>
          <span className="w-full h-0.5 bg-black rounded-sm"></span>
        </button>

        {/* Logo */}
        <Link href="/" className="logo flex-shrink-0 h-11 sm:h-14 md:h-28 flex items-center">
          <img
            src="/images/logotest9.png"
            alt="JBimports Logo"
            className="h-full w-auto max-w-xs object-contain cursor-pointer transition-transform hover:scale-105"
          />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex search-bar items-center rounded-lg border border-gray-300 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="flex-1 px-6 py-3 border-0 bg-transparent font-sans text-base outline-0"
          />
          <button type="submit" className="px-5 py-3 border-0 bg-transparent cursor-pointer flex items-center justify-center text-gray-600 hover:text-orange-600">
            <FaSearch size={20} />
          </button>
        </div>

        {/* Header Actions */}
        <div className="header-actions flex items-center gap-6 ml-auto">
          {/* User Icon & Dropdown */}
          <div className="relative user-menu-container">
            <button
              onMouseEnter={() => !isMenuOpen && setIsUserMenuOpen(true)}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="text-gray-700 hover:text-orange-600 transition-colors bg-transparent border-0 p-0 flex items-center gap-2 cursor-pointer"
              aria-label="Usuario"
            >
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-6 h-6 rounded-full" />
              ) : (
                <FaUser size={22} />
              )}
              <span className="hidden lg:inline text-sm font-medium uppercase">
                {session ? `Hola, ${session.user?.name?.split(' ')[0]}` : 'MI CUENTA'}
              </span>
              <FaChevronDown size={10} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-lg py-2 z-[200] border border-gray-100 animate-dropdown"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                {session ? (
                  <>
                    <div className="px-5 py-3 border-b border-gray-50 mb-1">
                      <p className="text-gray-400 text-sm font-normal m-0 italic">Conectado como {session.user?.email}</p>
                    </div>

                    {[
                      { label: 'Mi cuenta', href: '/mi-cuenta' },
                      { label: 'Mis Compras', href: '/mi-cuenta/compras' },
                      { label: 'Facturas', href: '/mi-cuenta/facturas' },
                      { label: 'Preguntas', href: '/mi-cuenta/preguntas' },
                      { label: 'Favoritos', href: '/mi-cuenta/favoritos' },
                      { label: 'Canje de juegos', href: '/mi-cuenta/canje' },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-5 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-gray-50 text-sm font-medium transition-all no-underline"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={() => { signOut(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-5 py-2.5 text-gray-700 hover:text-red-500 hover:bg-gray-50 text-sm font-medium transition-all bg-transparent border-0 cursor-pointer"
                      >
                        Salir
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <p className="text-gray-500 text-sm mb-4 text-center">Iniciá sesión para ver tus compras y más.</p>
                    <Link
                      href="/auth/signin"
                      className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors no-underline"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      INGRESAR
                    </Link>
                    <Link 
                      href="/auth/register"
                      className="block text-center text-[10px] text-gray-400 mt-3 uppercase tracking-wider hover:text-blue-600 transition-colors no-underline pt-2 border-t border-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ¿No tenés cuenta? Registrate
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Icon Mobile */}
          <button className="md:hidden bg-transparent border-0 cursor-pointer text-gray-700 hover:text-orange-600" aria-label="Buscar">
            <FaSearch size={22} />
          </button>

          {/* Cart */}
          <Link href="/cart" className="cart-icon relative flex items-center text-gray-700 hover:text-orange-600 cursor-pointer transition-colors">
            <FaShoppingCart size={28} />
            {cartCount > 0 && (
              <span className="cart-count absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div
          className="menu-overlay fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-black header-nav px-10 py-0 items-center justify-center h-14">
        <div className="nav-primary flex gap-8 list-none m-0 p-0 w-auto h-14 items-center">
          {navLinks.map((link) => (
            <div key={link.label} className="dropdown relative inline-block group">
              <Link
                href={link.href}
                className={`text-white font-medium text-base py-1.5 px-4 rounded transition-all flex items-center gap-2 ${activeLink === link.id
                    ? 'font-bold'
                    : 'hover:bg-gray-800'
                  }`}
              >
                {link.label}
                {link.submenu && (
                  <FaChevronDown size={10} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                )}
              </Link>

              {/* Dropdown Content */}
              {link.submenu && (
                <div className="dropdown-content absolute bg-white min-w-55 shadow-lg rounded-lg top-full left-0 p-3 animation-dropdown">
                  {link.submenu.map((sublink) => (
                    <div key={sublink.label} className="dropdown-submenu relative">
                      {sublink.submenu ? (
                        <>
                          <button className="w-full text-left text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all flex items-center justify-between">
                            {sublink.label}
                            <FaChevronDown size={12} />
                          </button>
                          <div className="submenu-content absolute left-full top-0 min-w-52 bg-white shadow-lg rounded-lg p-2 z-50">
                            {sublink.submenu.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block text-gray-900 px-6 py-2 text-base font-medium hover:bg-gray-100 rounded transition-all"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          href={sublink.href}
                          className="block text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all"
                        >
                          {sublink.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="comic-button px-4.5 py-1 text-sm font-normal text-white bg-red-400 border-2 border-black rounded-lg whitespace-nowrap hover:bg-white hover:text-red-400 hover:shadow-lg active:bg-yellow-300 active:shadow-none active:transform active:translate-y-1">
            OFERTAS! 🔥
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="header-nav md:hidden absolute top-full left-0 w-full bg-white overflow-hidden z-50 shadow-lg animate-slideDown">
          <nav className="nav-primary flex flex-col gap-0 p-0 w-full h-auto">
            {navLinks.map((link) => (
              <div key={link.label}>
                <button
                  onClick={() => link.submenu && toggleDropdown(link.label)}
                  className="w-full text-left text-black px-5 py-4 text-base font-medium border-b border-gray-200 hover:bg-gray-100 flex items-center justify-between"
                >
                  {link.label}
                  {link.submenu && (
                    <FaChevronDown
                      size={12}
                      className={`transition-transform ${openDropdown === link.label ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </button>

                {/* Mobile Dropdown */}
                {link.submenu && openDropdown === link.label && (
                  <div className="dropdown-content bg-gray-50 border-b border-gray-200">
                    {link.submenu.map((sublink) => (
                      <div key={sublink.label} className="pl-5">
                        <Link
                          href={sublink.href}
                          className="block text-gray-800 px-5 py-3 text-sm font-medium border-b border-gray-200 hover:bg-gray-100"
                        >
                          {sublink.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
