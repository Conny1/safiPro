// src/services/db/OrderDB.ts
import  type { Order, OrderFilter } from '../indexDB.types';

export class OrderDB {
  private dbName = 'SafiProOrdersDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  // Singleton pattern
  private static instance: OrderDB;
  static getInstance(): OrderDB {
    if (!OrderDB.instance) {
      OrderDB.instance = new OrderDB();
    }
    return OrderDB.instance;
  }

  private constructor() {}

  // Initialize database
  async init(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Create orders store if it doesn't exist
        if (!db.objectStoreNames.contains('orders')) {
          const store = db.createObjectStore('orders', { keyPath: '_id' });
          
          // Create indexes for faster queries
          store.createIndex('by_branch', 'branch_id', { unique: false });
          store.createIndex('by_status', 'status', { unique: false });
          store.createIndex('by_payment_status', 'payment_status', { unique: false });
          store.createIndex('by_phone', 'phone_number', { unique: false });
          store.createIndex('by_date', 'createdAt', { unique: false });
          store.createIndex('by_sync', 'sync_status', { unique: false });
        }
      };
    });
  }

  // CREATE: Save order (insert or update)
  async saveOrder(order: Order): Promise<Order> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      
      // Add timestamps if not present
      const orderWithTimestamps = {
        ...order,
        updatedAt: new Date().toISOString(),
        createdAt: order.createdAt || new Date().toISOString(),
        sync_status: order.sync_status || 'synced',
      };

      const request = store.put(orderWithTimestamps);

      request.onsuccess = () => resolve(orderWithTimestamps);
      request.onerror = () => reject(request.error);
    });
  }

  // READ: Get single order by ID
  async getOrder(id: string): Promise<Order | null> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // READ: Get all orders with optional filtering
  async getOrders(filter?: OrderFilter): Promise<Order[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      let request: IDBRequest;

      // If we have a filter, use appropriate index
      if (filter?.branch_id) {
        const index = store.index('by_branch');
        request = index.getAll(filter.branch_id);
      } else if (filter?.status) {
        const index = store.index('by_status');
        request = index.getAll(filter.status);
      } else if (filter?.payment_status) {
        const index = store.index('by_payment_status');
        request = index.getAll(filter.payment_status);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        let orders = request.result as Order[] || [];
        
        // Apply additional filters in memory
        if (filter?.search) {
          const searchLower = filter.search.toLowerCase();
          orders = orders.filter(order => 
            order.name?.toLowerCase().includes(searchLower) ||
            order.phone_number?.includes(searchLower) ||
            order.order_no?.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply pagination
        if (filter?.skip !== undefined) {
          orders = orders.slice(filter.skip);
        }
        if (filter?.limit !== undefined) {
          orders = orders.slice(0, filter.limit);
        }
        
        // Sort by latest first
        orders.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        
        resolve(orders);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // READ: Get orders by branch
  async getOrdersByBranch(branchId: string): Promise<Order[]> {
    return this.getOrders({ branch_id: branchId });
  }

  // READ: Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    return this.getOrders({ status });
  }

  // READ: Get pending sync orders
  async getPendingSyncOrders(): Promise<Order[]> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const index = store.index('by_sync');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // UPDATE: Update specific fields of an order
  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    await this.init();
    
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      // First get the existing order
      const existingOrder = await this.getOrder(id);
      if (!existingOrder) {
        reject(new Error('Order not found'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');

      const updatedOrder: Order = {
        ...existingOrder,
        ...updates,
        updatedAt: new Date().toISOString(),
        sync_status: updates.sync_status || existingOrder.sync_status || 'pending',
      };

      const request = store.put(updatedOrder);

      request.onsuccess = () => resolve(updatedOrder);
      request.onerror = () => reject(request.error);
    });
  }

  // DELETE: Remove order
  async deleteOrder(id: string): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all orders (for testing/reset)
  async clearAll(): Promise<void> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get count of orders
  async getOrderCount(): Promise<number> {
    await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Close database
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

export function generateOfflineOrderId(): string {
  // For offline orders, prefix with 'local_' to distinguish from server IDs
  return `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateOrderNo(): string {
  const now = new Date();
  const year = now.getFullYear().toString().substring(2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD${year}${month}${day}${random}`;
}


// Export singleton instance
export const orderDB = OrderDB.getInstance();