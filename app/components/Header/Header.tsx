'use client';

import { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
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
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navLinks: NavLink[] = [
    { label: 'CELULARES', href: '#home', id: 'home' },
    { label: 'AURICULARES', href: '#home', id: 'home' },
    { label: 'PARLANTES', href: '#home', id: 'home' },
    {
      label: 'PRODUCTOS',
      href: '#',
      id: 'products',
      submenu: [
        {
          label: 'Apple',
          href: '#',
          submenu: [
            { label: 'Iphone', href: '#' },
            { label: 'Macbook', href: '#' },
            { label: 'Watch', href: '#' },
          ],
        },
        {
          label: 'Celulares',
          href: '#',
          submenu: [
            { label: 'Samsung', href: '#' },
            { label: 'Motorola', href: '#' },
            { label: 'Xiaomi', href: '#' },
            { label: 'Realme', href: '#' },
          ],
        },
        { label: 'Smart Home', href: '#' },
        { label: 'Parlantes', href: '#' },
        { label: 'Auriculares', href: '#' },
        { label: 'Consolas y videojuegos', href: '#' },
      ],
    },
    { label: 'NOTEBOOKS', href: '#services', id: 'services' },
  ];

  // Scroll effect - Add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      updateActiveLink();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-100 bg-white transition-shadow duration-300 ${
      isScrolled ? 'shadow-lg' : 'shadow-sm'
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
        <div className="logo flex-shrink-0 h-24 md:h-28 flex items-center">
          <img
            src="/images/logotest9.png"
            alt="JBimports Logo"
            className="h-full w-auto max-w-xs object-contain"
          />
        </div>

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
          {/* User Icon */}
          <a href="#" className="hidden sm:block text-gray-700 hover:text-orange-600 transition-colors" aria-label="Usuario">
            <FaUser size={22} />
          </a>

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
              <a
                href={link.href}
                className={`text-white font-medium text-base py-1.5 px-4 rounded transition-all ${
                  activeLink === link.id 
                    ? 'font-bold' 
                    : 'hover:bg-gray-800'
                }`}
              >
                {link.label}
              </a>

              {/* Dropdown Content */}
              {link.submenu && (
                <div className="dropdown-content hidden group-hover:block absolute bg-white min-w-55 shadow-lg rounded-lg top-full left-0 p-3 animation-dropdown">
                  {link.submenu.map((sublink) => (
                    <div key={sublink.label} className="dropdown-submenu relative">
                      {sublink.submenu ? (
                        <>
                          <button className="w-full text-left text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all flex items-center justify-between">
                            {sublink.label}
                            <FaChevronDown size={12} />
                          </button>
                          <div className="submenu-content hidden group-hover:block absolute left-full top-0 min-w-52 bg-white shadow-lg rounded-lg p-2 z-50">
                            {sublink.submenu.map((item) => (
                              <a
                                key={item.label}
                                href={item.href}
                                className="block text-gray-900 px-6 py-2 text-base font-medium hover:bg-gray-100 rounded transition-all"
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        </>
                      ) : (
                        <a
                          href={sublink.href}
                          className="block text-gray-900 px-6 py-2.5 text-base font-medium hover:bg-gray-100 rounded transition-all"
                        >
                          {sublink.label}
                        </a>
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
                      className={`transition-transform ${
                        openDropdown === link.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Mobile Dropdown */}
                {link.submenu && openDropdown === link.label && (
                  <div className="dropdown-content bg-gray-50 border-b border-gray-200">
                    {link.submenu.map((sublink) => (
                      <div key={sublink.label} className="pl-5">
                        <a
                          href={sublink.href}
                          className="block text-gray-800 px-5 py-3 text-sm font-medium border-b border-gray-200 hover:bg-gray-100"
                        >
                          {sublink.label}
                        </a>
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
