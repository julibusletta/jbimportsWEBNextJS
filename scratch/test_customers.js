const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function testFetch() {
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
  const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false, collection: 'orders' }));

  const registeredUsers = await User.find({ role: { $ne: 'ADMIN' } }).lean();
  console.log('Registered Users Found:', registeredUsers.length);

  const orderEmails = await Order.distinct('userEmail');
  console.log('Unique Order Emails:', orderEmails.length);
  console.log('Order Emails:', orderEmails);

  process.exit(0);
}

testFetch();
