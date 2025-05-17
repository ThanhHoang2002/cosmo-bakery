import { Item, sfAnd, sfEqual, sfGe, sfLe, sfLike } from "spring-filter-query-builder";

import { Product } from "@/features/products/types";
import axiosPublic from "@/lib/axios-public";
import { ApiResponse } from "@/types/apiResponse";
import { DetailResponse } from "@/types/detailResponse";
export interface ProductsParams {
  page?: number;
  size?: number;
  search?: string;
  categoryId?: number;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
  minPrice?: number;
  maxPrice?: number;
}
export const getAllProduct = async (
  params: ProductsParams
): Promise<DetailResponse<Product[]>> => {
  const filter = sfAnd(
    [
      params.search && sfLike("name", params.search),
      params.categoryId && sfEqual("category.id", params.categoryId),
      params.status && sfEqual("status", params.status),
      params.minPrice && sfGe("sellPrice", params.minPrice),
      params.maxPrice && sfLe("sellPrice", params.maxPrice),

    ].filter(Boolean) as Item[]
  );
  
  // API cũng bắt đầu từ trang 1, nên không cần chuyển đổi
  // Chỉ đảm bảo page có giá trị hợp lệ (>=1) hoặc mặc định là 1
  const apiPage = params.page !== undefined ? Math.max(1, params.page) : 1;
  
  console.log('API call with params:', {
    page: apiPage,
    categoryId: params.categoryId,
    filters: filter.toString()
  });
  
  const response = await axiosPublic.get<ApiResponse<DetailResponse<Product[]>>>(
    "/products",
    {
      params: {
        page: apiPage,
        size: params.size || 15,
        filter: filter.toString()==="()"?undefined:filter.toString(),
        sortBy: params.sortBy,
        sortDirection: params.sortDirection?.toUpperCase(),
      },
    }
  );
  
  // Không cần điều chỉnh page trong kết quả vì cả UI và API đều sử dụng 1-based
  return response.data.data;
};