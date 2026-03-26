'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

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
        { label: 'AMAZON', href: '/category/amazon' },
      ],
    },
    { label: 'NOTEBOOKS', href: '/category/notebooks', id: 'notebooks' },
    { label: 'ACCESORIOS STARLINK', href: '/category/accesorios-starlink', id: 'starlink' },
  ];

  // Update active link based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // On mobile we don't necessarily want to lock body scroll for a dropdown
    // but if it's very long, maybe we do. Compragamer doesn't lock it usually.
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header 
      className={`main-site-header sticky top-0 z-[1000] bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}
    >
      <div className="header-top flex items-center justify-between px-4 md:px-10 py-3 md:py-4">
        {/* Left: Hamburger (Mobile Only) */}
        <button
          onClick={toggleMenu}
          className="hamburger-menu md:hidden flex items-center justify-center w-10 h-10 p-0 bg-transparent border-0 cursor-pointer text-black z-[1100]"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Center/Left: Logo */}
        <Link href="/" className="logo flex items-center">
          <img
            src="/images/logotest9.png"
            alt="JBimports Logo"
            className="w-auto object-contain cursor-pointer transition-transform hover:scale-105"
          />
        </Link>

          <form onSubmit={handleSearch} className="hidden md:flex search-bar flex-1 max-w-2xl mx-10 items-center rounded-lg border border-gray-300 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-3 border-0 bg-transparent font-sans text-base outline-0"
            />
            <button type="submit" className="px-5 py-3 border-0 bg-transparent cursor-pointer flex items-center justify-center text-gray-600 hover:text-orange-600">
              <FaSearch size={20} />
            </button>
          </form>

          {/* Right: Actions */}
          <div className="header-actions flex items-center gap-4 md:gap-6">
            {/* Search Icon Mobile */}
            <button 
              className="md:hidden bg-transparent border-0 cursor-pointer text-gray-700 hover:text-orange-600" 
              aria-label="Buscar"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <FaSearch size={22} />
            </button>

            {/* User Icon & Dropdown */}
            <div className="relative user-menu-container" ref={userMenuRef}>
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

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-lg py-2 z-[200] border border-gray-100 animate-dropdown">
                  {session ? (
                    <>
                      <div className="px-5 py-3 border-b border-gray-50 mb-1">
                        <p className="text-gray-400 text-sm font-normal m-0 italic">Conectado como {session.user?.email}</p>
                      </div>
                      {[
                        { label: 'Mi cuenta', href: '/mi-cuenta' },
                        { label: 'Mis Compras', href: '/mi-cuenta/compras' },
                        { label: 'Facturas', href: '/mi-cuenta/facturas' },
                        { label: 'Favoritos', href: '/mi-cuenta/favoritos' },
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
                      <Link
                        href="/auth/signin"
                        className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors no-underline"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        INGRESAR
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

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
      {/* Mobile Search Input */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white border-b border-gray-100 animate-slideDown">
          <form onSubmit={handleSearch} className="flex search-bar items-center rounded-lg border border-gray-300 bg-gray-50 shadow-inner">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2 border-0 bg-transparent font-sans text-sm outline-0"
            />
            <button type="submit" className="px-4 py-2 border-0 bg-transparent cursor-pointer flex items-center justify-center text-gray-600 hover:text-orange-600">
              <FaSearch size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-black header-nav px-10 py-0 items-center justify-center h-14">
        <div className="nav-primary flex gap-8 list-none m-0 p-0 w-auto h-14 items-center">
          {navLinks.map((link) => (
            <div key={link.label} className="dropdown relative inline-block group">
              <Link
                href={link.href}
                className={`text-white font-medium text-base py-1.5 px-4 rounded transition-all flex items-center gap-2 ${activeLink === link.id ? 'font-bold' : 'hover:bg-gray-800'}`}
              >
                {link.label}
                {link.submenu && <FaChevronDown size={10} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />}
              </Link>
              {link.submenu && (
                <div className="dropdown-content absolute bg-white min-w-55 shadow-lg rounded-lg top-full left-0 p-3 hidden group-hover:block transition-all">
                  {link.submenu.map((sublink) => (
                    <Link
                      key={sublink.label}
                      href={sublink.href}
                      className="block text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all no-underline"
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/category/ofertas">
            <button className="comic-button px-4.5 py-1 text-sm font-normal text-white bg-red-400 border-2 border-black rounded-lg whitespace-nowrap hover:bg-white hover:text-red-400 hover:shadow-lg active:bg-yellow-300 active:shadow-none active:transform active:translate-y-1">
              OFERTAS! 🔥
            </button>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown (Compragamer style) */}
      <div 
        id="main-nav" 
        className={`md:hidden absolute top-full left-0 w-full bg-white z-[900] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="mobile-dropdown-nav flex flex-col overflow-y-auto">
          {navLinks.map((link) => (
            <div key={link.label} className="mobile-menu-item border-b border-gray-100">
              <div className="flex items-center justify-between px-6 py-4">
                <Link 
                  href={link.href} 
                  className="text-black text-sm font-bold uppercase no-underline flex-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.submenu && (
                  <button 
                    onClick={() => toggleDropdown(link.label)}
                    className="p-2 text-gray-400 bg-transparent border-0 cursor-pointer"
                  >
                    <FaChevronDown className={`transition-transform duration-300 ${openDropdown === link.label ? 'rotate-180' : ''}`} size={16} />
                  </button>
                )}
              </div>
              
              {link.submenu && openDropdown === link.label && (
                <div className="bg-gray-50 animate-slideDown">
                  {link.submenu.map((sublink) => (
                    <Link
                      key={sublink.label}
                      href={sublink.href}
                      className="block text-gray-600 px-10 py-3 text-xs font-semibold border-b border-gray-100 last:border-0 hover:text-blue-600 no-underline uppercase"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-5 bg-gray-50">
            <Link href="/category/ofertas" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full comic-button py-3 text-sm font-bold text-white bg-red-500 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                ¡OFERTAS IMPERDIBLES! 🔥
              </button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
