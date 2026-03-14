import { mockCategoriesData } from './mockCategories';

// Interfaz para la categoría
export interface Category {
  id: string;
  name: string;
  image: string;
  isMain: boolean;
  slug: string;
  description: string;
}

// Simulación de llamadas a API usando datos mock
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene todas las categorías
 */
export const getAllCategories = async (): Promise<Category[]> => {
  await delay(300);
  return mockCategoriesData.categories;
};

/**
 * Obtiene la categoría principal
 */
export const getMainCategory = async (): Promise<Category | null> => {
  await delay(300);
  return mockCategoriesData.categories.find(cat => cat.isMain) || null;
};

/**
 * Obtiene las categorías secundarias
 */
export const getSecondaryCategories = async (): Promise<Category[]> => {
  await delay(300);
  return mockCategoriesData.categories.filter(cat => !cat.isMain);
};

/**
 * Obtiene una categoría por ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  await delay(300);
  return mockCategoriesData.categories.find(cat => cat.id === id) || null;
};

/**
 * Obtiene una categoría por slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  await delay(300);
  return mockCategoriesData.categories.find(cat => cat.slug === slug) || null;
};

/**
 * Busca categorías por nombre
 */
export const searchCategories = async (query: string): Promise<Category[]> => {
  await delay(300);
  const lowerQuery = query.toLowerCase();
  return mockCategoriesData.categories.filter(cat =>
    cat.name.toLowerCase().includes(lowerQuery) ||
    cat.description.toLowerCase().includes(lowerQuery)
  );
};
