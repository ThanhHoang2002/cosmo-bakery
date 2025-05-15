import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { CreateOrderRequest } from '../api/checkoutApi';
import { PaymentMethod, PAYMENT_METHODS } from '../constants/paymentMethods';
import { useCheckout } from '../hooks/useCheckout';

// Define validation schema
const checkoutSchema = z.object({
  phone: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
    .max(15, 'Số điện thoại phải có tối đa 15 chữ số')
    .regex(/^[0-9]+$/, 'Số điện thoại phải chứa chữ số'),
  address: z.string()
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(200, 'Địa chỉ phải có tối đa 200 ký tự'),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    required_error: 'Vui lòng chọn phương thức thanh toán',
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CheckoutForm = () => {
  const { checkout, isLoading } = useCheckout();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: '',
      address: '',
      paymentMethod: PaymentMethod.COD,
    }
  });

  const onSubmit = (data: CheckoutFormValues) => {
    const orderData: CreateOrderRequest = {
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
    };
    checkout(orderData);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setValue('paymentMethod', method);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Thông tin thanh toán</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Phone number */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={`w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
            placeholder="Nhập số điện thoại"
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
        
        {/* Address */}
        <div className="mb-6">
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
            Địa chỉ giao hàng <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            rows={3}
            className={`w-full rounded-md border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
            placeholder="Nhập địa chỉ giao hàng"
            {...register('address')}
            aria-invalid={errors.address ? 'true' : 'false'}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
        
        {/* Payment method */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phương thức thanh toán <span className="text-red-500">*</span>
          </label>
          
          <div className="mt-2 space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <div 
                key={method.id}
                className={`flex cursor-pointer items-center rounded-md border p-3 ${selectedPaymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                onClick={() => !isLoading && handlePaymentMethodChange(method.id)}
              >
                <input
                  type="radio"
                  id={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => handlePaymentMethodChange(method.id)}
                  className="h-4 w-4 text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <label htmlFor={method.id} className="ml-3 block cursor-pointer">
                  <span className="font-medium text-gray-900">{method.name}</span>
                  <span className="block text-sm text-gray-500">{method.description}</span>
                </label>
              </div>
            ))}
          </div>
          
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-500">{errors.paymentMethod.message}</p>
          )}
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-primary px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Đang xử lý...
            </div>
          ) : (
            'Đặt hàng'
          )}
        </button>
      </form>
    </div>
  );
}; 