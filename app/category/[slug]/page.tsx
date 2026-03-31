'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProductsByCategory, Product } from '@/lib/api/productService';
import { getCategoryBySlug, Category } from '@/lib/api/categoriesService';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp, FaShoppingCart, FaEye, FaStar, FaRegStar } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const { data: session } = useSession();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  // Filter states
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('relevancia');
  const [showBrandsFilter, setShowBrandsFilter] = useState(true);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const prods = await getProductsByCategory(slug);
        setProducts(prods);
        setFilteredProducts(prods);

        let cat = await getCategoryBySlug(slug);
        if (!cat && slug === 'ofertas') {
          cat = {
            id: 'ofertas',
            name: 'OFERTAS SEMANALES',
            slug: 'ofertas',
            image: '/images/categories/ofertas.png',
            isMain: false,
            description: 'Las mejores ofertas de la semana en JB Imports'
          };
        }
        setCategory(cat);

        // Load favorites if session exists
        if (session?.user?.email) {
          const favRes = await fetch('/api/user/favorites');
          const favData = await favRes.json();
          if (favData.success) {
            setUserFavorites(favData.favorites.map((f: any) => f.id));
          }
        }
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, session]);

  const toggleFavorite = async (e: React.MouseEvent, productId: string, productName: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert('Inicia sesión para guardar favoritos');
      return;
    }

    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productName }),
      });
      const data = await res.json();
      if (data.success) {
        setUserFavorites(prev => 
          data.isFavorite ? [...prev, productId] : prev.filter(id => id !== productId)
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    if (showOnlyAvailable) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p =>
        selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase()))
      );
    }

    if (sortBy === 'precio-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'precio-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'nombre') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (slug === 'ofertas' && sortBy === 'relevancia') {
      const featuredIds = ['378', '1339'];
      filtered.sort((a, b) => {
        const aFeatured = featuredIds.includes(a.id);
        const bFeatured = featuredIds.includes(b.id);
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        return 0;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [products, showOnlyAvailable, sortBy, selectedBrands, slug]);
  
  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = itemsPerPage === -1 
    ? filteredProducts 
    : filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 text-sm">Cargando...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Categoría no encontrada</p>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Extract brand names from products for filter
  const knownBrands = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Realme', 'JBL', 'Amazon', 'Starlink', 'Asus', 'MSI', 'Gigabyte', 'HP', 'NVIDIA', 'AMD', 'Corsair', 'Kingston'];
  const availableBrands = knownBrands.map(brand => ({
    name: brand,
    count: products.filter(p => p.name.toLowerCase().includes(brand.toLowerCase())).length,
  })).filter(b => b.count > 0);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  function ProductCard({
    product,
    isAdded,
    onAddToCart,
  }: {
    product: Product;
    isAdded: boolean;
    onAddToCart: () => void;
  }) {
    const isFeaturedOffer = slug === 'ofertas' && ['378', '1339'].includes(product.id);
    const isFavorite = userFavorites.includes(product.id);

    return (
      <div
        style={{
          background: '#fff',
          border: isFeaturedOffer ? '2px solid #0066cc' : '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.2s',
          transform: isFeaturedOffer ? 'scale(1.02)' : 'none',
          zIndex: isFeaturedOffer ? 2 : 1,
          boxShadow: isFeaturedOffer ? '0 10px 20px rgba(0,102,204,0.15)' : 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = isFeaturedOffer 
            ? '0 12px 24px rgba(0,102,204,0.25)' 
            : '0 2px 12px rgba(0,0,0,0.13)';
          if (!isFeaturedOffer) e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = isFeaturedOffer 
            ? '0 10px 20px rgba(0,102,204,0.15)' 
            : 'none';
          if (!isFeaturedOffer) e.currentTarget.style.transform = 'none';
        }}
      >
        {/* DESTACADO badge for featured offers */}
        {isFeaturedOffer && (
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0066cc',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 900,
              padding: '4px 12px',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              letterSpacing: '1px',
              zIndex: 3,
            }}
          >
            OFERTA DESTACADA
          </div>
        )}

        {/* EN STOCK badge — corner */}
        {product.stock > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#28a745',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '3px',
              letterSpacing: '0.5px',
              zIndex: 1,
            }}
          >
            EN STOCK
          </div>
        )}

        {/* Favorite Star Button */}
        <button
          onClick={(e) => toggleFavorite(e, product.id, product.name)}
          style={{
            position: 'absolute',
            top: product.stock > 0 ? '34px' : '8px',
            right: '8px',
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            color: isFavorite ? '#ffc107' : '#ccc',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isFavorite ? <FaStar size={14} /> : <FaRegStar size={14} />}
        </button>

        {/* DISCOUNT badge — round circle */}
        {(product.discount && product.discount > 0) && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#e60000',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 900,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              lineHeight: '0.9',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              zIndex: 1,
              border: '2px solid white',
              padding: '2px'
            }}
          >
            <span>{Math.round(product.discount)}%</span>
            <span style={{ fontSize: '7px', fontWeight: 700 }}>OFF</span>
          </div>
        )}

        {/* Arrow nav left */}
        <button
          style={{
            position: 'absolute',
            top: '50%',
            left: '4px',
            transform: 'translateY(-80%)',
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1,
            fontSize: '10px',
            color: '#555',
          }}
        >
          ‹
        </button>
        <button
          style={{
            position: 'absolute',
            top: '50%',
            right: '4px',
            transform: 'translateY(-80%)',
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1,
            fontSize: '10px',
            color: '#555',
          }}
        >
          ›
        </button>

        {/* Product Image */}
        <Link href={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div
            style={{
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '260px',
              padding: '20px',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                maxHeight: '230px',
                maxWidth: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s',
              }}
            />
          </div>
        </Link>

        {/* Card Body */}
        <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Product name as link (blue) */}
          <Link
            href={`/product/${product.id}`}
            style={{
              color: '#0066cc',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration = 'underline')}
            onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration = 'none')}
          >
            {product.name}
          </Link>

          {/* Article and category line */}
          <div style={{ fontSize: '11px', color: '#888', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>Art. 10000{product.id}</span>
            <span>›</span>
            <a href="#" style={{ color: '#888', textDecoration: 'none', fontSize: '11px' }}>
              {category?.name}
            </a>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <Link
              href={`/product/${product.id}`}
              style={{
                background: 'transparent',
                border: '1px solid #999',
                borderRadius: '3px',
                color: '#333',
                fontSize: '12px',
                fontWeight: 600,
                padding: '7px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.15s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f0f0f0')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <FaEye size={12} />
              VER PRODUCTO
            </Link>

            <button
              onClick={product.stock > 0 ? onAddToCart : undefined}
              disabled={product.stock <= 0}
              style={{
                background: product.stock <= 0 ? '#cccccc' : (isAdded ? '#28a745' : '#1a1a2e'),
                border: 'none',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                padding: '7px 10px',
                cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => {
                if (!isAdded && product.stock > 0) (e.currentTarget as HTMLElement).style.background = '#2c2c4e';
              }}
              onMouseLeave={e => {
                if (!isAdded && product.stock > 0) (e.currentTarget as HTMLElement).style.background = '#1a1a2e';
              }}
            >
              {product.stock > 0 && <FaShoppingCart size={12} />}
              {product.stock <= 0 ? 'SIN STOCK' : (isAdded ? '¡AGREGADO!' : 'AGREGAR AL CARRITO')}
            </button>
          </div>
        </div>

        {/* Price footer */}
        <div
          style={{
            borderTop: '1px solid #eee',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#222' }}>
            ${product.price.toLocaleString()}
          </span>
          <span style={{ fontSize: '11px', color: '#aaa' }}>●</span>
        </div>
      </div>
    );
  }

  function AppleLanding() {
    const subCategories = [
      { name: 'iPhone', slug: 'iphone', image: '/images/categories/iphone.png' },
      { name: 'Macbook', slug: 'macbook', image: '/images/categories/macbook.png' },
      { name: 'Apple Watch', slug: 'watch', image: '/images/categories/watch.png' },
    ];

    return (
      <div className="bg-white flex flex-col items-center min-h-screen pt-2">
        <div className="max-w-[1300px] w-full px-4 pb-20">
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', display: 'flex', gap: '4px' }}>
            <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Inicio</Link>
            <span>›</span>
            <span style={{ color: '#333' }}>Apple</span>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#000', marginBottom: '40px', textAlign: 'center', textTransform: 'uppercase' }}>
            Mundo <b>Apple</b>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subCategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/category/${sub.slug}`}
                className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ aspectRatio: '4/5' }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${sub.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{sub.name}</h3>
                  <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold group-hover:bg-white group-hover:text-black transition-colors">
                    Ver Catálogo
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'apple') {
    return <AppleLanding />;
  }

  return (
    <div className="bg-white flex flex-col items-center min-h-screen pt-2">
      {/* Main content — below the global Navbar */}
      <div className="max-w-[1300px] w-full px-4 pb-12 flex flex-col">

        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.textDecoration = 'underline')}
            onMouseLeave={e => ((e.target as HTMLElement).style.textDecoration = 'none')}
          >
            Inicio
          </Link>
          <span>›</span>
          <span style={{ color: '#333' }}>{category?.name}</span>
        </div>

        {/* Category Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#222', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {category?.name}
        </h1>

        {/* Sort bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#444' }}>
          <span>Ordenar por</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              border: '1px solid #ccc',
              borderRadius: '3px',
              padding: '4px 8px',
              fontSize: '13px',
              color: '#333',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="relevancia">Más relevantes</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre">Alfabético</option>
          </select>
          <span style={{ marginLeft: 'auto', color: '#666' }}>
            {filteredProducts.length} productos
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* Sidebar */}
          <div className="w-full lg:w-[240px] flex-shrink-0">
            {/* Brands filter */}
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <button
                onClick={() => setShowBrandsFilter(!showBrandsFilter)}
                style={{
                  width: '100%',
                  background: '#f8f8f8',
                  border: 'none',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#222',
                }}
              >
                Marcas
                {showBrandsFilter ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
              {showBrandsFilter && availableBrands.length > 0 && (
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {availableBrands.map(brand => (
                    <label key={brand.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#333' }}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => toggleBrand(brand.name)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{brand.name}</span>
                      <span style={{ color: '#aaa', fontSize: '12px' }}>({brand.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price filter */}
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                style={{
                  width: '100%',
                  background: '#f8f8f8',
                  border: 'none',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#222',
                }}
              >
                Precio
                {showPriceFilter ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
              </button>
            </div>

            {/* Availability filter */}
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ background: '#f8f8f8', padding: '10px 12px', fontSize: '13px', fontWeight: 600, color: '#222' }}>
                Disponibilidad
              </div>
              <div style={{ padding: '10px 12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#333' }}>
                  <input
                    type="checkbox"
                    checked={showOnlyAvailable}
                    onChange={e => setShowOnlyAvailable(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Solo en stock</span>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#aaa' }}>○</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#666', fontSize: '14px' }}>
                No hay productos disponibles
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
                >
                  {currentItems.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAdded={addedToCart[product.id]}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && itemsPerPage !== -1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px', flexWrap: 'wrap' }}>
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{
                        padding: '0 12px',
                        height: '36px',
                        border: '1px solid #eee',
                        borderRadius: '6px',
                        background: '#fff',
                        color: currentPage === 1 ? '#ccc' : '#0066cc',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ‹ ANTERIOR
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          width: '36px',
                          height: '36px',
                          border: page === currentPage ? 'none' : '1px solid #eee',
                          borderRadius: '6px',
                          background: page === currentPage ? '#1a1a2e' : '#fff',
                          color: page === currentPage ? '#fff' : '#444',
                          fontSize: '14px',
                          fontWeight: page === currentPage ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{
                        padding: '0 12px',
                        height: '36px',
                        border: '1px solid #eee',
                        borderRadius: '6px',
                        background: '#fff',
                        color: currentPage === totalPages ? '#ccc' : '#0066cc',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      SIGUIENTE ›
                    </button>

                    {/* "Ver Todo" Button */}
                    <button
                      onClick={() => setItemsPerPage(-1)}
                      style={{
                        padding: '0 15px',
                        height: '36px',
                        border: '1px solid #eee',
                        borderRadius: '6px',
                        background: '#fff',
                        color: '#ff6600',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginLeft: '8px',
                        transition: 'all 0.2s',
                      }}
                    >
                      VER TODO
                    </button>
                  </div>
                )}
                
                {/* Reset Pagination when "Ver Todo" is active */}
                {itemsPerPage === -1 && filteredProducts.length > 12 && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                     <button
                        onClick={() => {
                          setItemsPerPage(12);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '8px 20px',
                          border: '1px solid #0066cc',
                          borderRadius: '6px',
                          background: '#fff',
                          color: '#0066cc',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        MOSTRAR PAGINACIÓN
                      </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
