import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    if (topic === 'payment' && id) {
      const paymentClient = new Payment(client);
      const paymentInfo = await paymentClient.get({ id: id as string });
      
      const orderId = paymentInfo.external_reference;
      
      if (orderId) {
        const { db } = await import('@/lib/db');
        
        if (paymentInfo.status === 'approved') {
          // Actualizamos la orden a aprobada
          await db.updateOrderStatus(orderId, 'APPROVED');
          
          // También podemos guardar el ID de pago de MP
          const Order = (await import('@/models/Order')).default;
          await Order.findOneAndUpdate({ id: orderId }, { mpPaymentId: id });

          // Podríamos enviar el mail de confirmación aquí
        } else if (paymentInfo.status === 'rejected' || paymentInfo.status === 'cancelled') {
          await db.updateOrderStatus(orderId, 'REJECTED');
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('MercadoPago Webhook Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
