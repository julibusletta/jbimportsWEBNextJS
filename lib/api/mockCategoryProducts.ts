import productsData from '@/data/products.json';

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
}

// Ensure the data is typed correctly
const mockCategoryProducts: { [key: string]: Product[] } = productsData as any;

/**
 * Obtiene los productos de una categoría específica por su slug
 */
export function getProductsByCategory(slug: string): Product[] {
  return mockCategoryProducts[slug] || [];
}

/**
 * Obtiene un producto individual mediante su ID buscándolo en todas las categorías.
 */
export function getProductById(id: string): Product | undefined {
  for (const category in mockCategoryProducts) {
    const product = mockCategoryProducts[category].find(p => p.id === id);
    if (product) return product;
  }
  return undefined;
}

/**
 * Obtiene todos los productos del sistema de forma plana (sin categorías).
 */
export function getAllProducts(): Product[] {
  return Object.values(mockCategoryProducts).flat();
}

