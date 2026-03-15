'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProductById, getProductsByCategory, Product } from '@/lib/api/mockCategoryProducts';
import { getSpecsByProductId, Spec } from '@/lib/api/productSpecifications';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { FaRegCommentDots, FaTruck, FaShieldAlt, FaCreditCard, FaRegHeart, FaInfoCircle } from 'react-icons/fa';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // We already have loading: true from useState initial value
    const foundProduct = getProductById(id);
    setProduct(foundProduct || null);
    
    if (foundProduct) {
      // Get specs
      const foundSpecs = getSpecsByProductId(id);
      setSpecs(foundSpecs);

      // Get related products from the same category
      const related = getProductsByCategory(foundProduct.category).filter(p => p.id !== id).slice(0, 4);
      setRelatedProducts(related);
    }
    
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  };

  const handleComprarAhora = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    
    router.push('/cart'); // Or wherever checkout is
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-[#333] mb-4">Producto no encontrado</h1>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#0066cc] text-white rounded-md hover:bg-blue-700"
        >
          Volver atrás
        </button>
      </div>
    );
  }
  
  // Calculated values mimicking Mexx - Moved here after null check
  const cuotasPrice = Math.round(product.price * 1.4); 
  const sinImpuestos = Math.round(product.price * 0.79);

  return (
    <div className="bg-white flex flex-col items-center min-h-screen" style={{ paddingTop: '180px' }}>
      
      {/* Breadcrumb Navigation - Centered wrapper */}
      <div className="max-w-[1300px] w-full px-4 pb-4">
        <div className="flex items-center gap-2 text-[13px] text-[#0066cc]" style={{ marginBottom: '16px' }}>
          <Link href="/" className="hover:underline">Inicio</Link>
          <span className="text-[#666]">›</span>
          <Link href={`/category/${product.category}`} className="hover:underline capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <span className="text-[#666]">›</span>
          <span className="text-[#666]">{product.name}</span>
        </div>
      </div>

      <main className="max-w-[1300px] w-full px-4 pb-20">
        {/* Top Split Area */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Image Gallery (Approx 55%) */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="flex-1 bg-white flex items-center justify-center p-4 min-h-[400px] border border-transparent hover:border-gray-100 transition-all rounded-md">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[450px] w-auto object-contain"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 mt-6 justify-center">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num}
                  className={`w-[80px] h-[80px] border flex items-center justify-center cursor-pointer p-1 rounded-sm ${num === 1 ? 'border-[#0066cc]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={product.image} alt="thumb" className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info and Buying Box (Approx 45%) */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2">
            
            <h1 className="text-[28px] font-bold text-[#333] leading-[1.2] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[42px] font-bold text-[#0066cc] leading-none mb-1">
                  ${product.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-[#666]">
                  Mejor Precio <FaInfoCircle className="text-gray-400" />
                </div>
              </div>
              
              {product.stock > 0 && (
                <div className="bg-[#4caf50] text-white text-[11px] font-bold px-3 py-1 rounded-sm self-start mt-2 border border-[#3e8e41]">
                  EN STOCK
                </div>
              )}
            </div>

            {/* Installments Box */}
            <div className="flex items-center gap-4 bg-white border border-[#e0e0e0] rounded-md p-4 mb-3">
              <FaCreditCard className="text-[32px] text-[#333]" />
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[18px] text-[#333]">${cuotasPrice.toLocaleString()}</span>
                  <span className="text-[#0066cc] text-[18px] font-bold">¡12 cuotas simples!</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#666]">
                  Precio 12 cuotas <FaInfoCircle className="text-gray-400" />
                </div>
              </div>
              <FaRegHeart className="text-[24px] text-[#0066cc] cursor-pointer" />
            </div>

            <div className="text-[11px] text-[#888] mb-6">
              Precio sin impuestos nac: ${sinImpuestos.toLocaleString()}
            </div>

            {/* Actions: Quantity & Add to cart */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex gap-3 h-[46px]">
                {/* Quantity */}
                <div className="flex border border-[#ccc] rounded-md overflow-hidden bg-white w-[100px]">
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly
                    className="w-full text-center text-[14px] font-bold text-[#333] border-none outline-none"
                  />
                  <div className="flex flex-col border-l border-[#ccc] w-[30px] bg-[#f5f5f5]">
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="flex-1 flex items-center justify-center border-b border-[#ccc] hover:bg-[#e0e0e0] cursor-pointer font-bold text-[#555]"
                    >+</button>
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex-1 flex items-center justify-center hover:bg-[#e0e0e0] cursor-pointer font-bold text-[#555]"
                    >-</button>
                  </div>
                </div>
                
                {/* Call to Actions */}
                <button 
                  onClick={handleComprarAhora}
                  className="flex-1 bg-[#0066cc] text-white font-bold text-[13px] uppercase rounded-md tracking-wide hover:bg-[#0052a3] shadow-sm transition-colors cursor-pointer"
                >
                  COMPRAR AHORA
                </button>
              </div>

              {/* HERE ARE THE RECUADROS CELESTES! */}
              <button 
                onClick={handleAddToCart}
                className="w-full h-[46px] bg-[#e6f0ff] border border-[#b3d4ff] text-[#0066cc] font-bold text-[13px] uppercase rounded-md tracking-wide hover:bg-[#d6e8ff] transition-colors cursor-pointer"
              >
                AGREGAR AL CARRITO
              </button>
            </div>

            {/* Feature List */}
            <div className="flex flex-col gap-4 py-4 border-t border-[#eee] mt-2">
              <div className="flex items-center gap-4 text-[#444] text-[14px]">
                <div className="w-[36px] h-[36px] bg-[#e6f0ff] rounded-full flex items-center justify-center text-[#0066cc]">
                  <FaRegCommentDots size={18} />
                </div>
                <span className="hover:text-[#0066cc] cursor-pointer transition-colors">Hacer pregunta sobre este Artículo</span>
              </div>
              
              <div className="flex items-center gap-4 text-[#444] text-[14px]">
                <div className="w-[36px] h-[36px] bg-[#e8f5e9] rounded-full flex items-center justify-center text-[#28a745]">
                  <FaTruck size={18} />
                </div>
                <div className="flex gap-2 items-center">
                  <span>Envío a todo el país.</span>
                  <span className="text-[#0066cc] text-[12px] font-bold cursor-pointer hover:underline">CALCULAR ENVÍO</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[#444] text-[14px]">
                <div className="w-[36px] h-[36px] bg-[#e8f5e9] rounded-full flex items-center justify-center text-[#28a745]">
                  <FaShieldAlt size={18} />
                </div>
                <span>Garantía Oficial 12 meses</span>
              </div>
            </div>

            {/* Brand Logo & Code Info */}
            <div className="mt-auto flex justify-end items-end pt-4">
              <div className="flex flex-col items-center gap-1 border border-[#eee] px-4 py-2 rounded-sm shadow-sm bg-[#fafafa]">
                <div className="text-[12px] font-bold text-[#0066cc]">▣ {product.name.split(' ')[0].toUpperCase()}</div>
                <div className="text-[10px] text-[#666]">CÓDIGO: 10000{product.id}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Especificación Section (Mocked Data) */}
        <div className="mt-[60px]">
          <div className="border-b-2 border-[#e0e0e0] mb-6 flex">
            <h2 className="text-[22px] font-normal text-[#333] pb-2 border-b-2 border-[#0066cc] -mb-[2px] pr-8">
              Especificación
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12 text-[14px] text-[#444]">
            {specs.length > 0 ? (
              specs.map((s, idx) => (
                <div key={idx} className="flex font-sans">
                  <strong className="w-[160px] text-[#333]">{s.label} :</strong> 
                  <span>{s.value}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex font-sans"><strong className="w-[160px] text-[#333]">Marca :</strong> <span>{product.name.split(' ')[0]}</span></div>
                <div className="flex font-sans"><strong className="w-[160px] text-[#333]">Modelo :</strong> <span>{product.name.split(' ').slice(1, 3).join(' ')}</span></div>
                <div className="flex font-sans"><strong className="w-[160px] text-[#333]">Condición :</strong> <span>Nuevo en Caja</span></div>
                <div className="flex font-sans"><strong className="w-[160px] text-[#333]">Stock :</strong> <span>{product.stock} disponibles</span></div>
              </>
            )}
            <div className="flex font-sans"><strong className="w-[160px] text-[#333]">ID :</strong> <span>{product.id}</span></div>
            <div className="flex font-sans"><strong className="w-[160px] text-[#333]">Categoría :</strong> <span className="capitalize">{product.category.replace('-', ' ')}</span></div>
          </div>
          <div className="mt-8 text-[14px] text-[#444] leading-relaxed max-w-[900px]">
            <strong className="text-[#333] block mb-2">Descripción General:</strong>
            {product.description}. Este excelente {product.category.replace('-', ' ')} está pensado para brindar el máximo rendimiento en su gama. Diseño premium, excelente durabilidad y prestaciones de última generación.
          </div>
        </div>

        {/* Quienes vieron este producto también compraron */}
        {relatedProducts.length > 0 && (
          <div className="mt-[80px]">
            <div className="border-b-2 border-[#e0e0e0] mb-8 flex">
              <h2 className="text-[22px] font-normal text-[#333] pb-2 border-b-2 border-[#0066cc] -mb-[2px] pr-8">
                Quienes vieron este producto también compraron
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="border border-[#e0e0e0] rounded-sm p-4 hover:shadow-lg transition-shadow bg-white flex flex-col items-center text-center">
                  <div className="h-[150px] w-full flex items-center justify-center mb-4">
                    <img src={rp.image} alt={rp.name} className="max-h-full object-contain" />
                  </div>
                  <Link href={`/product/${rp.id}`} className="text-[13px] text-[#555] h-[40px] overflow-hidden hover:text-[#0066cc] transition mb-3">
                    {rp.name}
                  </Link>
                  <div className="w-full flex justify-center mb-3">
                    <span className="bg-[#4caf50] text-white text-[11px] font-bold px-3 py-1 rounded-sm">
                      Envío rápido
                    </span>
                  </div>
                  <div className="text-[20px] font-bold text-[#333] mb-4">
                    ${rp.price.toLocaleString()} <FaInfoCircle className="inline text-[12px] text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
