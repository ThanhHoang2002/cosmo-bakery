import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Product } from '../types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/features/cart/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

// Main ProductCard component
interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

export const ProductCard = ({ product, isLoading }: ProductCardProps) => {
  // Format product to handle both new API format and maintain backward compatibility
  const formattedProduct = useMemo(() => {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug || `product-${product.id}`,
      price: product.price || product.sellPrice || 0,
      originalPrice: product.originalPrice,
      image: product.images?.[0] || product.image,
      isOnSale: product.isOnSale || Boolean(product.originalPrice),
      isNew: Boolean(product.isNewArrival),
      isBestSeller: Boolean(product.isBestSeller),
    };
  }, [product]);

  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(formattedProduct.id, 1);
    toast({
      title: 'Thêm vào giỏ hàng',
      description: 'Đã thêm sản phẩm vào giỏ hàng',
    });
  };

  if (isLoading) {
    return (
      <Card className="group flex flex-col items-center justify-center space-y-4 overflow-hidden p-3 transition-all hover:shadow-md">
        <Skeleton className="h-48 w-44" />
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-10 w-44" />
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <Link to={`/products/${formattedProduct.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={formattedProduct.image}
            alt={formattedProduct.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            containerClassName="h-full"
          />
          {formattedProduct.isNew && (
            <span className="absolute left-2 top-2 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
              Mới
            </span>
          )}
          {formattedProduct.isBestSeller && (
            <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white">
              Bán chạy
            </span>
          )}
          {formattedProduct.isOnSale && (
            <span className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white">
              Sale
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/products/${formattedProduct.id}`} className="block">
          <CardTitle className="line-clamp-1 text-base font-medium">
            {formattedProduct.name}
          </CardTitle>
          <div className="mt-2 flex items-center">
            <span className={`font-medium ${formattedProduct.originalPrice ? 'text-red-600' : 'text-primary'}`}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(formattedProduct.price)}
            </span>
            
            {formattedProduct.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(formattedProduct.originalPrice)}
              </span>
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          variant="outline"
        >
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
};
