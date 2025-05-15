export enum PaymentMethod {
  COD = 'COD',
  TRANSFER = 'TRANSFER'
}

export const PAYMENT_METHODS = [
  {
    id: PaymentMethod.COD,
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán khi nhận hàng'
  },
  {
    id: PaymentMethod.TRANSFER,
    name: 'Chuyển khoản',
    description: 'Thanh toán qua chuyển khoản'
  }
];

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const paymentMethod = PAYMENT_METHODS.find(m => m.id === method);
  return paymentMethod?.name || '';
}; 