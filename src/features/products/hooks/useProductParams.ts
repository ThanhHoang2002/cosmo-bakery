import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import { ProductsParams } from "../api/getAllProduct";


export const useProductsParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductsParams = {
    page: Number(searchParams.get("page")) || 1,
    size: Number(searchParams.get("size")) || 15,
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    sortDirection: searchParams.get("sortDirection") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  };

  const updateFilters = useCallback(
    (newFilters: Partial<ProductsParams>) => {
      const updatedParams = new URLSearchParams(searchParams);
      let shouldResetPage = false;

      // Kiểm tra xem có cần reset page về 1 không
      if (newFilters.search !== undefined || 
          newFilters.minPrice !== undefined || 
          newFilters.maxPrice !== undefined || 
          newFilters.sortBy !== undefined ||
          newFilters.sortDirection !== undefined) {
        // Nếu là thay đổi search, filter, hoặc sort, thì reset page
        shouldResetPage = true;
      }

      // Cập nhật chỉ các params mới
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          updatedParams.set(key, value.toString().trim());
        } else {
          updatedParams.delete(key);
        }
      });

      // Nếu cần reset page và không có tham số page được chỉ định trực tiếp
      if (shouldResetPage && newFilters.page === undefined) {
        updatedParams.set("page", "1");
      }

      // Log để debug
      console.log('Updating filters', {
        newFilters,
        shouldResetPage,
        currentPage: searchParams.get("page"),
        newPage: updatedParams.get("page")
      });

      setSearchParams(updatedParams);
    },
    [searchParams, setSearchParams]
  );
  return { filters, updateFilters };
};
