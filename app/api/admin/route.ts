import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';

/**
 * API Route for Admin operations (Save changes, Import Excel)
 */

const PRODUCTS_PATH = path.join(process.cwd(), 'data', 'products.json');
const SPECS_PATH = path.join(process.cwd(), 'data', 'specifications.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'save_products') {
      // Save to MongoDB
      const productsArray = Object.values(data).flat();
      await db.saveProducts(productsArray);

      // Backup to JSON
      await fs.writeFile(PRODUCTS_PATH, JSON.stringify(data, null, 2), 'utf8');
      
      return NextResponse.json({ success: true, message: 'Productos guardados correctamente en DB y JSON' });
    }

    if (action === 'save_specs') {
      await fs.writeFile(SPECS_PATH, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: 'Especificaciones guardadas correctamente' });
    }

    if (action === 'import_excel') {
      const { products, specifications } = data;
      
      if (products) {
        // Save to MongoDB
        await db.saveProducts(products);
        
        // Convert array back to categoried object for JSON backup if possible
        // Or just save the array. For now, let's keep it simple.
        await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf8');
      }
      
      if (specifications) await fs.writeFile(SPECS_PATH, JSON.stringify(specifications, null, 2), 'utf8');

      return NextResponse.json({ success: true, message: 'Importación completada en MongoDB' });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in Admin API:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Try to get from MongoDB first
    const mongoProducts = await db.getProducts();
    
    // Group products by category for the frontend
    const productsByCategory: Record<string, any[]> = {};
    mongoProducts.forEach(p => {
      if (!productsByCategory[p.category]) {
        productsByCategory[p.category] = [];
      }
      productsByCategory[p.category].push(p);
    });

    let specsData = '[]';
    try {
      specsData = await fs.readFile(SPECS_PATH, 'utf8');
    } catch (e) {
      console.warn('Specs file not found, using empty array');
    }
    
    return NextResponse.json({
      products: mongoProducts.length > 0 ? productsByCategory : {},
      specifications: JSON.parse(specsData)
    });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
