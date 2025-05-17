import { Loader2, Search } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCart } from '@/features/cart';
import { useCategoryById } from '@/features/categories/hooks';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useProductsParams } from '@/features/products/hooks/useProductParams';
import { useProductsByCategory } from '@/features/products/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';

// Số sản phẩm mỗi trang
export const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { filters, updateFilters } = useProductsParams();
  const { addItem } = useCart();
  
  // Lấy thông tin danh mục từ ID
  const { data: categoryData, isLoading: isCategoryLoading } = useCategoryById(
    categoryId ? parseInt(categoryId) : 0
  );
  
  // Trích xuất các tham số lọc từ URL đã được memo hóa
  const { minPrice, maxPrice, sortBy, sortDirection, searchTerm } = useMemo(() => ({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
    searchTerm: filters.search
  }), [filters]);
  
  // State để lưu trữ giá trị đang nhập trước khi debounce
  const [minPriceInput, setMinPriceInput] = useState<number | undefined>(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState<number | undefined>(maxPrice);
  const [searchInput, setSearchInput] = useState<string>(searchTerm || '');
  
  // Sử dụng debounce cho giá trị giá và search
  const debouncedMinPrice = useDebounce<number | undefined>(minPriceInput, { delay: 500 });
  const debouncedMaxPrice = useDebounce<number | undefined>(maxPriceInput, { delay: 500 });
  const debouncedSearchTerm = useDebounce<string>(searchInput, { delay: 500 });
  
  // Lưu trữ category hiện tại để theo dõi thay đổi
  const [previousCategory, setPreviousCategory] = useState<string | undefined>(categoryId);
  
  // Xử lý thay đổi category - được memo hóa để tránh tạo lại hàm
  const handleCategoryChange = useCallback(() => {
    if (!categoryId) return;
    
    // Reset search
    setSearchInput('');
    
    // Reset price inputs
    setMinPriceInput(undefined);
    setMaxPriceInput(undefined);
    
    // Cập nhật filters với category mới và reset các bộ lọc
    updateFilters({
      categoryId: parseInt(categoryId),
      size: 18,
      page: 1,
      search: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      sortDirection: undefined
    });
    
    // Cập nhật previous category
    setPreviousCategory(categoryId);
  }, [categoryId, updateFilters]);
  
  // Cập nhật category filter từ URL parameter - chỉ chạy khi categoryId thay đổi
  useEffect(() => {
    if (categoryId && categoryId !== previousCategory) {
      handleCategoryChange();
    }
  }, [categoryId, previousCategory, handleCategoryChange]);
  
  // Đảm bảo categoryId luôn được áp dụng vào filters khi component mount hoặc khi categoryId thay đổi
  useEffect(() => {
    if (categoryId && (!filters.categoryId || parseInt(categoryId) !== filters.categoryId)) {
      console.log('CategoryId needs update in filters', {
        categoryId,
        currentFilterCategoryId: filters.categoryId,
        currentPage: filters.page
      });
      
      // Cập nhật categoryId mà không làm mất các tham số lọc khác
      // Sử dụng setImmediate để đảm bảo chỉ cập nhật một lần sau mỗi render cycle
      const timerId = setTimeout(() => {
        updateFilters({
          categoryId: parseInt(categoryId)
        });
      }, 0);
      
      return () => clearTimeout(timerId);
    }
  }, [categoryId, filters.categoryId, updateFilters]);
  
  // Fetch sản phẩm theo danh mục
  const { data: productData, isLoading, isFetching } = useProductsByCategory(
    parseInt(categoryId ?? ''), 
    filters
  );
  
  // Memo hóa meta data để tránh tính toán lại không cần thiết
  const { totalPages, currentPage } = useMemo(() => ({
    totalPages: productData?.meta?.pages || 0,
    currentPage: filters.page || 1
  }), [productData?.meta, filters.page]);
  
  // Tạo tiêu đề dựa trên danh mục - được memo hóa để tránh tính toán lại
  const pageTitle = useMemo(() => {
    if (isCategoryLoading) {
      return 'Đang tải...';
    }
    
    if (!categoryData) {
      return 'Tất cả sản phẩm';
    }
    
    return categoryData.name;
  }, [isCategoryLoading, categoryData]);
  
  // Cập nhật URL khi giá trị debounced thay đổi
  useEffect(() => {
    if (debouncedMinPrice !== minPrice) {
      updateFilters({ minPrice: debouncedMinPrice, page: 1 });
    }
  }, [debouncedMinPrice, minPrice, updateFilters]);
  
  useEffect(() => {
    if (debouncedMaxPrice !== maxPrice) {
      updateFilters({ maxPrice: debouncedMaxPrice, page: 1 });
    }
  }, [debouncedMaxPrice, maxPrice, updateFilters]);
  
  // Cập nhật URL khi search term thay đổi
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      updateFilters({ search: debouncedSearchTerm, page: 1 });
    }
  }, [debouncedSearchTerm, searchTerm, updateFilters]);
  
  // Xử lý xóa search - được memo hóa để tránh tạo lại hàm
  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    updateFilters({ search: undefined, page: 1 });
  }, [updateFilters]);
  
  // Xử lý thay đổi giá tối thiểu - đã được memo hóa
  const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    setMinPriceInput(value);
  }, []);
  
  // Xử lý thay đổi giá tối đa - đã được memo hóa
  const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value);
    setMaxPriceInput(value);
  }, []);
  
  // Xử lý reset bộ lọc giá - đã được memo hóa
  const handleResetPriceFilter = useCallback(() => {
    setMinPriceInput(undefined);
    setMaxPriceInput(undefined);
    updateFilters({ minPrice: undefined, maxPrice: undefined, page: 1 });
  }, [updateFilters]);
  
  // Xử lý nhập tìm kiếm - đã được memo hóa
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);
  
  // Xử lý chuyển trang - đã được memo hóa
  const handlePageChange = useCallback((page: number) => {
    console.log('Page change requested:', page, 'Current page:', filters.page);
    if (page !== filters.page) {
      updateFilters({ page });
    }
  }, [filters.page, updateFilters]);
  
  // Theo dõi sự thay đổi trang - log để debug
  useEffect(() => {
    console.log('Current page from filters:', filters.page);
  }, [filters.page]);
  
  // Xử lý thay đổi sắp xếp - đã được memo hóa
  const handleSortChange = useCallback((value: string) => {
    if (!value) {
      updateFilters({ 
        sortBy: undefined, 
        sortDirection: undefined,
        page: 1
      });
      return;
    }

    const [field, direction] = value.split('-');
    updateFilters({ 
      sortBy: field, 
      sortDirection: direction as 'asc' | 'desc',
      page: 1
    });
  }, [updateFilters]);

  // Tạo các nút phân trang - đã được memo hóa để tránh tạo lại khi re-render
  const paginationItems = useMemo(() => {
    // Mảng chứa các nút hiển thị
    const items = [];
    
    // Giới hạn số nút hiển thị
    const maxVisiblePages = 5;
    
    // Tính toán phạm vi hiển thị
    let startPage: number;
    let endPage: number;
    
    if (totalPages <= maxVisiblePages) {
      // Nếu số trang ít hơn giới hạn, hiển thị tất cả
      startPage = 1;
      endPage = totalPages;
    } else {
      // Tính toán phạm vi hiển thị khi số trang nhiều
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // Trang hiện tại gần đầu
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // Trang hiện tại gần cuối
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Trang hiện tại ở giữa
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }
    
    // Thêm nút trang đầu tiên
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Thêm dấu chấm lửng nếu không liền kề với trang đầu
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Thêm các nút trang trong phạm vi
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => handlePageChange(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Thêm nút trang cuối cùng
    if (endPage < totalPages) {
      // Thêm dấu chấm lửng nếu không liền kề với trang cuối
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  }, [totalPages, currentPage, handlePageChange]);
  
  if (!categoryId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Danh mục không tồn tại</h1>
          <p className="mt-2 text-gray-600">Danh mục bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold capitalize text-gray-900">{pageTitle}</h1>
        <p className="mt-4 text-gray-600">
          {categoryData?.description || "Khám phá những sản phẩm tốt nhất cho tất cả nhu cầu của bạn"}
        </p>
      </div>
      
      {/* Search bar - Hiển thị ở trên cùng */}
      <div className="mb-8">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-12 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          {searchInput && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={handleClearSearch}
            >
              <span className="text-xl">&times;</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Filters - sidebar */}
        <div className="hidden md:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
                            
              {/* Lọc theo giá */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Giá</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price-min" className="sr-only">
                      Giá thấp nhất
                    </label>
                    <input
                      type="number"
                      id="price-min"
                      placeholder="Min"
                      value={minPriceInput ?? ''}
                      onChange={handleMinPriceChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="price-max" className="sr-only">
                      Giá cao nhất
                    </label>
                    <input
                      type="number"
                      id="price-max"
                      placeholder="Max"
                      value={maxPriceInput ?? ''}
                      onChange={handleMaxPriceChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                {/* Reset button for price filter */}
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <button
                    onClick={handleResetPriceFilter}
                    className="mt-2 text-xs text-gray-600 hover:text-black"
                  >
                    Reset giá
                  </button>
                )}
              </div>
              
              {/* Sắp xếp */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Sắp xếp</h4>
                <select
                  value={sortBy && sortDirection ? `${sortBy}-${sortDirection}` : ''}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Mặc định</option>
                  <option value="sellPrice-asc">Giá: Thấp đến Cao</option>
                  <option value="sellPrice-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product grid and pagination */}
        <div className="md:col-span-3">
          {/* Thông báo search results */}
          {searchTerm && !isLoading && (
            <div className="mb-6 flex justify-between">
              <p className="text-sm text-gray-600">
                Search results for <span className="font-medium">&ldquo;{searchTerm}&rdquo;</span>
              </p>
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={handleClearSearch}
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
          
          <ProductGrid 
            products={productData?.result || []}
            cols={3}
            emptyMessage={isLoading ? 'Đang tải sản phẩm...' : 'Không tìm thấy sản phẩm phù hợp.'}
            addItem={addItem}
          />
          
          {/* Hiển thị loading spinner khi đang fetch */}
          {isFetching && (
            <div className="my-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
          
          {/* Phân trang với shadcn/ui Pagination */}
          {!isLoading && totalPages > 0 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {/* Nút Previous */}
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {/* Các nút số trang */}
                {paginationItems}
                
                {/* Nút Next */}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}; 