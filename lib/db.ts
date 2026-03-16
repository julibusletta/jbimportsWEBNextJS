import fs from 'fs';
import path from 'path';

/**
 * Simple JSON-based database adapter for Orders
 * Designed to be easily swappable for PostgreSQL/MongoDB/Supabase
 */

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Ensure the data directory and orders file exist
function ensureDb() {
  const dir = path.dirname(ORDERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
  }
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // Internal/External ID
  userId?: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  navePaymentId?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export const db = {
  async getOrders(): Promise<Order[]> {
    ensureDb();
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id);
  },

  async getOrdersByEmail(email: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter(o => o.userEmail === email);
  },

  async saveOrder(order: Order): Promise<void> {
    ensureDb();
    const orders = await this.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      orders[existingIndex] = { ...orders[existingIndex], ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.push({ ...order, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  },

  async updateOrderStatus(id: string, status: Order['status'], navePaymentId?: string): Promise<void> {
    const order = await this.getOrderById(id);
    if (order) {
      order.status = status;
      if (navePaymentId) order.navePaymentId = navePaymentId;
      await this.saveOrder(order);
    }
  }
};
