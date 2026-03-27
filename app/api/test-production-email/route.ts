import { NextResponse } from 'next/server';
import { mailer } from '@/lib/mailer';

export async function GET() {
  try {
    const targetEmail = process.env.EMAIL_USER || 'contacto@jbimports.com.ar';
    
    await mailer.sendPurchaseConfirmation(
      targetEmail,
      'Test User Final',
      {
        id: 'TEST-FINAL-001',
        total: 100,
        items: [{ name: 'Test Product Final', quantity: 1, price: 100 }]
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: `¡ÉXITO! El dominio ya está conectado a Vercel y el mail de prueba fue enviado a ${targetEmail}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
