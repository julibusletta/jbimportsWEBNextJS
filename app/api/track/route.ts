import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const city = request.headers.get('x-vercel-ip-city');
    const regionCode = request.headers.get('x-vercel-ip-country-region');
    const countryCode = request.headers.get('x-vercel-ip-country');

    let location = 'Ubicación oculta';

    if (city) {
      location = decodeURIComponent(city);
    } else if (regionCode && countryCode === 'AR') {
      // Mapper simple para provincias argentinas comunes
      const provinceMap: Record<string, string> = {
        'B': 'Buenos Aires (Prov)',
        'C': 'CABA',
        'S': 'Santa Fe (Prov)',
        'X': 'Córdoba (Prov)',
        'M': 'Mendoza (Prov)',
        'T': 'Tucumán (Prov)',
        'E': 'Entre Ríos (Prov)',
        'W': 'Corrientes (Prov)',
        'N': 'Misiones (Prov)',
        'J': 'San Juan (Prov)',
        'D': 'San Luis (Prov)',
        'K': 'Catamarca (Prov)',
        'H': 'Chaco (Prov)',
        'P': 'Formosa (Prov)',
        'Y': 'Jujuy (Prov)',
        'F': 'La Rioja (Prov)',
        'L': 'La Pampa (Prov)',
        'M': 'Mendoza (Prov)',
        'Q': 'Neuquén (Prov)',
        'R': 'Río Negro (Prov)',
        'A': 'Salta (Prov)',
        'Z': 'Santa Cruz (Prov)',
        'G': 'Sgo. del Estero',
        'V': 'Tierra del Fuego'
      };
      location = provinceMap[regionCode] || `Provincia (${regionCode})`;
    } else if (countryCode) {
      location = countryCode === 'AR' ? 'Argentina (País)' : `País: ${countryCode}`;
    }
    
    await db.incrementVisit(location);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
