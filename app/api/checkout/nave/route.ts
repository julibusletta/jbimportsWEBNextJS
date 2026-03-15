import { NextResponse } from 'next/server';

/**
 * API Route for Nave Negocios (Galicia) Integration
 * Handles authentication and payment intention creation for Sandbox/Production
 */

const NAVE_ENV = process.env.NAVE_ENV || 'sandbox';
const NAVE_TERMINAL_ID = process.env.NAVE_TERMINAL_ID;
const NAVE_CLIENT_ID = process.env.NAVE_CLIENT_ID;
const NAVE_CLIENT_SECRET = process.env.NAVE_CLIENT_SECRET;

// Endpoints
const AUTH_URL = NAVE_ENV === 'production' 
  ? 'https://auth.navenegocios.ar/oauth/token' 
  : 'https://nave-mrc-qa.us.auth0.com/oauth/token';

const CHECKOUT_URL = NAVE_ENV === 'production' 
  ? 'https://api.ranty.io/ecommerce/payment_request/external' 
  : 'https://e3-api.ranty.io/ecommerce/payment_request/external';

export async function POST(request: Request) {
  try {
    const { items, total, orderId } = await request.json();

    // 1. Validation
    if (!total || total <= 0) {
      return NextResponse.json({ success: false, message: 'Monto inválido' }, { status: 400 });
    }

    if (!NAVE_CLIENT_ID || !NAVE_CLIENT_SECRET) {
      // IF NO CREDENTIALS, Simulate a success for Testing purposes if in sandbox
      if (NAVE_ENV === 'sandbox') {
        console.warn('NAVE: Missing credentials. Simulating response for testing.');
        return NextResponse.json({ 
          success: true, 
          url: '/checkout-mock', // Redirect to our local mock page
          mock: true
        });
      }
      return NextResponse.json({ success: false, message: 'Configuración de Nave incompleta' }, { status: 500 });
    }

    // 2. Get Access Token
    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: NAVE_CLIENT_ID,
        client_secret: NAVE_CLIENT_SECRET,
        audience: NAVE_ENV === 'production' ? 'https://navenegocios.ar/external-checkout' : 'https://nave-mrc-qa.us.auth0.com/api/v2/', // Audience may vary
        grant_type: 'client_credentials',
      }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      throw new Error(`Auth failed: ${errorData.error_description || authResponse.statusText}`);
    }

    const { access_token } = await authResponse.json();

    // 3. Create Payment Intention
    const paymentBody = {
      amount: total,
      currency: "ARS",
      description: `Pedido ${orderId || 'JB-' + Date.now()}`,
      reference: orderId || `order_${Date.now()}`,
      callback_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/checkout/nave/webhook`,
      items: items.map((item: any) => ({
        description: item.name,
        quantity: item.quantity,
        unit_amount: item.price
      }))
    };

    const checkoutResponse = await fetch(CHECKOUT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Terminal-Id': NAVE_TERMINAL_ID || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentBody),
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      throw new Error(`Checkout failed: ${errorText}`);
    }

    const checkoutData = await checkoutResponse.json();

    // 4. Return the checkout URL
    return NextResponse.json({ 
      success: true, 
      url: checkoutData.url || checkoutData.checkout_url,
      id: checkoutData.id 
    });

  } catch (error: any) {
    console.error('Nave Integration Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
