// Interfaz para la categoría (mantenida para tipos)
export interface Category {
  id: string;
  name: string;
  image: string;
  isMain: boolean;
  slug: string;
  description: string;
}

/**
 * Obtiene todas las categorías
 */
export const getAllCategories = async (): Promise<Category[]> => {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/categories');
    return res.json();
  }

  const dbConnect = (await import('../mongodb')).default;
  const CategoryModel = (await import('../../models/Category')).default;
  await dbConnect();
  return CategoryModel.find({}).lean();
};

/**
 * Obtiene la categoría principal
 */
export const getMainCategory = async (): Promise<Category | null> => {
  if (typeof window !== 'undefined') {
    const categories = await getAllCategories();
    return categories.find(c => c.isMain) || null;
  }

  const dbConnect = (await import('../mongodb')).default;
  const CategoryModel = (await import('../../models/Category')).default;
  await dbConnect();
  return CategoryModel.findOne({ isMain: true }).lean();
};

/**
 * Obtiene las categorías secundarias
 */
export const getSecondaryCategories = async (): Promise<Category[]> => {
  if (typeof window !== 'undefined') {
    const categories = await getAllCategories();
    return categories.filter(c => !c.isMain);
  }

  const dbConnect = (await import('../mongodb')).default;
  const CategoryModel = (await import('../../models/Category')).default;
  await dbConnect();
  return CategoryModel.find({ isMain: false }).lean();
};

/**
 * Obtiene una categoría por ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  if (typeof window !== 'undefined') {
    const categories = await getAllCategories();
    return categories.find(c => c.id === id) || null;
  }

  const dbConnect = (await import('../mongodb')).default;
  const CategoryModel = (await import('../../models/Category')).default;
  await dbConnect();
  return CategoryModel.findOne({ id }).lean();
};

/**
 * Obtiene una categoría por slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (typeof window !== 'undefined') {
    const categories = await getAllCategories();
    return categories.find(c => c.slug === slug) || null;
  }

  const dbConnect = (await import('../mongodb')).default;
  const CategoryModel = (await import('../../models/Category')).default;
  await dbConnect();
  return CategoryModel.findOne({ slug }).lean();
};

/**
 * Busca categorías por nombre
 */
export const searchCategories = async (query: string): Promise<Category[]> => {
  if (typeof window !== 'undefined') {
    const categories = await getAllCategories();
    const lowerQuery = query.toLowerCase();
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(lowerQuery) ||
      cat.description.toLowerCase().includes(lowerQuery)
    );
  }

  const dbConnect = (await import('../mongodb')).default;
  const CategoryModel = (await import('../../models/Category')).default;
  await dbConnect();
  const lowerQuery = query.toLowerCase();
  return CategoryModel.find({
    $or: [
      { name: { $regex: lowerQuery, $options: 'i' } },
      { description: { $regex: lowerQuery, $options: 'i' } }
    ]
  }).lean();
};
