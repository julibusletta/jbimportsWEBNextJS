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

    const { reference, status } = body;

    if (!reference) {
      return NextResponse.json({ success: false, message: 'Missing reference' }, { status: 400 });
    }

    // Here you would typically update your database with the payment status
    console.log(`Order ${reference} updated to status: ${status}`);

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
