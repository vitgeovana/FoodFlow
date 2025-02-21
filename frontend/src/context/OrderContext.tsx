import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, OrderItem, TableInfo } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (tableInfo: TableInfo, items: OrderItem[]) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  requestPayment: (orderId: string) => void;
  paymentRequests: Order[];
  completePayment: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<Order[]>([]);

  const addOrder = (tableInfo: TableInfo, items: OrderItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + item.preco * item.quantity, 0);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      tableInfo,
      items,
      status: 'pending',
      totalAmount,
      estimatedTime: 20,
      createdAt: new Date()
    };

    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const requestPayment = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setPaymentRequests(prev => [...prev, order]);
    }
  };

  const completePayment = (orderId: string) => {
    setPaymentRequests(prev => prev.filter(order => order.id !== orderId));
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        requestPayment,
        paymentRequests,
        completePayment
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}