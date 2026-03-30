import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure dedicated banner upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'banners');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Already exists
    }

    // Generate unique filename with .webp extension
    const filename = `banner-${uuidv4().substring(0, 8)}.webp`;
    const path = join(uploadDir, filename);

    // Process image with Sharp: Resize to max 1920 width, optimize and convert to webp
    console.log(`Procesando imagen: ${file.name}`);
    await sharp(buffer)
      .resize(1920, null, { withoutEnlargement: true }) // No agrandar si es pequeña
      .webp({ quality: 80 })
      .toFile(path);

    console.log(`Banner optimizado y guardado en: ${path}`);

    // Publicly accessible URL (relative)
    const relativePath = `/uploads/banners/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: relativePath 
    });
  } catch (error: any) {
    console.error('Error en upload-banner (sharp):', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
