// src/hooks/useOrderDB.ts
import { useEffect, useState, useCallback } from "react";
import {
  generateOfflineOrderId,
  orderDB,
} from "../utils/indexDB/indexedDBManager";
import type { addOrder, Order, findandfilter as OrderFilter } from "../types";

export function useOrderDB() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      try {
        await orderDB.init();
        console.log("connected to idb");
        setIsReady(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize database",
        );
      }
    };

    init();

    // Cleanup
    return () => {
      orderDB.close();
    };
  }, []);

  // CREATE/UPDATE: Save order
  const saveOrder = useCallback(
    async (order: addOrder & { branch_id: string }) => {
      if (!isReady) throw new Error("Database not ready");
      const savedOrder = orderDB.saveOrder({
        _id: generateOfflineOrderId(),
        sync_status: "pending" as const,
        ...order,
      });
      return {
        status: 200,
        data: savedOrder,
      };
    },
    [isReady],
  );

  // READ: Get single order
  const getOrder = useCallback(
    async (id: string) => {
      if (!isReady) throw new Error("Database not ready");

      const order = await orderDB.getOrder(id);

      if (!order) {
        throw new Error("Order not found");
      }

      // Return same format as API response
      return {
        status: 200,
        data: order,
      };
    },
    [isReady],
  );

  // READ: Get all orders with filter
  const getOrders = useCallback(
    async (filter?: OrderFilter) => {
      if (!isReady) throw new Error("Database not ready");
      const total = await orderDB.getOrderCount();

      // Calculate pagination
      const limit = filter?.limit || 10;
      const page = filter?.page || 0;
      const totalPages = Math.ceil(total / limit);
      const ordersResult = await orderDB.getOrders({
        ...filter,
        ...filter?.match_values,
      });

      return {
        status: 200,
        data: {
          results: ordersResult,
          page,
          limit,
          totalPages,
          totalResults: total,
        },
      };
    },
    [isReady],
  );

  // UPDATE: Partial update
  const updateOrder = useCallback(
    async (id: string, updates: Partial<Order>) => {
      if (!isReady) throw new Error("Database not ready");
      const updatedData = await orderDB.updateOrder(id, {
        ...updates,
        sync_status: "pending",
      });
      return {
        status: 200,
        data: updatedData,
      };
    },
    [isReady],
  );

  // DELETE: Remove order
  const deleteOrder = useCallback(
    async (id: string) => {
      if (!isReady) throw new Error("Database not ready");
      orderDB.deleteOrder(id);
      return {
        status: 200,
      };
    },
    [isReady],
  );

  // Utility: Clear all orders
  const clearAll = useCallback(async () => {
    if (!isReady) throw new Error("Database not ready");
    return orderDB.clearAll();
  }, [isReady]);

  // Utility: Get count
  const getOrderCount = useCallback(async () => {
    if (!isReady) throw new Error("Database not ready");
    return orderDB.getOrderCount();
  }, [isReady]);

  return {
    isReady,
    error,
    saveOrder,
    getOrder,
    getOrders,
    updateOrder,
    deleteOrder,
    clearAll,
    getOrderCount,
  };
}
