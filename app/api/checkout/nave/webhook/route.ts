import { NextResponse } from 'next/server';

/**
 * Webhook for Nave Negocios payment status notifications
 * Nave sends a POST request to this endpoint when a payment status changes
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log the received notification for debugging
    console.log('NAVE WEBHOOK RECEIVED:', JSON.stringify(body, null, 2));

    /**
     * Typical structure:
     * {
     *   "id": "payment_id",
     *   "reference": "your_order_id",
     *   "status": "APPROVED",
     *   "amount": 1000.00,
     *   ...
     * }
     */

    const { reference, external_payment_id, status } = body;
    const orderId = reference || external_payment_id;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Missing reference or external_payment_id' }, { status: 400 });
    }

    // Update the database
    const { db } = await import('@/lib/db');
    await db.updateOrderStatus(orderId, status as any, body.id);

    // If payment is approved, send confirmation email
    if (status === 'APPROVED') {
      const order = await db.getOrderById(orderId);
      if (order) {
        const { mailer } = await import('@/lib/mailer');
        await mailer.sendPurchaseConfirmation(order.userEmail, order.userName, order);
      }
    }

    console.log(`Order ${orderId} updated to status: ${status}`);

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Nave Webhook Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Optionally handle GET for validation tests if needed by the provider
export async function GET() {
  return new Response('Webhook endpoint active', { status: 200 });
}
