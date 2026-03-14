import { mockProductsData } from './mockProducts';

// Interfaz para el producto
export interface Product {
    id: string;
    name: string;
    brand: string;
    sku: string;
    price: number;
    discountPercentage: number;
    description: string;
    imageUrls: string[];
    category: string;
    discountBase: boolean;
}

// Simulación de llamadas a API usando datos mock
// En producción, esto haría fetch real a un servidor

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllPromotionProducts = async (): Promise<Product[]> => {
    await delay(300);
    // Retorna solo productos con descuento
    return [...mockProductsData.bombas, ...mockProductsData.nuevas].filter(p => p.discountBase);
};

export const getProductsBySection = async (section: 'bombas' | 'nuevas'): Promise<Product[]> => {
    await delay(300);
    return mockProductsData[section];
};

export const getProductByCategory = async (
    category: string,
    search: string = '',
    page: number = 1,
    pageSize: number = 200
): Promise<Product[]> => {
    await delay(300);
    const allProducts = [...mockProductsData.bombas, ...mockProductsData.nuevas];
    return allProducts.filter(product =>
        product.category.toLowerCase().includes(category.toLowerCase()) &&
        product.name.toLowerCase().includes(search.toLowerCase())
    );
};

export const getAllProducts = async (
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    minPrice?: number,
    maxPrice?: number,
    minStock?: number,
    sortField?: string,
    sortDirection?: string
): Promise<{ items: Product[]; totalCount: number }> => {
    await delay(300);
    let products = [...mockProductsData.bombas, ...mockProductsData.nuevas];

    // Aplicar filtros
    if (search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (minPrice !== undefined) {
        products = products.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
        products = products.filter(p => p.price <= maxPrice);
    }

    // Aplicar ordenamiento
    if (sortField) {
        products.sort((a, b) => {
            const aVal = (a as any)[sortField];
            const bVal = (b as any)[sortField];
            if (sortDirection === 'desc') {
                return bVal - aVal;
            }
            return aVal - bVal;
        });
    }

    // Paginación
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        items: products.slice(start, end),
        totalCount: products.length,
    };
};

export const getAllPublic = async (
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    minPrice?: number,
    maxPrice?: number,
    minStock?: number,
    sortField?: string,
    sortDirection?: string
): Promise<{ items: Product[]; totalCount: number }> => {
    return getAllProducts(search, page, pageSize, minPrice, maxPrice, minStock, sortField, sortDirection);
};

export const getProductById = async (id: string | number): Promise<Product | null> => {
    await delay(300);
    const allProducts = [...mockProductsData.bombas, ...mockProductsData.nuevas];
    return allProducts.find(p => p.id === String(id)) || null;
};

export const getPublicProductById = async (id: string | number): Promise<Product | null> => {
    return getProductById(id);
};

export const getAllServices = async (
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    minPrice?: number,
    maxPrice?: number,
    minStock?: number,
    sortField?: string,
    sortDirection?: string
): Promise<{ items: Product[]; totalCount: number }> => {
    return getAllProducts(search, page, pageSize, minPrice, maxPrice, minStock, sortField, sortDirection);
};

export const getAllPublicServices = async (): Promise<{ items: Product[]; totalCount: number }> => {
    await delay(300);
    const products = [...mockProductsData.bombas, ...mockProductsData.nuevas];
    return {
        items: products,
        totalCount: products.length,
    };
};

// Funciones adicionales (no implementadas en mock pero disponibles para extensión)
export const createProduct = async (productData: any) => {
    throw new Error('No disponible en modo mock');
};

export const updateProduct = async (id: string | number, productData: any) => {
    throw new Error('No disponible en modo mock');
};

export const deleteProduct = async (id: string | number) => {
    throw new Error('No disponible en modo mock');
};

export const importProductsFromExcel = (formData: FormData) => {
    throw new Error('No disponible en modo mock');
};

export const exportProductsToExcel = async () => {
    throw new Error('No disponible en modo mock');
};
