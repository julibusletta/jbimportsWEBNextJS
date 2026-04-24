import { db } from './lib/db';
import { mailer } from './lib/mailer';

async function fixOrder() {
  const orderId = 'JB-17769';
  try {
    console.log(`Checking order ${orderId}...`);
    const order = await db.getOrderById(orderId);
    
    if (!order) {
      console.log('Order not found!');
      process.exit(1);
    }
    
    console.log(`Current status: ${order.status}`);
    
    if (order.status !== 'APPROVED') {
      console.log('Updating status to APPROVED...');
      await db.updateOrderStatus(orderId, 'APPROVED');
      
      console.log('Sending confirmation email...');
      if (order.userEmail) {
        await mailer.sendPurchaseConfirmation(order.userEmail, order.userName, order);
        console.log(`Email sent to ${order.userEmail}`);
      }
    } else {
      console.log('Order is already APPROVED.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixOrder();
