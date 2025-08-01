export type PaymentMethod = 'COD' | 'TRANSFER' | 'CREDIT_CARD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export const ORDER_STATUS_VI = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
};
export const PAYMENT_STATUS_VI = {
  PENDING: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại',
  REFUNDED: 'Đã hoàn tiền',
};
export const PAYMENT_METHOD_VI = {
  COD: 'Thanh toán khi nhận hàng',
  TRANSFER: 'Chuyển khoản',
  CREDIT_CARD: 'Thẻ tín dụng',
};


export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: string;
  avatar: string | null;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

export interface Order {
  id: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentUrl: string | null;
  transactionNo: string | null;
  paymentMessage: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  user: User;
  phone: string;
  address: string;
  orderDetails?: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

export interface OrderResponse {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: Order[];
}

export interface OrderFilterParams {
  page?: number;
  size?: number;
  search?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  orderStatus?: OrderStatus;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  fromDate?: string;
  toDate?: string;
  userId?: number;
} 