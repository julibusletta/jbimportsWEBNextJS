const mongoose = require('mongoose');

// Schema definitions
const OrderSchema = new mongoose.Schema({
  id: String,
  userEmail: String,
  userName: String,
  total: Number,
  status: String,
  items: Array,
  createdAt: String,
}, { collection: 'orders' });

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function fix() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
    
    const orderId = 'JB-17769';
    console.log(`Searching for order ${orderId}...`);
    
    const order = await Order.findOne({ id: orderId });
    
    if (!order) {
      // Try fuzzy search if not found (maybe lowercase/uppercase)
      const anyOrder = await Order.findOne({ id: { $regex: new RegExp(orderId, 'i') } });
      if (anyOrder) {
          console.log(`Found with fuzzy search: ${anyOrder.id}`);
          await Order.updateOne({ id: anyOrder.id }, { status: 'APPROVED' });
          console.log('Status updated to APPROVED.');
      } else {
          console.log('Order not found even with fuzzy search.');
          const all = await Order.find().sort({_id: -1}).limit(5);
          console.log('Latest orders IDs:', all.map(o => o.id));
      }
    } else {
      console.log(`Current status: ${order.status}`);
      await Order.updateOne({ id: orderId }, { status: 'APPROVED' });
      console.log('Status updated to APPROVED.');
    }
    
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
