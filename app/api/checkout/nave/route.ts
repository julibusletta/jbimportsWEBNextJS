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
  ? 'https://api.ranty.io/api/payment_requests' 
  : 'https://api-sandbox.ranty.io/api/payment_requests';

const NAVE_AUDIENCE = 'https://naranja.com/ranty/merchants/api';

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
export async function POST(request: Request) {
  try {
    const { items, total, orderId, shipping, email, firstName, lastName } = await request.json();
    const { db } = await import('@/lib/db');

    // Ensure we have a valid public URL for Nave's callback
    const host = request.headers.get('host') || '';
    let baseUrl = process.env.NEXTAUTH_URL || '';
    
    // If we're on Vercel, use the VERCEL_URL as a fallback if the host is problematic
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
    const isLocalhost = host.includes('localhost');

    if (host && !isLocalhost) {
      baseUrl = `https://${host}`;
    } else if (vercelUrl) {
      baseUrl = vercelUrl;
    } else if (!baseUrl || isLocalhost) {
      baseUrl = 'http://localhost:3000';
    }
    
    // Clean trailing slash
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    
    // Log for debugging
    await db.logWebhook('NAVE_DEBUG', 'POST', { host, baseUrl, vercelUrl, env: NAVE_ENV });
    const session = await getServerSession(authOptions);

    const currentOrderId = orderId || `JB-${Date.now()}`;

    // 1. Validation & Header Sanitization
    if (!total || total <= 0) {
      return NextResponse.json({ success: false, message: 'Monto inválido' }, { status: 400 });
    }

    if (!NAVE_CLIENT_ID || !NAVE_CLIENT_SECRET) {
      // IF NO CREDENTIALS, Simulate a success for Testing purposes if in sandbox
      if (NAVE_ENV === 'sandbox') {
        const { db } = await import('@/lib/db');
        await db.saveOrder({
          id: currentOrderId,
          userEmail: email || 'invitado@jbimports.com',
          userName: `${firstName} ${lastName}`.trim() || 'Cliente Invitado',
          items: items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          navePaymentId: `mock_${Date.now()}`,
        });

        console.warn('NAVE: Missing credentials. Simulating response for testing.');
        return NextResponse.json({ 
          success: true, 
          url: `${baseUrl}/checkout-mock?paymentId=mock_${Date.now()}&orderId=${currentOrderId}`, 
          mock: true
        });
      }
      return NextResponse.json({ success: false, message: 'Configuración de Nave incompleta' }, { status: 500 });
    }

    // 2. Get Access Token
    const authBody = {
      client_id: NAVE_CLIENT_ID,
      client_secret: NAVE_CLIENT_SECRET,
      audience: NAVE_AUDIENCE, 
      grant_type: 'client_credentials',
    };
    
    console.log(`NAVE AUTH ATTEMPT:`, {
      url: AUTH_URL,
      audience: NAVE_AUDIENCE,
      clientId: NAVE_CLIENT_ID?.substring(0, 5) + '...'
    });

    const authResponse = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authBody),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error(`NAVE AUTH ERROR (${authResponse.status}):`, errorText);
      // Log the full response for deep debugging
      throw new Error(`Auth failed: ${errorText}`);
    }

    let authData;
    const authRaw = await authResponse.text();
    try {
      authData = JSON.parse(authRaw);
    } catch (e) {
      console.error('NAVE AUTH JSON PARSE ERROR:', authRaw);
      throw new Error(`Nave Auth returned invalid JSON: ${authRaw.substring(0, 50)}...`);
    }

    const { access_token } = authData;

    // 3. Create Payment Intention
    const paymentBody = {
      external_payment_id: orderId || `order_${Date.now()}`,
      seller: {
        pos_id: NAVE_TERMINAL_ID || ''
      },
      transactions: [
        {
          amount: {
            currency: "ARS",
            value: total.toFixed(2).toString()
          },
          products: items.map((item: any) => ({
            name: item.name,
            description: item.name,
            quantity: item.quantity,
            unit_price: {
              currency: "ARS",
              value: item.price.toFixed(2).toString()
            }
          }))
        }
      ],
      additional_info: {
        callback_url: `${baseUrl}/api/checkout/nave/webhook`,
        back_url: `${baseUrl}/mi-cuenta/compras?verify=${orderId || `order_${Date.now()}`}`,
        external_reference: orderId || `order_${Date.now()}`,
        success_url: `${baseUrl}/mi-cuenta/compras`,
        cancel_url: `${baseUrl}/`
      },
      duration_time: 3600 // 1 hour expiration
    };

    // Log the outgoing request for tracing
    await db.logWebhook('NAVE_OUTGOING', 'POST', { 
      orderId: paymentBody.external_payment_id,
      callback_url: paymentBody.additional_info.callback_url,
      total: paymentBody.transactions[0].amount.value 
    }, { url: CHECKOUT_URL });

    console.log(`NAVE: Creating payment intention with ${CHECKOUT_URL} and callback ${paymentBody.additional_info.callback_url}`);
    const checkoutResponse = await fetch(CHECKOUT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentBody),
    });

    if (!checkoutResponse.ok) {
      const errorText = await checkoutResponse.text();
      console.error(`NAVE CHECKOUT ERROR (${checkoutResponse.status}):`, errorText);
      throw new Error(`Checkout failed: ${errorText}`);
    }

    let checkoutData;
    const checkoutRaw = await checkoutResponse.text();
    try {
      checkoutData = JSON.parse(checkoutRaw);
    } catch (e) {
      console.error('NAVE CHECKOUT JSON PARSE ERROR:', checkoutRaw);
      throw new Error(`Nave Checkout returned invalid JSON: ${checkoutRaw.substring(0, 50)}...`);
    }

    // 4. Persistence: Save the order as PENDING
    
    // Get user info: prefer explicit fields from checkout form, then session, then fallback
    const userName = `${firstName || ''} ${lastName || ''}`.trim() || session?.user?.name || 'Cliente Invitado';
    const userEmail = email || session?.user?.email || 'invitado@jbimports.com';

    await db.saveOrder({
      id: paymentBody.external_payment_id,
      userEmail,
      userName,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      navePaymentId: checkoutData.id,
      shippingAddress: shipping ? {
        street: `${shipping.address.street} ${shipping.address.number}`,
        city: shipping.address.city,
        state: shipping.address.state,
        zip: shipping.address.zipCode,
        shippingCost: shipping.cost,
        shippingMethod: shipping.method
      } : undefined
    });

    // 5. Return the checkout URL
    return NextResponse.json({ 
      success: true, 
      url: checkoutData.url || checkoutData.checkout_url,
      id: checkoutData.id 
    });

  } catch (error: any) {
    console.error('Nave Integration Error DETAILS:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
