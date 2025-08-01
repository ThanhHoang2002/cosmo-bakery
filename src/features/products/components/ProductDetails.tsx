import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Product } from '../types';

import { useCart } from '@/features/cart/hooks/useCart';
import { formatCurrency } from '@/utils/format';

type ProductDetailsProps = {
  product: Product;
};

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem(product?.id, quantity);
  };

  // Xử lý mô tả sản phẩm dưới dạng markdown
  const markdownDescription = product?.description || '';
  
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Product image */}
      <div className="flex flex-col gap-4">
        <motion.div 
          className="aspect-square overflow-hidden rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={product?.image}
            alt={product?.name}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </div>

      {/* Product info */}
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
           
        <div className="mt-4 flex items-center">
          <span className="text-2xl font-semibold text-gray-900">
            {formatCurrency(product.sellPrice)}
          </span>
        </div>

        <div 
          ref={descriptionRef} 
          className={`prose prose-sm mt-6 max-w-none text-gray-700 ${!isDescriptionExpanded ? 'max-h-24 overflow-hidden' : ''}`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownDescription}
          </ReactMarkdown>
        </div>
        
        {markdownDescription && markdownDescription.length > 0 && (
          <button 
            onClick={toggleDescription}
            className="mt-1 text-left text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
          >
            {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm ...'}
          </button>
        )}

        {/* Quantity selector */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900">Số lượng</h3>
          <div className="mt-2 flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              -
            </button>
            <div className="w-12 border-y border-gray-300 px-3 py-2 text-center">{quantity}</div>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 hover:bg-gray-100"
              disabled={quantity >= product?.quantity}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart button */}
        <motion.button
          onClick={handleAddToCart}
          className="mt-8 w-full rounded-md bg-black py-3 text-center text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={product?.quantity <= 0}
        >
          {product?.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
        </motion.button>

        {/* Product information */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-900">Thông tin sản phẩm</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Mã sản phẩm</span>
              <span className="text-sm font-medium">{product?.id}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Danh mục</span>
              <span className="text-sm font-medium">{product?.category?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Trạng thái</span>
              <span className={`text-sm font-medium ${product?.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product?.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Số lượng còn lại</span>
              <span className="text-sm font-medium">{product?.quantity}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 