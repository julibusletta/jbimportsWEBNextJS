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

      // Si el administrador lo marca manualmente como APROBADO, le enviamos su comprobante.
      if (status === 'APPROVED') {
        const order = await db.getOrderById(orderId);
        if (order && order.userEmail) {
          try {
            const { mailer } = await import('@/lib/mailer');
            await mailer.sendPurchaseConfirmation(order.userEmail, order.userName || 'Cliente', order);
          } catch (e) {
            console.error('Error enviando mail de confirmación manual:', e);
          }
        }
      }

      return NextResponse.json({ success: true, message: 'Estado del pedido actualizado' });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('API Error [Orders POST]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
