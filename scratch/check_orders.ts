import { db } from './lib/db';

async function checkRecentOrders() {
  try {
    const orders = await db.getOrders();
    console.log(`Found ${orders.length} orders total.`);
    
    // Sort by date descending
    const recent = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
    
    recent.forEach(o => {
      console.log(`Order ID: ${o.id}, Email: ${o.userEmail}, Status: ${o.status}, Created: ${o.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkRecentOrders();
