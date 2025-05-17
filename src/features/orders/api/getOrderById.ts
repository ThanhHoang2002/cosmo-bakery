import { Order } from "../types";

import axiosClient from "@/lib/axios-client";
import { ApiResponse } from "@/types/apiResponse";

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await axiosClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
}; 