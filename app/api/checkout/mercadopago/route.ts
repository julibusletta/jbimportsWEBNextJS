import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(request: Request) {
  try {
    const { items, total, orderId, shipping, email, phone, firstName, lastName } = await request.json();
    const { db } = await import('@/lib/db');
    const session = await getServerSession(authOptions);

    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ success: false, message: 'Mercado Pago no configurado' }, { status: 500 });
    }

    if (!total || total <= 0) {
      return NextResponse.json({ success: false, message: 'Monto inválido' }, { status: 400 });
    }

    const currentOrderId = orderId || `JB-${Date.now()}`;
    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // 1. Guardar la orden inicial en base de datos como PENDING
    const userName = `${firstName || ''} ${lastName || ''}`.trim() || session?.user?.name || 'Cliente Invitado';
    const userEmail = email || session?.user?.email || 'invitado@jbimports.com';

    await db.saveOrder({
      id: currentOrderId,
      userEmail,
      userName,
      items: items.map((item: any) => ({
        productId: item.id || item.productId,
        name: item.name?.trim() || 'Producto sin nombre',
        quantity: item.quantity,
        price: item.price
      })),
      userPhone: phone,
      total,
      status: 'PENDING',
      paymentMethod: 'MERCADOPAGO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: shipping ? {
        street: `${shipping.address.street} ${shipping.address.number}`,
        city: shipping.address.city,
        state: shipping.address.state,
        zip: shipping.address.zipCode,
        shippingCost: shipping.cost,
        shippingMethod: shipping.method
      } : undefined
    });

    // 2. Crear Preferencia de Mercado Pago
    const preferenceClient = new Preference(client);

    const preference = await preferenceClient.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id || item.productId,
          title: item.name?.trim() || 'Producto JB Imports',
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'ARS',
        })),
        payer: {
          email: userEmail,
          name: firstName || userName,
          surname: lastName || '',
        },
        back_urls: {
          success: `${baseUrl}/checkout/mercadopago/verify/${currentOrderId}`,
          pending: `${baseUrl}/checkout/mercadopago/verify/${currentOrderId}`,
          failure: `${baseUrl}/checkout`,
        },
        auto_return: 'approved',
        external_reference: currentOrderId,
        notification_url: `${baseUrl}/api/checkout/mercadopago/webhook`,
      }
    });

    return NextResponse.json({ 
      success: true, 
      orderId: currentOrderId,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point
    });

  } catch (error: any) {
    console.error('MercadoPago Checkout Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error?.message || 'Error procesando pago con Mercado Pago'
    }, { status: 500 });
  }
}
