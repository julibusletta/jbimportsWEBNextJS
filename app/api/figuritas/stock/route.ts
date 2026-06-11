import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FiguritasStock from '@/models/FiguritasStock';

const INITIAL_STOCK: Record<string, number> = {
  'album-25': 25,
  'pack-100': 91,
  'pack-500': 47,
  'bulto-1000': 18
};

export async function GET() {
  try {
    await dbConnect();
    let stocks = await FiguritasStock.find({});
    
    // Si la base está vacía, inicializamos el stock
    if (stocks.length === 0) {
      for (const [packId, stock] of Object.entries(INITIAL_STOCK)) {
        await FiguritasStock.create({ packId, stock });
      }
      stocks = await FiguritasStock.find({});
    }

    const stockMap = stocks.reduce((acc: any, s: any) => {
      acc[s.packId] = s.stock;
      return acc;
    }, {});

    return NextResponse.json({ success: true, stockMap });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
