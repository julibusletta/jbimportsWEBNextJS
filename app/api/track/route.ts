import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const rawCity = request.headers.get('x-vercel-ip-city');
    // Si viene la ciudad, intenta normalizarla (por defecto es en inglés ej: "Cordoba")
    const city = rawCity ? decodeURIComponent(rawCity) : 'Ubicación oculta';
    
    await db.incrementVisit(city);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
