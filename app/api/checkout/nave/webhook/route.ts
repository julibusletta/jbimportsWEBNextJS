import { NextResponse } from 'next/server';
import { logToFile } from '@/lib/logger';

/**
 * Webhook for Nave Negocios payment status notifications
 * Nave sends a POST request to this endpoint when a payment status changes
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => { headers[key] = value; });

    const { db } = await import('@/lib/db');

    // 1. Log the webhook to MongoDB (Persistent across Vercel instances)
    await db.logWebhook('NAVE', 'POST', body, headers);
    logToFile('NAVE WEBHOOK RECEIVED (PERSISTED TO DB)');

    const { reference, external_payment_id, status } = body;
    const orderId = reference || external_payment_id;

    if (!orderId) {
      logToFile('NAVE WEBHOOK: Missing order reference');
      return NextResponse.json({ success: false, message: 'Missing reference or external_payment_id' }, { status: 400 });
    }

    // 2. Normalize status
    const rawStatus = status?.toString() || '';
    let normalizedStatus = rawStatus.toUpperCase();

    // Mapping for Nave payment success statuses (Production uses APPROVED, Sandbox might vary)
    const successStatuses = ['PAID', 'PAGADO', 'SUCCESS', 'COMPLETED', 'APPROVED', 'APROBADA'];
    if (successStatuses.includes(normalizedStatus)) {
      normalizedStatus = 'APPROVED';
    } else if (['REJECTED', 'RECHAZADA', 'FAILED', 'FALLIDA'].includes(normalizedStatus)) {
      normalizedStatus = 'REJECTED';
    }

    // 3. Update the database
    const naveInternalId = body.id || body.payment_id;
    await db.updateOrderStatus(orderId, normalizedStatus as any, naveInternalId);
    
    // 4. If payment is approved, send confirmation email
    if (normalizedStatus === 'APPROVED') {
      const order = await db.getOrderById(orderId);
      if (order && order.userEmail) {
        try {
          const { mailer } = await import('@/lib/mailer');
          await mailer.sendPurchaseConfirmation(order.userEmail, order.userName, order);
          await db.logWebhook('NAVE_EMAIL_SENT', 'POST', { orderId, email: order.userEmail });
        } catch (mailError: any) {
          console.error(`WEBHOOK EMAIL ERROR for ${orderId}:`, mailError.message);
          await db.logWebhook('NAVE_EMAIL_ERROR', 'POST', { orderId, error: mailError.message });
        }
      }
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error('Nave Webhook Fatal Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// If a user hits this via GET (Nave redirecting browser here), redirect to store
export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return Response.redirect(`${baseUrl}/mi-cuenta/compras`);
}
