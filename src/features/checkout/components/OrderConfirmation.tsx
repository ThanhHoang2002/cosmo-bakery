import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  // Scroll to top on component mount and invalidate cart
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Vô hiệu hóa truy vấn giỏ hàng sau khi trang đã được hiển thị
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }, [queryClient]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Đơn hàng đã hoàn tất!</h1>
        <p className="mb-6 text-gray-600">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được nhận và sẽ được xử lý sớm.
        </p>
        
        <div className="mb-8 rounded-md bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            Mã đơn hàng của bạn: <span className="font-bold text-gray-900">#{orderId}</span>
          </p>
          <p className="text-sm text-gray-600">
            Bạn sẽ nhận được email xác nhận sớm.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Link
            to="/"
            className="flex-1 rounded-md border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Trở lại trang chủ
          </Link>
          <Link
            to="/category/paddles"
            className="flex-1 rounded-md bg-primary px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
}; 

export default OrderConfirmation;