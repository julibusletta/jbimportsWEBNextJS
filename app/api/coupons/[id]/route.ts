import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CouponModel from '@/models/Coupon';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    if (body.code) {
      body.code = body.code.toUpperCase().trim();
    }
    
    await dbConnect();
    const updated = await CouponModel.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await CouponModel.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
