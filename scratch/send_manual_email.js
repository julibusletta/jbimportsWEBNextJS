
const nodemailer = require('nodemailer');
const path = require('path');

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
  }
});

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
    .order-id { color: #2563eb; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
       <img src="cid:logo" alt="JB Imports" style="max-height: 80px; width: auto; display: block; margin: 0 auto;" />
    </div>
    <div class="content">
      <h1 style="margin-top: 0; color: #1a202c; font-size: 24px; text-align: center;">¡Gracias por tu compra!</h1>
      <p style="font-size: 16px; color: #4a5568; text-align: center;">Hola, hemos verificado tu pago y tu pedido ya fue despachado.</p>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin: 25px 0; border: 1px solid #edf2f7;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <span style="color: #718096; font-size: 14px;">Código de Seguimiento:</span>
          <span class="order-id" style="font-size: 16px; letter-spacing: 1px;">360002969205980</span>
        </div>
        <p style="font-size: 12px; color: #a0aec0; margin: 5px 0 0 0;">Utilizá este código para rastrear tu paquete.</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #edf2f7;">
            <th style="padding: 12px; text-align: left; color: #718096; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Producto</th>
            <th style="padding: 12px; text-align: right; color: #718096; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #edf2f7;">
              <div style="font-weight: 600; color: #2d3748; font-size: 14px;">CABLE INVERSOR 12V-30V STARLINK MINI AUTO</div>
              <div style="font-size: 11px; color: #a0aec0;">Cantidad: 10</div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #2d3748; font-weight: 700;">
              $440.000
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td style="padding: 20px 12px 12px; font-weight: 900; font-size: 18px; color: #1a202c;">TOTAL</td>
            <td style="padding: 20px 12px 12px; font-weight: 900; font-size: 20px; text-align: right; color: #2563eb;">$440.000</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="footer">
      <p style="margin-bottom: 5px;"><strong>JB Imports - Tecnología a un solo clic</strong></p>
      <p style="margin-top: 10px;">&copy; ${new Date().getFullYear()} JB Imports. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`;

async function sendMail() {
  try {
    console.log("Enviando correo...");
    const info = await transporter.sendMail({
      from: '"JB Imports" <contacto@jbimports.com.ar>',
      to: 'lea33t@gmail.com',
      subject: 'Tu pedido ha sido procesado y despachado - JB Imports',
      html: html,
      attachments: [{
        filename: 'logo.png',
        path: path.join(process.cwd(), 'public', 'images', 'logotest9.png'),
        cid: 'logo'
      }]
    });
    console.log('Correo enviado exitosamente: ' + info.messageId);
  } catch (err) {
    console.error('Error enviando correo:', err);
  }
}

sendMail();
