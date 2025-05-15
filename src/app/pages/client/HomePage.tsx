import { motion } from 'framer-motion';

import GlobalLoading from '@/components/loading/GlobalLoading';
import { useCategories } from '@/features/categories';
import { CategoryGrid } from '@/features/categories/components/CategoryGrid';
import { getAboutInfo } from '@/features/landing/api/getAboutInfo';
import { getBanners } from '@/features/landing/api/getBanners';
import { AboutSection } from '@/features/landing/components/AboutSection';
import { Hero } from '@/features/landing/components/Hero';
import { ProductList } from '@/features/products/components/ProductList';
import { useAllProducts } from '@/features/products/hooks/useProducts';
import { Product } from '@/features/products/types';



const HomePage = () => {
  // Dữ liệu mẫu cho banner
  const banners = getBanners();
  
  const { categories, isLoading: isLoadingCategories } = useCategories({
    page: 1,
    size: 3,
  });
  const { data : newProducts, isLoading: isLoadingProducts } = useAllProducts({
    page: 1,
    size: 6,
  });
  const { data : bestSellerProducts, isLoading: isLoadingBestSellerProducts } = useAllProducts({
    page: 5,
    size: 6,
  });
  // Dữ liệu mẫu cho sản phẩm mới
  const aboutInfo = getAboutInfo();
  const isLoading = isLoadingCategories || isLoadingProducts || isLoadingBestSellerProducts;
  if (isLoading) {
    return <GlobalLoading/>;
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <Hero banners={banners} />
      
      <CategoryGrid categories={categories} />
      
        <ProductList 
          products={newProducts?.result as Product[]} 
          title="Sản phẩm mới"
          viewAllUrl="/category"
          label="isNewArrival"
        />  
  
        <ProductList 
          title="Sản phẩm bán chạy" 
          products={bestSellerProducts?.result as Product[]} 
          viewAllUrl="/category" 
          label="isBestSeller"
        />
      
      <AboutSection data={aboutInfo} />
    </motion.div>
  );
};

export default HomePage; 