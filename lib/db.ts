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
  async getCategoryModel() {
    const Category = (await import('../models/Category')).default;
    return Category;
  },
  async getWebhookLogModel() {
    const WebhookLog = (await import('../models/WebhookLog')).default;
    return WebhookLog;
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
      const normalizedEmail = email.toLowerCase();
      return await Order.find({ userEmail: normalizedEmail }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('DB Error [getOrdersByEmail]:', error);
      throw error;
    }
  },

  async saveOrder(orderData: any): Promise<void> {
    try {
      await dbConnect();
      const Order = await this.getOrderModel();
      if (orderData.userEmail) {
        orderData.userEmail = orderData.userEmail.toLowerCase();
      }

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

  async getCategories(): Promise<any[]> {
    try {
      await dbConnect();
      const Category = await this.getCategoryModel();
      return await Category.find({}).sort({ name: 1 }).lean();
    } catch (error) {
      console.error('DB Error [getCategories]:', error);
      throw error;
    }
  },

  async saveCategory(categoryData: any): Promise<void> {
    try {
      await dbConnect();
      const Category = await this.getCategoryModel();
      const { id, slug } = categoryData;
      await Category.findOneAndUpdate(
        { $or: [{ id }, { slug }] },
        { $set: categoryData },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('DB Error [saveCategory]:', error);
      throw error;
    }
  },

  async logWebhook(service: string, method: string, payload: any, headers?: any): Promise<void> {
    try {
      await dbConnect();
      const WebhookLog = await this.getWebhookLogModel();
      
      const orderId = payload?.reference || payload?.external_payment_id || payload?.id;
      const status = payload?.status || payload?.state;

      await WebhookLog.create({
        service,
        method,
        payload,
        headers,
        orderId,
        status: status?.toString()
      });
    } catch (error) {
      console.error('DB Error [logWebhook]:', error);
      // Don't throw for logging failures to avoid breaking the main flow
    }
  },

  async getProductModel() {
    const Product = (await import('../models/Product')).default;
    return Product;
  },

  // Products logic
  async getProducts(): Promise<any[]> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      return await Product.find({}).lean();
    } catch (error) {
      console.error('DB Error [getProducts]:', error);
      throw error;
    }
  },

  async saveProducts(products: any[]): Promise<void> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      
      // We use upsert for each product to either update existing or create new
      const operations = products.map(p => ({
        updateOne: {
          filter: { id: p.id },
          update: { $set: p },
          upsert: true
        }
      }));

      if (operations.length > 0) {
        await Product.bulkWrite(operations);
      }

      // Auto-create missing categories
      const Category = await this.getCategoryModel();
      const distinctCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
      
      for (const catSlug of distinctCategories) {
        const existing = await Category.findOne({ slug: catSlug });
        if (!existing) {
          console.log(`Auto-creating missing category: ${catSlug}`);
          await Category.create({
            id: `cat-${catSlug}`,
            slug: catSlug,
            name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1).replace(/-/g, ' '),
            image: `/images/categories/${catSlug}.png`, // Try to follow naming convention
            isMain: false,
            description: `Productos de la categoría ${catSlug}`
          }).catch(err => console.error(`Failed to auto-create category ${catSlug}:`, err));
        }
      }
    } catch (error) {
      console.error('DB Error [saveProducts]:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      await Product.deleteOne({ id });
    } catch (error) {
      console.error('DB Error [deleteProduct]:', error);
      throw error;
    }
  },

  async deleteProducts(ids: string[]): Promise<void> {
    try {
      await dbConnect();
      const Product = await this.getProductModel();
      await Product.deleteMany({ id: { $in: ids } });
    } catch (error) {
      console.error('DB Error [deleteProducts]:', error);
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
