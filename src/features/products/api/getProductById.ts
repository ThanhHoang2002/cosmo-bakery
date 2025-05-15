import { Product } from "../types";

import axiosPublic from "@/lib/axios-public";
import { ApiResponse } from "@/types/apiResponse";

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axiosPublic.get<ApiResponse<Product>>(`products/${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};  