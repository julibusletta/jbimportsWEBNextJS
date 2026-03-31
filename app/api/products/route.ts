import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    await dbConnect();
    
    let query: any = {};
    
    // Category mapping for parent categories
    const categoryMapping: { [key: string]: string[] } = {
      'celulares': ['celulares', 'samsung', 'xiaomi', 'motorola', 'realme', 'iphone'],
      'apple': ['apple', 'iphone', 'macbook', 'watch', 'ipad', 'airpods'],
      'jbl': ['jbl', 'parlantes', 'auriculares', 'sounds-bars'],
      'smart-home': ['smart-home', 'amazon', 'google', 'xiaomi-home', 'aspiradoras-robot', 'camaras-seguridad'],
      'smart-watches': ['smart-watches', 'xiaomi-watches', 'watch'],
      'notebooks': ['notebooks', 'macbook'],
      'notebooks-y-tablets': ['notebooks', 'macbook', 'tablets']
    };

    if (category === 'ofertas') {
      // Special "Ofertas" category: all products with a discount + featured IDs
      query = { 
        $or: [
          { discount: { $gt: 0 } },
          { id: { $in: ['378', '1339'] } }
        ]
      };
    } else if (category && categoryMapping[category.toLowerCase().trim()]) {
      // If it's a parent category, include all children
      query = { category: { $in: categoryMapping[category.toLowerCase().trim()] } };
    } else if (category) {
      // Standard case-insensitive match for specific subcategories
      // Trimming and using a simple equality or regex
      const cleanCategory = category.trim();
      query = { category: { $regex: cleanCategory, $options: 'i' } };
    }
    
    // Always hide unpublished products from the frontend unless it's explicitly stated
    query.published = { $ne: false };
    
    const products = await ProductModel.find(query).lean();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
