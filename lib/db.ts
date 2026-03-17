import dbConnect from './mongodb';

/**
 * MongoDB database adapter for Orders and Users
 * Replaces the previous JSON-based approach
 */

export const db = {
  // Helpers to get models dynamically to avoid initialization issues
  async getUserModel() {
    const User = (await import('../models/User')).default;
    return User;
  },
  async getOrderModel() {
    const Order = (await import('../models/Order')).default;
    return Order;
  },

  // Orders logic
  async getOrders(): Promise<any[]> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      return await Order.find({}).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('DB Error [getOrders]:', error);
      throw error;
    }
  },

  async getOrderById(id: string): Promise<any | undefined> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      return await Order.findOne({ id }).lean();
    } catch (error) {
      console.error('DB Error [getOrderById]:', error);
      throw error;
    }
  },

  async getOrdersByEmail(email: string): Promise<any[]> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      return await Order.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('DB Error [getOrdersByEmail]:', error);
      throw error;
    }
  },

  async saveOrder(orderData: any): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      const existingOrder = await Order.findOne({ id: orderData.id });

      if (existingOrder) {
        await Order.updateOne({ id: orderData.id }, orderData);
      } else {
        await Order.create(orderData);
      }
    } catch (error) {
      console.error('DB Error [saveOrder]:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: string, navePaymentId?: string): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      const updateData: any = { status };
      if (navePaymentId) updateData.navePaymentId = navePaymentId;

      await Order.updateOne(
        { $or: [{ id }, { navePaymentId }] },
        updateData
      );
    } catch (error) {
      console.error('DB Error [updateOrderStatus]:', error);
      throw error;
    }
  },

  // Users logic
  async getUsers(): Promise<any[]> {
    try {
      await dbConnect();
      const User = await this.getUserModel();
      return await User.find({}).lean();
    } catch (error) {
      console.error('DB Error [getUsers]:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string): Promise<any | undefined> {
    try {
      await dbConnect();
      const User = await this.getUserModel();
      return await User.findOne({ email }).lean();
    } catch (error) {
      console.error('DB Error [getUserByEmail]:', error);
      throw error;
    }
  },

  async saveUser(userData: any): Promise<void> {
    try {
      await dbConnect();
      const User = await this.getUserModel();
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        await User.updateOne({ email: userData.email }, userData);
      } else {
        await User.create(userData);
      }
    } catch (error) {
      console.error('DB Error [saveUser]:', error);
      throw error;
    }
  }
};
