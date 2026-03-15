// Datos mock para productos por categoría
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string; // categoria slug
  description: string;
  stock: number;
  discount?: number; // porcentaje
  badge?: string; // ej: "PC ARMADA", "STOCK LIMITADO"
}

export const mockCategoryProducts: { [key: string]: Product[] } = {
  'pc-escritorio': [
    { id: 'pc-1', name: 'PC Gamer AMD Ryzen 7 9800X3D RTX 5080 V70', price: 4985, originalPrice: 5520, discount: 10, image: 'https://dummyimage.com/400x400/2c3e50/16a085.jpg?text=PC+Gamer+RTX5080', category: 'pc-escritorio', description: 'PC de alto rendimiento', stock: 5, badge: 'PC ARMADA' },
    { id: 'pc-2', name: 'PC Workstation AMD Ryzen 9 5950X', price: 3200, originalPrice: 3800, discount: 15, image: 'https://dummyimage.com/400x400/34495e/16a085.jpg?text=Workstation', category: 'pc-escritorio', description: 'Workstation profesional', stock: 3, badge: 'WORKSTATION' },
    { id: 'pc-3', name: 'PC Gaming Intel i5 RTX 3060', price: 1200, originalPrice: 1500, discount: 20, image: 'https://dummyimage.com/400x400/2c3e50/e74c3c.jpg?text=Gaming', category: 'pc-escritorio', description: 'PC gaming accesible', stock: 8, badge: 'OFERTA' },
    { id: 'pc-4', name: 'PC Pro Design RTX 4090', price: 4999, originalPrice: 6200, discount: 19, image: 'https://dummyimage.com/400x400/2c3e50/3498db.jpg?text=Design+RTX4090', category: 'pc-escritorio', description: 'Máquina de diseño profesional', stock: 2, badge: 'PROFESIONAL' },
    { id: 'pc-5', name: 'PC Streaming i9 32GB', price: 2999, originalPrice: 3499, discount: 14, image: 'https://dummyimage.com/400x400/34495e/f39c12.jpg?text=Streaming', category: 'pc-escritorio', description: 'PC especializado para streaming', stock: 4, badge: 'STREAMING' },
    { id: 'pc-6', name: 'PC Servidor Xeon Quadro', price: 5500, image: 'https://dummyimage.com/400x400/2c3e50/9b59b6.jpg?text=Servidor', category: 'pc-escritorio', description: 'Servidor empresarial', stock: 1, badge: 'SERVIDOR' },
    { id: 'pc-7', name: 'PC Retro 80s Gaming', price: 1999, originalPrice: 2200, discount: 9, image: 'https://dummyimage.com/400x400/c0392b/ecf0f1.jpg?text=Retro', category: 'pc-escritorio', description: 'PC gaming con diseño retro', stock: 6, badge: 'CUSTOM' },
    { id: 'pc-8', name: 'PC Entrada Budget i3', price: 599, originalPrice: 799, discount: 25, image: 'https://dummyimage.com/400x400/1abc9c/2c3e50.jpg?text=Budget', category: 'pc-escritorio', description: 'PC económica', stock: 12, badge: 'OFERTA' },
  ],
  'placas-video': [
    { id: 'gpu-1', name: 'RTX 4090 Founders Edition', price: 1799, originalPrice: 1999, discount: 10, image: 'https://dummyimage.com/400x400/2c3e50/f0ad4e.jpg?text=RTX+4090', category: 'placas-video', description: 'Tarjeta gráfica de alta performance', stock: 3, badge: 'FLAGSHIP' },
    { id: 'gpu-2', name: 'RTX 4070 Ti Gaming', price: 1349, originalPrice: 1549, discount: 15, image: 'https://dummyimage.com/400x400/34495e/5cb85c.jpg?text=RTX+4070Ti', category: 'placas-video', description: 'Excelente relación precio-rendimiento', stock: 5, badge: 'GAMING' },
    { id: 'gpu-3', name: 'RTX 4070 Super', price: 849, originalPrice: 999, discount: 17, image: 'https://dummyimage.com/400x400/2c3e50/46b8da.jpg?text=RTX+4070S', category: 'placas-video', description: 'Rendimiento 4K más asequible', stock: 7, badge: 'STOCK' },
    { id: 'gpu-4', name: 'RTX 4060 Ti Entry', price: 449, originalPrice: 549, discount: 18, image: 'https://dummyimage.com/400x400/16a085/ecf0f1.jpg?text=RTX+4060Ti', category: 'placas-video', description: 'Para gaming 1440p accesible', stock: 10, badge: 'OFERTA' },
    { id: 'gpu-5', name: 'RTX 4060 1080p', price: 279, originalPrice: 349, discount: 20, image: 'https://dummyimage.com/400x400/c0392b/f8f9fa.jpg?text=RTX+4060', category: 'placas-video', description: 'GPU entry level para 1080p', stock: 15, badge: 'PRESUPUESTO' },
    { id: 'gpu-6', name: 'RTX 3090 Ti', price: 999, originalPrice: 1299, discount: 23, image: 'https://dummyimage.com/400x400/8e44ad/ecf0f1.jpg?text=RTX+3090Ti', category: 'placas-video', description: 'Generación anterior', stock: 2, badge: 'OFERTA' },
    { id: 'gpu-7', name: 'RX 7900 XTX', price: 1199, originalPrice: 1399, discount: 14, image: 'https://dummyimage.com/400x400/d35400/ecf0f1.jpg?text=RX+7900XTX', category: 'placas-video', description: 'Alternativa AMD competitiva', stock: 4, badge: 'AMD' },
    { id: 'gpu-8', name: 'RX 7700 XT', price: 679, originalPrice: 799, discount: 15, image: 'https://dummyimage.com/400x400/e67e22/ecf0f1.jpg?text=RX+7700XT', category: 'placas-video', description: 'Buena opción AMD para 1440p', stock: 8, badge: 'AMD' },
  ],
  'monitores': [
    { id: 'mon-1', name: 'Monitor 4K 144Hz 27"', price: 599, image: 'https://dummyimage.com/400x400/34495e/16a085.jpg?text=Monitor+4K', category: 'monitores', description: 'Monitor 4K con 144Hz', stock: 4 },
    { id: 'mon-2', name: 'Monitor 1440p 240Hz Gaming', price: 349, image: 'https://dummyimage.com/400x400/2c3e50/3498db.jpg?text=1440p+Gaming', category: 'monitores', description: 'Monitor gaming competitivo', stock: 7 },
    { id: 'mon-3', name: 'Monitor Ultrawide 34"', price: 799, image: 'https://dummyimage.com/400x400/1abc9c/2c3e50.jpg?text=Ultrawide', category: 'monitores', description: 'Monitor ultrawide 3440x1440', stock: 2 },
    { id: 'mon-4', name: 'Monitor 1080p 60Hz Office', price: 149, image: 'https://dummyimage.com/400x400/c0392b/ecf0f1.jpg?text=1080p+Office', category: 'monitores', description: 'Monitor básico para oficina', stock: 15 },
    { id: 'mon-5', name: 'Monitor 165Hz IPS Gaming', price: 279, image: 'https://dummyimage.com/400x400/f39c12/ecf0f1.jpg?text=IPS+Gaming', category: 'monitores', description: 'Monitor 24" IPS 165Hz', stock: 6 },
    { id: 'mon-6', name: 'Monitor OLED 4K Gaming', price: 1299, image: 'https://dummyimage.com/400x400/9b59b6/ecf0f1.jpg?text=OLED+4K', category: 'monitores', description: 'Monitor OLED 32" 4K', stock: 1 },
    { id: 'mon-7', name: 'Monitor Curved 27" 144Hz', price: 299, image: 'https://dummyimage.com/400x400/34495e/f0ad4e.jpg?text=Curved', category: 'monitores', description: 'Monitor curvado gaming', stock: 5 },
    { id: 'mon-8', name: 'Monitor Portátil USB-C', price: 399, image: 'https://dummyimage.com/400x400/16a085/ecf0f1.jpg?text=Portatil', category: 'monitores', description: 'Monitor portátil 15.6"', stock: 8 },
  ],
  'notebooks': [
    { id: 'nb-1', name: 'MacBook Pro 16" M3 Max', price: 2499, image: 'https://dummyimage.com/400x400/2c3e50/95a5a6.jpg?text=MacBook', category: 'notebooks', description: 'Laptop profesional Apple', stock: 2, badge: 'APPLE' },
    { id: 'nb-2', name: 'Dell XPS 15 i7 RTX 4070', price: 1899, image: 'https://dummyimage.com/400x400/34495e/ecf0f1.jpg?text=Dell+XPS', category: 'notebooks', description: 'Laptop premium profesional', stock: 3, badge: 'GAMING' },
    { id: 'nb-3', name: 'ASUS ROG Zephyrus i9', price: 2199, image: 'https://dummyimage.com/400x400/e74c3c/ecf0f1.jpg?text=ASUS+ROG', category: 'notebooks', description: 'Laptop gaming ultra performance', stock: 1, badge: 'GAMING' },
    { id: 'nb-4', name: 'Lenovo ThinkPad X1', price: 1299, image: 'https://dummyimage.com/400x400/16a085/2c3e50.jpg?text=Lenovo', category: 'notebooks', description: 'Laptop de negocios', stock: 5, badge: 'NEGOCIOS' },
    { id: 'nb-5', name: 'HP Pavilion 15 i5 8GB', price: 699, image: 'https://dummyimage.com/400x400/3498db/ecf0f1.jpg?text=HP', category: 'notebooks', description: 'Laptop accesible', stock: 8, badge: 'PRESUPUESTO' },
  ],
  'memorias-ram': [
    { id: 'ram-1', name: 'Corsair Dominator DDR5 32GB', price: 149, image: 'https://dummyimage.com/400x400/2c3e50/f0ad4e.jpg?text=Corsair', category: 'memorias-ram', description: 'RAM DDR5 de alta velocidad', stock: 6 },
    { id: 'ram-2', name: 'G.Skill Trident Z DDR5', price: 139, image: 'https://dummyimage.com/400x400/34495e/46b8da.jpg?text=G.Skill', category: 'memorias-ram', description: 'RAM excelente rendimiento', stock: 8 },
    { id: 'ram-3', name: 'Kingston HyperX DDR4 16GB', price: 59, image: 'https://dummyimage.com/400x400/16a085/ecf0f1.jpg?text=Kingston', category: 'memorias-ram', description: 'RAM DDR4 confiable', stock: 15 },
    { id: 'ram-4', name: 'Crucial Ballistix DDR4 32GB', price: 89, image: 'https://dummyimage.com/400x400/c0392b/ecf0f1.jpg?text=Crucial', category: 'memorias-ram', description: 'RAM rendimiento-precio', stock: 10 },
    { id: 'ram-5', name: 'ADATA XPG Spectrix DDR5', price: 159, image: 'https://dummyimage.com/400x400/f39c12/ecf0f1.jpg?text=ADATA', category: 'memorias-ram', description: 'RAM gaming premium', stock: 4 },
  ],
  'mothers': [
    { id: 'mb-1', name: 'ASUS ROG Z890-E', price: 499, image: 'https://dummyimage.com/400x400/9b59b6/ecf0f1.jpg?text=ASUS+Z890', category: 'mothers', description: 'Placa madre premium Intel', stock: 2 },
    { id: 'mb-2', name: 'MSI MPG B870E-E', price: 349, image: 'https://dummyimage.com/400x400/34495e/5cb85c.jpg?text=MSI+B870', category: 'mothers', description: 'Placa madre AMD gama alta', stock: 4 },
    { id: 'mb-3', name: 'GIGABYTE B850E Master', price: 369, image: 'https://dummyimage.com/400x400/2c3e50/3498db.jpg?text=GIGABYTE', category: 'mothers', description: 'Placa madre AMD estable', stock: 3 },
    { id: 'mb-4', name: 'ASRock B870M Phantom', price: 199, image: 'https://dummyimage.com/400x400/1abc9c/2c3e50.jpg?text=ASRock', category: 'mothers', description: 'Placa micro ATX accesible', stock: 7 },
  ],
  'gabinetes': [
    { id: 'cab-1', name: 'NZXT H7 Flow RGB', price: 179, image: 'https://dummyimage.com/400x400/e74c3c/ecf0f1.jpg?text=NZXT', category: 'gabinetes', description: 'Gabinete gaming con flujo', stock: 5 },
    { id: 'cab-2', name: 'Corsair 5000T Airflow', price: 299, image: 'https://dummyimage.com/400x400/f39c12/2c3e50.jpg?text=Corsair', category: 'gabinetes', description: 'Gabinete premium con RGB', stock: 3 },
    { id: 'cab-3', name: 'Lian Li Lancool 215', price: 69, image: 'https://dummyimage.com/400x400/16a085/ecf0f1.jpg?text=Lancool', category: 'gabinetes', description: 'Gabinete presupuesto gaming', stock: 10 },
    { id: 'cab-4', name: 'Fractal Design Core 1000', price: 49, image: 'https://dummyimage.com/400x400/34495e/95a5a6.jpg?text=Fractal', category: 'gabinetes', description: 'Gabinete básico funcional', stock: 12 },
  ],
  'fuentes': [
    { id: 'psu-1', name: 'Corsair RM1200x 80+ Gold', price: 199, image: 'https://dummyimage.com/400x400/2c3e50/f0ad4e.jpg?text=RM1200', category: 'fuentes', description: 'Fuente modular certificada', stock: 4 },
    { id: 'psu-2', name: 'EVGA G6 850W', price: 129, image: 'https://dummyimage.com/400x400/c0392b/ecf0f1.jpg?text=EVGA', category: 'fuentes', description: 'Excelente relación precio', stock: 6 },
    { id: 'psu-3', name: 'Seasonic FOCUS 750W', price: 119, image: 'https://dummyimage.com/400x400/3498db/ecf0f1.jpg?text=Seasonic', category: 'fuentes', description: 'Fuente silenciosa japonesa', stock: 5 },
    { id: 'psu-4', name: 'ThermalTake Toughpower 650W', price: 99, image: 'https://dummyimage.com/400x400/1abc9c/2c3e50.jpg?text=TT', category: 'fuentes', description: 'Opción presupuesto confiable', stock: 8 },
  ],
  'perifericos': [
    { id: 'per-1', name: 'Logitech MX Master 3S', price: 99, image: 'https://dummyimage.com/400x400/34495e/5cb85c.jpg?text=Logitech', category: 'perifericos', description: 'Ratón inalámbrico premium', stock: 6 },
    { id: 'per-2', name: 'Corsair K95 Platinum', price: 199, image: 'https://dummyimage.com/400x400/2c3e50/3498db.jpg?text=Corsair', category: 'perifericos', description: 'Teclado gaming mecánico', stock: 3 },
    { id: 'per-3', name: 'SteelSeries Arctis Pro', price: 329, image: 'https://dummyimage.com/400x400/e74c3c/ecf0f1.jpg?text=SteelSeries', category: 'perifericos', description: 'Headset gaming profesional', stock: 2 },
    { id: 'per-4', name: 'Razer DeathAdder V3', price: 69, image: 'https://dummyimage.com/400x400/f39c12/2c3e50.jpg?text=Razer', category: 'perifericos', description: 'Ratón gaming ergonómico', stock: 8 },
  ],
  'almacenamiento': [
    { id: 'ssd-1', name: 'Samsung 990 Pro 2TB', price: 199, image: 'https://dummyimage.com/400x400/9b59b6/ecf0f1.jpg?text=Samsung', category: 'almacenamiento', description: 'SSD NVMe ultra rápido', stock: 5 },
    { id: 'ssd-2', name: 'WD Black SN850X 1TB', price: 99, image: 'https://dummyimage.com/400x400/16a085/ecf0f1.jpg?text=WD', category: 'almacenamiento', description: 'SSD gaming de alto rendimiento', stock: 8 },
    { id: 'ssd-3', name: 'Crucial MX500 2TB SATA', price: 179, image: 'https://dummyimage.com/400x400/34495e/95a5a6.jpg?text=Crucial', category: 'almacenamiento', description: 'SSD SATA confiable', stock: 10 },
    { id: 'ssd-4', name: 'Kingston A2000 1TB', price: 79, image: 'https://dummyimage.com/400x400/c0392b/ecf0f1.jpg?text=Kingston', category: 'almacenamiento', description: 'SSD presupuesto funcional', stock: 12 },
  ],
  'impresoras': [
    { id: 'imp-1', name: 'HP LaserJet M404n', price: 399, image: 'https://dummyimage.com/400x400/2c3e50/f0ad4e.jpg?text=HP', category: 'impresoras', description: 'Impresora láser profesional', stock: 2 },
    { id: 'imp-2', name: 'Canon imagePRESS', price: 1299, image: 'https://dummyimage.com/400x400/3498db/ecf0f1.jpg?text=Canon', category: 'impresoras', description: 'Impresora comercial color', stock: 1 },
    { id: 'imp-3', name: 'Xerox VersaLink', price: 899, image: 'https://dummyimage.com/400x400/1abc9c/2c3e50.jpg?text=Xerox', category: 'impresoras', description: 'Sistema multifunción empresarial', stock: 1 },
    { id: 'imp-4', name: 'Epson WorkForce', price: 299, image: 'https://dummyimage.com/400x400/e74c3c/ecf0f1.jpg?text=Epson', category: 'impresoras', description: 'Impresora inyección tinta', stock: 5 },
  ],
};

/**
 * Obtiene los productos de una categoría específica por su slug
 * @param slug - El identificador único de la categoría (ej: 'pc-escritorio')
 * @returns Array de productos de la categoría, o array vacío si no existe
 */
export function getProductsByCategory(slug: string): Product[] {
  return mockCategoryProducts[slug] || [];
}

/**
 * Obtiene un producto individual mediante su ID buscándolo en todas las categorías.
 * @param id - El identificador único del producto.
 * @returns El producto encontrado o undefined.
 */
export function getProductById(id: string): Product | undefined {
  for (const category in mockCategoryProducts) {
    const product = mockCategoryProducts[category].find(p => p.id === id);
    if (product) return product;
  }
  return undefined;
}
