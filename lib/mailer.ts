import nodemailer from 'nodemailer';
import path from 'path';
import { logToFile } from './logger';

/**
 * Mailer utility using nodemailer
 * Handles sending purchase confirmation and status update emails
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'), 
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug logs
  logger: true // Log to console
});

export const mailer = {
  async sendPurchaseConfirmation(to: string, userName: string, orderDetails: any) {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logojbimports.webp');
    
    const itemsHtml = orderDetails.items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; color: #4a5568;">
          <div style="font-weight: 600; color: #2d3748;">${item.name}</div>
          <div style="font-size: 12px; color: #718096;">Cantidad: ${item.quantity}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #2d3748; font-weight: 600;">
          $${item.price.toLocaleString('es-AR')}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 0; background-color: #f7fafc; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
          .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #edf2f7; }
          .content { padding: 40px; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #718096; font-size: 12px; border-top: 1px solid #edf2f7; }
          .button { display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 25px; }
          .order-id { color: #2563eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:logo" alt="JB Imports" style="max-height: 60px; width: auto;" />
          </div>
          <div class="content">
            <h1 style="margin-top: 0; color: #1a202c; font-size: 24px; text-align: center;">¡Gracias por tu compra!</h1>
            <p style="font-size: 16px; color: #4a5568; text-align: center;">Hola <strong>${userName}</strong>, hemos recibido tu pedido y está siendo procesado.</p>
            
            <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin: 25px 0; border: 1px solid #edf2f7;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #718096; font-size: 14px;">Número de pedido:</span>
                <span class="order-id">#${orderDetails.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #718096; font-size: 14px;">Fecha:</span>
                <span style="color: #2d3748; font-size: 14px; font-weight: 500;">${new Date().toLocaleDateString('es-AR')}</span>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #edf2f7;">
                  <th style="padding: 12px; text-align: left; color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Producto</th>
                  <th style="padding: 12px; text-align: right; color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 20px 12px 12px; font-weight: bold; font-size: 18px; color: #1a202c;">TOTAL</td>
                  <td style="padding: 20px 12px 12px; font-weight: bold; font-size: 18px; text-align: right; color: #2563eb;">$${orderDetails.total.toLocaleString('es-AR')}</td>
                </tr>
              </tfoot>
            </table>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/mi-cuenta/compras" class="button">Gestionar mi pedido</a>
            </div>
          </div>
          <div class="footer">
            <p style="margin-bottom: 5px;"><strong>JB Imports - Tecnología a tu alcance</strong></p>
            <p style="margin-bottom: 0;">Este es un mensaje automático, por favor no lo respondas.</p>
            <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} JB Imports. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        bcc: process.env.EMAIL_USER, // Send a copy to the store
        subject: `Confirmación de pedido #${orderDetails.id} - JB Imports`,
        html: html,
      });
      logToFile(`Confirmation email sent to ${to} for order #${orderDetails.id}. MessageId: ${info.messageId}`);
    } catch (error: any) {
      logToFile(`FAILED TO SEND EMAIL to ${to}`, error.message);
      throw error;
    }
  }
};
