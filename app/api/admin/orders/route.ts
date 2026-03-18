import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const orders = await db.getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error('API Error [Orders GET]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, orderId, status } = await request.json();

    if (action === 'update_status') {
      await db.updateOrderStatus(orderId, status);
      return NextResponse.json({ success: true, message: 'Estado del pedido actualizado' });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('API Error [Orders POST]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
