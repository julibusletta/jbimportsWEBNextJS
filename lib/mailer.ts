import nodemailer from 'nodemailer';

/**
 * Mailer utility using nodemailer
 * Handles sending purchase confirmation and status update emails
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const mailer = {
  async sendPurchaseConfirmation(to: string, userName: string, orderDetails: any) {
    const itemsHtml = orderDetails.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h1 style="color: #2563eb; text-align: center;">¡Gracias por tu compra, ${userName}!</h1>
        <p style="text-align: center; color: #666;">Tu pedido <strong>#${orderDetails.id}</strong> ha sido confirmado con éxito.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">TOTAL</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">$${orderDetails.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/mi-cuenta/compras" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver mi pedido</a>
        </div>
        
        <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #999; text-align: center;">JB Imports - Tecnología a tu alcance</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"JB Imports" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Confirmación de Compra #${orderDetails.id} - JB Imports`,
        html,
      });
      console.log(`Confirmation email sent to ${to}`);
    } catch (error) {
      console.error('FAILED TO SEND EMAIL:', error);
    }
  }
};
