import { Clock, CreditCard, MapPin, Package, Phone, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

import { Order, OrderStatus, PaymentStatus } from "../types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/format";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = "" }: CardHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle = ({ children, className = "" }: CardTitleProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent = ({ children, className = "" }: CardContentProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdatePaymentStatus?: (id: number, status: PaymentStatus) => Promise<Order | null>;
  onUpdateOrderStatus?: (id: number, status: OrderStatus) => Promise<Order | null>;
  loading?: boolean;
}

export const OrderDialog = ({ 
  open, 
  onClose, 
  order, 
  onUpdatePaymentStatus,
  onUpdateOrderStatus,
  loading = false 
}: OrderDialogProps) => {
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus | "">("");
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus | "">("");

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

 

  const handleUpdatePaymentStatus = async () => {
    if (onUpdatePaymentStatus && newPaymentStatus && order) {
      await onUpdatePaymentStatus(order.id, newPaymentStatus as PaymentStatus);
      setNewPaymentStatus("");
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (onUpdateOrderStatus && newOrderStatus && order) {
      await onUpdateOrderStatus(order.id, newOrderStatus as OrderStatus);
      setNewOrderStatus("");
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-5 w-5" />
            Đơn hàng #{order.id}
          </DialogTitle>
          <div className="flex flex-wrap gap-2 pt-2">
            <OrderStatusBadge status={order.paymentStatus} type="payment" />
            <OrderStatusBadge status={order.orderStatus} type="order" />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 md:col-span-2">
            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-4 w-4" />
                  Tóm tắt đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Ngày đặt hàng</div>
                    <div className="font-medium">{formatDate(order.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phương thức thanh toán</div>
                    <div><PaymentMethodBadge method={order.paymentMethod} /></div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Trạng thái thanh toán</div>
                    <div><OrderStatusBadge status={order.paymentStatus} type="payment" /></div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Trạng thái đơn hàng</div>
                    <div><OrderStatusBadge status={order.orderStatus} type="order" /></div>
                  </div>
                  {order.transactionNo && (
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">Mã giao dịch</div>
                      <div className="font-mono text-sm">{order.transactionNo}</div>
                    </div>
                  )}
                </div>

                {order.paymentMessage && (
                  <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                    <p className="font-medium">Chi tiết thanh toán</p>
                    <p className="mt-1">{order.paymentMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-4 w-4" />
                  Sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-72 overflow-y-auto rounded-md border">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Sản phẩm</th>
                        <th className="w-20 px-4 py-2.5 text-center">Số lượng</th>
                        <th className="w-28 px-4 py-2.5 text-right">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {order.orderDetails && order.orderDetails.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              {item.product.image && (
                                <div className="h-10 w-10 overflow-hidden rounded-md border">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="truncate font-medium">{item.product.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/50 font-medium">
                      <tr>
                        <td colSpan={2} className="px-4 py-2.5 text-left">Tổng đơn hàng</td>
                        <td className="px-4 py-2.5 text-right">{formatCurrency(order.totalPrice)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Status Updates */}
            {(onUpdatePaymentStatus || onUpdateOrderStatus) && <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  Cập nhật trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Payment Status Updates */}
                  {onUpdatePaymentStatus && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Trạng thái thanh toán</h4>
                      <div className="flex items-center gap-2">
                        <Select value={newPaymentStatus} onValueChange={(value) => setNewPaymentStatus(value as PaymentStatus)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn trạng thái thanh toán" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Chờ thanh toán</SelectItem>
                            <SelectItem value="PAID">Đã thanh toán</SelectItem>
                            <SelectItem value="FAILED">Thất bại</SelectItem>
                            <SelectItem value="REFUNDED">Hoàn trả</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          disabled={!newPaymentStatus || loading} 
                          onClick={handleUpdatePaymentStatus}
                          size="sm"
                        >
                          Cập nhật
                        </Button>
                      </div>
                    </div>
                  )}

                  
                  {onUpdateOrderStatus && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Trạng thái đơn hàng</h4>
                      <div className="flex items-center gap-2">
                        <Select value={newOrderStatus} onValueChange={(value) => setNewOrderStatus(value as OrderStatus)}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Chọn trạng thái đơn hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
                            <SelectItem value="SHIPPED">Đã giao hàng</SelectItem>
                            <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
                            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          disabled={!newOrderStatus || loading} 
                          onClick={handleUpdateOrderStatus}
                          size="sm"
                        >
                          Cập nhật
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-4 w-4" />
                  Khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="max-w-full">
                      <p className="font-medium">{order.user.name}</p>
                      <p className="truncate text-sm text-muted-foreground" title={order.user.email}>
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Số điện thoại</p>
                      <p className="text-sm">{order.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Địa chỉ giao hàng</p>
                      <p className="text-sm">{order.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-4 w-4" />
                  Lịch sử đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                        <ShoppingBag className="h-3 w-3" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Đơn hàng được tạo</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.updatedAt && order.updatedAt !== order.createdAt && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${
                          order.paymentStatus === 'FAILED' || order.paymentStatus === 'REFUNDED' 
                            ? 'bg-red-500' 
                            : order.paymentStatus === 'PAID' 
                              ? 'bg-green-500' 
                              : 'bg-blue-500'
                        }`}>
                          <CreditCard className="h-3 w-3" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {order.paymentStatus === 'PENDING' ? 'Chờ thanh toán' :
                          order.paymentStatus === 'PAID' ? 'Đã thanh toán' :
                          order.paymentStatus === 'FAILED' ? 'Thất bại' : 
                          order.paymentStatus === 'REFUNDED' ? 'Hoàn trả' : 'Trạng thái đã cập nhật'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}

                  {/* Show order status in timeline */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${
                        order.orderStatus === 'CANCELLED'
                          ? 'bg-red-500'
                          : order.orderStatus === 'DELIVERED'
                            ? 'bg-green-500'
                            : order.orderStatus === 'SHIPPED'
                              ? 'bg-indigo-500'
                              : 'bg-blue-500'
                      }`}>
                        <Package className="h-3 w-3" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.orderStatus === 'PENDING' ? 'Chờ xử lý' :
                        order.orderStatus === 'PROCESSING' ? 'Đang xử lý' :
                        order.orderStatus === 'SHIPPED' ? 'Đã giao hàng' :
                        order.orderStatus === 'DELIVERED' ? 'Đã giao hàng' :
                        order.orderStatus === 'CANCELLED' ? 'Đơn hàng đã hủy' : 'Trạng thái đơn hàng đã cập nhật'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 