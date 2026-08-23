import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const session = await getServerSession(authOptions);
    const { db } = await import('@/lib/db');

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'ID de orden no proporcionado' }, { status: 400 });
    }

    const Order = (await import('@/models/Order')).default;
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }

    // Opcional: proteger acceso si no es admin y no es el dueño de la orden
    // if (session?.user?.role !== 'ADMIN' && order.userEmail !== session?.user?.email) { ... }

    // MercadoPago no tiene una forma sencilla de buscar por external_reference en el SDK v2 sin usar Search
    // Así que si la orden ya está APPROVED por el webhook, devolvemos eso.
    if (order.status === 'APPROVED') {
      return NextResponse.json({ success: true, status: 'approved', message: 'Pago aprobado' });
    }

    // Retornamos el estado actual
    return NextResponse.json({ success: true, status: order.status.toLowerCase(), message: 'Estado actual' });

  } catch (error: any) {
    console.error('MercadoPago Verify Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
