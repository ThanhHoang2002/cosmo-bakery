import { format } from 'date-fns';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { RecentOrder } from '../types';

import { Card } from '@/components/ui/card';
import { ORDER_STATUS_VI, OrderStatus, PAYMENT_METHOD_VI, PaymentMethod } from '@/features/orders/types';
import { formatCurrency } from '@/utils/format';

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const StatusBadgeColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  SHIPPED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  DELIVERED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const OrderStatusBadge = memo(({ status }: { status: OrderStatus }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${StatusBadgeColors[status]}`}>
      {ORDER_STATUS_VI[status]}
    </span>
  );
});
OrderStatusBadge.displayName = 'OrderStatusBadge';

const PaymentMethodBadges = memo(({ method }: { method: PaymentMethod }) => {
  const methodColors: Record<string, string> = {
    COD: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    TRANSFER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${methodColors[method]}`}>
      {PAYMENT_METHOD_VI[method]}
    </span>
  );
}
)
PaymentMethodBadges.displayName = 'PaymentMethodBadge';

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return dateString;
  }
};

const RecentOrders = memo(({ orders }: RecentOrdersProps) => {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">Đơn hàng gần đây</h2>
        <Link to="/admin/orders" className="text-sm text-primary hover:underline">
          Xem tất cả
        </Link>
      </div>
      <div className="overflow-x-auto">
        {orders.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm font-medium text-muted-foreground">
                <th className="pb-3 pr-4">Mã đơn hàng</th>
                <th className="pb-3 pr-4">Khách hàng</th>
                <th className="pb-3 pr-4">Ngày</th>
                <th className="pb-3 pr-4">Số tiền</th>
                <th className="pb-3 pr-4">Phương thức thanh toán</th>
                <th className="pb-3 pr-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border text-sm">
                  <td className="py-4 pr-4">#{order.id}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center">
                      {order.user.avatar && (
                        <img 
                          src={order.user.avatar} 
                          alt={order.user.name}
                          className="mr-2 h-6 w-6 rounded-full object-cover"
                        />
                      )}
                      <span>{order.user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">{formatDate(order.createdAt)}</td>
                  <td className="py-4 pr-4 font-medium">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-4 pr-4">
                    <PaymentMethodBadges method={order.paymentMethod} />
                  </td>
                  <td className="py-4 pr-4">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">Không có đơn hàng</p>
          </div>
        )}
      </div>
    </Card>
  );
});

RecentOrders.displayName = 'RecentOrders';

export default RecentOrders; 