import { NextResponse } from 'next/server';
import { logToFile } from '@/lib/logger';

/**
 * Webhook for Nave Negocios payment status notifications
 * Nave sends a POST request to this endpoint when a payment status changes
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the received notification for debugging
    logToFile('NAVE WEBHOOK RECEIVED:', body);

    const { reference, external_payment_id, status } = body;
    const orderId = reference || external_payment_id;

    if (!orderId) {
      logToFile('NAVE WEBHOOK: Missing order reference');
      return NextResponse.json({ success: false, message: 'Missing reference or external_payment_id' }, { status: 400 });
    }

    logToFile(`NAVE WEBHOOK: Processing order ${orderId} with status ${status}`);

    // Update the database
    const { db } = await import('@/lib/db');
    
    // Normalize status to uppercase for comparison
    const normalizedStatus = status?.toString().toUpperCase();

    await db.updateOrderStatus(orderId, normalizedStatus as any, body.id);
    logToFile(`NAVE WEBHOOK: Order ${orderId} status updated to ${normalizedStatus} in DB`);

    // If payment is approved, send confirmation email
    if (normalizedStatus === 'APPROVED') {
      const order = await db.getOrderById(orderId);
      if (order) {
        logToFile(`NAVE WEBHOOK: Attempting to send email to ${order.userEmail} for order ${orderId}`);
        try {
          const { mailer } = await import('@/lib/mailer');
          // Fire and forget (with logging inside mailer)
          mailer.sendPurchaseConfirmation(order.userEmail, order.userName, order).catch(e => {
            logToFile(`ASYNC EMAIL ERROR for ${order.userEmail}:`, e.message);
          });
          logToFile(`NAVE WEBHOOK: Triggered background email sending for ${order.userEmail}`);
        } catch (mailError: any) {
          logToFile(`NAVE WEBHOOK ERROR importing mailer:`, mailError.message);
        }
      } else {
        logToFile(`NAVE WEBHOOK ERROR: Order ${orderId} not found in DB after update`);
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ success: true });

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
