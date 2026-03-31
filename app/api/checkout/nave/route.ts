import { NextResponse } from 'next/server';

/**
 * API Route for Nave Negocios (Galicia) Integration
 * Handles authentication and payment intention creation for Sandbox/Production
 */

const NAVE_ENV = (process.env.NAVE_ENV || 'sandbox').trim();
const NAVE_TERMINAL_ID = (process.env.NAVE_TERMINAL_ID || '').trim();
const NAVE_CLIENT_ID = (process.env.NAVE_CLIENT_ID || '').trim();
const NAVE_CLIENT_SECRET = (process.env.NAVE_CLIENT_SECRET || '').trim();

// Endpoints according to official manual:
const AUTH_URL = NAVE_ENV === 'production' 
  ? 'https://services.apinaranja.com/security-ms/api/security/auth0/b2b/m2ms' 
  : 'https://homoservices.apinaranja.com/security-ms/api/security/auth0/b2b/m2ms';

const CHECKOUT_URL = NAVE_ENV === 'production' 
  ? 'https://api.ranty.io/api/payment_request/ecommerce' 
  : 'https://api-sandbox.ranty.io/api/payment_request/ecommerce';

const NAVE_AUDIENCE = 'https://naranja.com/ranty/merchants/api';

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
export async function POST(request: Request) {
  const { db } = await import('@/lib/db');
  let currentOrderId = 'unknown';
  
  try {
    const body = await request.json();
    const { items, total, orderId, shipping, email, firstName, lastName, dni, paymentMode } = body;
    currentOrderId = orderId || `JB-${Date.now()}`;

    // 1. Log Entry
    await db.logWebhook('NAVE_CHECKOUT_START', 'POST', { orderId: currentOrderId, env: NAVE_ENV, total });

    // 2. Base URL Calculation for callbacks
    const host = request.headers.get('host') || '';
    let baseUrl = `https://${host}`;
    if (host.includes('localhost')) baseUrl = 'http://localhost:3000';
    if (process.env.NEXTAUTH_URL && !host) baseUrl = process.env.NEXTAUTH_URL;
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    // 3. Authenticate with Nave (M2M)
    const authBody = {
      client_id: NAVE_CLIENT_ID,
      client_secret: NAVE_CLIENT_SECRET,
      audience: NAVE_AUDIENCE,
      grant_type: 'client_credentials',
    };

    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authBody),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      await db.logWebhook('NAVE_AUTH_ERROR', 'POST', { status: authResponse.status, error: errorText });
      throw new Error(`Authentication failed: ${errorText}`);
    }

    const { access_token } = await authResponse.json();
    if (!access_token) throw new Error('No access token received from Nave');

    // 4. Create Payment Request
    const instCount = paymentMode === 'CUOTAS' ? 6 : 1;
    const paymentBody = {
      external_payment_id: currentOrderId,
      seller: { pos_id: NAVE_TERMINAL_ID },
      // Optional: configuration at root level for global session override
      configurations: {
        installments: [instCount]
      },
      transactions: [{
        amount: { currency: "ARS", value: total.toFixed(2).toString() },
        // Use both [array] and integer format to attempt override of merchant dashboard settings
        installments: instCount, 
        allowed_installments: [instCount],
        products: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: { currency: "ARS", value: item.price.toFixed(2).toString() }
        }))
      }],
      additional_info: {
        callback_url: `${baseUrl}/api/checkout/nave/webhook`,
        back_url: `${baseUrl}/mi-cuenta/compras`,
        external_reference: currentOrderId,
        success_url: `${baseUrl}/mi-cuenta/compras`,
        cancel_url: `${baseUrl}/`
      },
      duration_time: 3600
    };

    // Standard headers only
    const cleanToken = access_token.trim();
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Terminal-Id': NAVE_TERMINAL_ID,
    };

    const checkoutResponse = await fetch(CHECKOUT_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(paymentBody),
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      await db.logWebhook('NAVE_CHECKOUT_ERROR', 'POST', { 
        status: checkoutResponse.status, 
        error: JSON.stringify(checkoutData),
        orderId: currentOrderId
      });
      throw new Error(`Checkout failed: ${JSON.stringify(checkoutData)}`);
    }

    // 5. Success Logging & Persistence
    await db.logWebhook('NAVE_CHECKOUT_SUCCESS', 'POST', { orderId: currentOrderId, checkoutId: checkoutData.id });

    const userName = `${firstName || ''} ${lastName || ''}`.trim() || 'Cliente Invitado';
    const userEmail = email || 'invitado@jbimports.com';

    await db.saveOrder({
      id: currentOrderId,
      userEmail,
      userName,
      items: items.map((item: any) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total,
      status: 'PENDING',
      paymentMethod: 'NAVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      navePaymentId: checkoutData.id,
      paymentMode: paymentMode || 'NORMAL',
      dni: dni || '',
      shippingAddress: shipping ? {
        street: `${shipping.address.street} ${shipping.address.number}`,
        city: shipping.address.city,
        state: shipping.address.state,
        zip: shipping.address.zipCode,
        shippingCost: shipping.cost,
        shippingMethod: shipping.method
      } : undefined
    });

    return NextResponse.json({ 
      success: true, 
      url: checkoutData.url || checkoutData.checkout_url, 
      id: checkoutData.id 
    });

  } catch (error: any) {
    console.error('Nave Reset Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
