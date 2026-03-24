/**
 * Andreani Shipping API Client
 * Handles authentication, rate calculation, and shipment creation.
 */

const ANDREANI_USER = process.env.ANDREANI_USER;
const ANDREANI_PASS = process.env.ANDREANI_PASS;
const ANDREANI_CLIENT_NUMBER = process.env.ANDREANI_CLIENT_NUMBER;
const ANDREANI_ENV = process.env.ANDREANI_ENV || 'sandbox';

const BASE_URL = ANDREANI_ENV === 'production'
  ? 'https://api.andreani.com'
  : 'https://api-qa.andreani.com';

const AUTH_URL = 'https://login.andreani.com/authorize';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Gets a valid Andreani authorization token
 */
async function getAndreaniToken(): Promise<string> {
  // Check cache (Andreani tokens usually last 24h)
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!ANDREANI_USER || !ANDREANI_PASS) {
    throw new Error('Andreani credentials not configured');
  }

  const response = await fetch(AUTH_URL, {
    method: 'GET', // Andreani uses GET for basic auth -> token conversion in some docs, but verify
    headers: {
      'Authorization': `Basic ${Buffer.from(`${ANDREANI_USER}:${ANDREANI_PASS}`).toString('base64')}`
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Andreani Auth Error (${response.status}):`, errorBody);
    throw new Error('Failed to authenticate with Andreani');
  }

  // Token is usually in the x-authorization-token header or body
  const token = response.headers.get('x-authorization-token');
  if (!token) {
    throw new Error('Andreani did not return an authorization token');
  }

  cachedToken = token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // Cache for 23 hours
  return token;
}

export interface ShippingItem {
  weight: number; // in kg
  volume: number; // in cm3 or dimensions
  quantity: number;
}

export interface RateOption {
  id: string;
  name: string; // e.g. "Andreani Estándar"
  price: number;
  estimatedDays: number;
  type: 'DOMICILIO' | 'SUCURSAL';
}

/**
 * Calculates shipping rates for a given ZIP code
 */
export async function calculateRates(zipCode: string, items: ShippingItem[]): Promise<RateOption[]> {
  try {
    const token = await getAndreaniToken();
    
    // Total weight and dimensions (logic depends on Andreani's specific body structure)
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0) || 1; // Default 1kg

    // Placeholder body for Andreani Tariff API
    const body = {
      cpDestino: zipCode,
      contrato: ANDREANI_CLIENT_NUMBER,
      cliente: ANDREANI_CLIENT_NUMBER,
      bultos: items.map(item => ({
        kilos: item.weight,
        volumen: item.volume // verify if cm3 or dimensions
      }))
    };

    const response = await fetch(`${BASE_URL}/v1/tarifas`, {
      method: 'POST',
      headers: {
        'x-authorization-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.warn('Andreani Rates Error:', await response.text());
      return [];
    }

    const data = await response.json();
    
    // Map Andreani response to our internal format
    // This part requires exact knowledge of the response schema
    return (data.tarifas || []).map((t: any) => ({
      id: t.id_servicio || 'std',
      name: t.detalle || 'Envío Andreani',
      price: t.valor || 0,
      estimatedDays: t.dias_entrega || 3,
      type: t.es_sucursal ? 'SUCURSAL' : 'DOMICILIO'
    }));

  } catch (error) {
    console.error('Andreani calculateRates failed:', error);
    // Return empty or mock data for dev if desired
    if (ANDREANI_ENV === 'sandbox') {
      return [
        { id: 'dom', name: 'Envío a Domicilio (Andreani)', price: 4500, estimatedDays: 3, type: 'DOMICILIO' },
        { id: 'suc', name: 'Retiro en Sucursal (Andreani)', price: 3200, estimatedDays: 2, type: 'SUCURSAL' }
      ];
    }
    return [];
  }
}

/**
 * Fetches Andreani branches for a ZIP code
 */
export async function getAndreaniOffices(zipCode: string) {
  try {
    const token = await getAndreaniToken();
    const response = await fetch(`${BASE_URL}/v1/sucursales?codigoPostal=${zipCode}`, {
      headers: { 'x-authorization-token': token }
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Andreani getAndreaniOffices failed:', error);
    return [];
  }
}
