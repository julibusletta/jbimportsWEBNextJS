import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const { packId, title, price, shippingMethod, shippingAddress } = await request.json();
    const { db } = await import('@/lib/db');
    const session = await getServerSession(authOptions);

    if (!price || price <= 0) {
      return NextResponse.json({ success: false, message: 'Monto inválido' }, { status: 400 });
    }

    const currentOrderId = `FIG-${Date.now()}`;
    const userName = session?.user?.name || 'Cliente Invitado (Figuritas)';
    const userEmail = session?.user?.email || 'invitado@jbimports.com';

    const orderData = {
      id: currentOrderId,
      userEmail,
      userName,
      items: [
        {
          productId: packId,
          name: title,
          quantity: 1,
          price: price
        }
      ],
      userPhone: '',
      total: price,
      status: 'PENDING',
      paymentMethod: 'TRANSFERENCIA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Envío a acordar para figuritas
      shippingAddress: shippingAddress ? {
        street: shippingAddress.street || 'A coordinar',
        city: shippingAddress.city || 'A coordinar',
        state: shippingAddress.state || 'A coordinar',
        zip: shippingAddress.zip || '0000',
        shippingCost: 0,
        shippingMethod: shippingMethod || 'via_cargo'
      } : {
        street: 'A coordinar',
        city: 'A coordinar',
        state: 'A coordinar',
        zip: '0000',
        shippingCost: 0,
        shippingMethod: 'envio_acordar'
      }
    };

    await db.saveOrder(orderData);

    // Intentamos enviar el email si existe el mailer, pero si falla no bloqueamos.
    try {
      const { mailer } = await import('@/lib/mailer');
      await mailer.sendTransferOrderReceived(userEmail, userName, orderData);
    } catch (mailError) {
      console.error('Failed to send transfer confirmation email for figuritas:', mailError);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: currentOrderId
    });

  } catch (error: any) {
    console.error('Figuritas Checkout Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
