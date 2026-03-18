import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Already exists
    }

    // Generate unique filename
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);
    console.log(`Archivo guardado en: ${path}`);

    const relativePath = `/uploads/products/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: relativePath 
    });
  } catch (error: any) {
    console.error('Error en upload:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
