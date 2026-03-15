import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
      await fs.writeFile(PRODUCTS_PATH, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: 'Productos guardados correctamente' });
    }

    if (action === 'save_specs') {
      await fs.writeFile(SPECS_PATH, JSON.stringify(data, null, 2), 'utf8');
      return NextResponse.json({ success: true, message: 'Especificaciones guardadas correctamente' });
    }

    if (action === 'import_excel') {
      // In a real scenario, we'd use xlsx here. For now, we expect the client 
      // to have parsed it or we'd handle the buffer here.
      // Let's assume the client sends the parsed JSON for simplicity in this helper.
      const { products, specifications } = data;
      
      if (products) await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf8');
      if (specifications) await fs.writeFile(SPECS_PATH, JSON.stringify(specifications, null, 2), 'utf8');

      return NextResponse.json({ success: true, message: 'Importación completada' });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in Admin API:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const productsData = await fs.readFile(PRODUCTS_PATH, 'utf8');
    const specsData = await fs.readFile(SPECS_PATH, 'utf8');
    
    return NextResponse.json({
      products: JSON.parse(productsData),
      specifications: JSON.parse(specsData)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
