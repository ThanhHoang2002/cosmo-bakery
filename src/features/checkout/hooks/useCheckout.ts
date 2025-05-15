import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { CreateOrderRequest, checkoutApi } from '../api/checkoutApi';
import { PaymentMethod } from '../constants/paymentMethods';

import { useToast } from '@/hooks/use-toast';

export const useCheckout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: checkout, isPending: isLoading, error } = useMutation({
    mutationFn: (data: CreateOrderRequest) => checkoutApi.createOrder(data),
    onSuccess: (response) => {
      if(response.order.paymentMethod === PaymentMethod.COD){
        toast({
          title: 'Đặt hàng thành công',
          description: `Đơn hàng của bạn #${response.order.id} đã được đặt thành công.`,
        });
        navigate(`/confirmation/${response.order.id}`);
      }else{
        window.open(response.order.paymentUrl, '_blank');
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Thanh toán thất bại',
        description: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  });

  return {
    checkout,
    isLoading,
    error
  };
}; 