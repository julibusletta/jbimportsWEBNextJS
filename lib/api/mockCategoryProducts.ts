export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  discount?: number;
  badge?: string;
  images?: string[];
  specifications?: { label: string, value: string }[];
  properties?: {
    weight?: string;
    dimensions?: string;
    color?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

/**
 * Obtiene los productos de una categoría específica por su slug
 */
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  if (typeof window !== 'undefined') {
    const res = await fetch(`/api/products?category=${slug}`);
    return res.json();
  }

  const dbConnect = (await import('../mongodb')).default;
  const ProductModel = (await import('../../models/Product')).default;
  await dbConnect();

  // Category mapping for parent categories (must match app/api/products/route.ts)
  const categoryMapping: { [key: string]: string[] } = {
    'celulares': ['celulares', 'samsung', 'xiaomi', 'motorola', 'realme', 'iphone'],
    'apple': ['apple', 'iphone', 'macbook', 'watch', 'ipad', 'airpods'],
    'jbl': ['jbl', 'parlantes', 'auriculares', 'sounds-bars'],
    'smart-home': ['smart-home', 'amazon', 'google', 'xiaomi-home', 'aspiradoras-robot', 'camaras-seguridades']
  };

  const cleanSlug = slug.toLowerCase().trim();

  if (cleanSlug === 'ofertas') {
    return ProductModel.find({ 
      $or: [
        { discount: { $gt: 0 } },
        { id: { $in: ['378', '1339'] } }
      ]
    }).lean() as unknown as Product[];
  }

  if (categoryMapping[cleanSlug]) {
    return ProductModel.find({ category: { $in: categoryMapping[cleanSlug] } }).lean() as unknown as Product[];
  }

  return ProductModel.find({ category: { $regex: cleanSlug, $options: 'i' } }).lean() as unknown as Product[];
}

/**
 * Obtiene un producto individual mediante su ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (typeof window !== 'undefined') {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  const dbConnect = (await import('../mongodb')).default;
  const ProductModel = (await import('../../models/Product')).default;
  await dbConnect();
  return ProductModel.findOne({ id }).lean() as unknown as Product | null;
}

/**
 * Obtiene todos los productos del sistema de forma plana (sin categorías).
 */
export async function getAllProducts(): Promise<Product[]> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/products');
    return res.json();
  }

  const dbConnect = (await import('../mongodb')).default;
  const ProductModel = (await import('../../models/Product')).default;
  await dbConnect();
  return ProductModel.find({}).lean() as unknown as Product[];
}

