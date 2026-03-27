import { NextResponse } from 'next/server';
import { mailer } from '@/lib/mailer';

export async function GET() {
  try {
    const targetEmail = process.env.EMAIL_USER || 'contacto@jbimports.com.ar';
    
    await mailer.sendPurchaseConfirmation(
      targetEmail,
      'Test User Production',
      {
        id: 'TEST-PROD-001',
        total: 100,
        items: [{ name: 'Test Product', quantity: 1, price: 100 }]
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: `Prueba de correo enviada exitosamente a ${targetEmail}. Por favor, revisá tu bandeja de entrada (y la carpeta de spam).`,
      config: {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER
      }
    });
  } catch (error: any) {
    console.error('PROD EMAIL TEST ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      detail: 'Asegurate de que las variables de entorno en Vercel sean correctas y estén aplicadas.'
    }, { status: 500 });
  }
}
