export interface CafeOrder {
  orderId: string;
  cafeId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  orderStates: {
    orderReceived: OrderState;
    orderPrepared: OrderState;
    orderServed: OrderState;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderState {
  startTimestamp: string;
  endTimestamp: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  notes?: string;
}
