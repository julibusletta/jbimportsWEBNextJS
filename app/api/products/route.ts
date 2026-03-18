import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    await dbConnect();
    
    let query = {};
    if (category) {
      // Use regex for partial, case-insensitive match (e.g., "iphone" matches "iphones usados")
      query = { category: { $regex: category, $options: 'i' } };
    }
    
    const products = await ProductModel.find(query).lean();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
