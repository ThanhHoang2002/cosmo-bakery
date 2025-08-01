import { Link, useParams } from 'react-router-dom';

import GlobalLoading from '@/components/loading/GlobalLoading';
import { ProductDetails } from '@/features/products/components/ProductDetails';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useProductById, useProductsByCategory } from '@/features/products/hooks/useProducts';

export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch product data
  const { 
    data: product, 
    isLoading: isProductLoading, 
    isError: isProductError 
  } = useProductById(id ? Number(id) : 0);
  
  // Lấy sản phẩm liên quan bằng categoryId khi product data có sẵn
  const categoryId = product?.category?.id;
  const { 
    data: relatedProductsData, 
    isLoading: isRelatedLoading,
    isError: isRelatedError
  } = useProductsByCategory(
    categoryId || 0, // Sử dụng categoryId thay vì categoryName, mặc định là 0 nếu không có
    { size: 4 }
  );
  
  // Combine loading states
  const isLoading = isProductLoading || isRelatedLoading;
  const isError = isProductError || isRelatedError;
  // Filter out the current product from related products
  const relatedProducts = relatedProductsData?.result?.filter(
    p => p.id !== product?.id
  ) || [];
  
  if (isLoading) {
    return <GlobalLoading/>;
  }
  
  if (isError || !product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm không tồn tại</h1>
          <p className="mt-2 text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">Home</Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <Link to={`/category/${product.category.id}`} className="text-sm text-gray-500 hover:text-gray-700">
              {product.category.name}
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-sm text-gray-700">{product.name}</span>
          </li>
        </ol>
      </nav>
      
      {/* Product details */}
      <ProductDetails product={product} />
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <ProductGrid
            products={relatedProducts}
            title="Sản phẩm tương tự"
          />
        </div>
      )}
    </div>
  );
}; 