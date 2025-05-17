import { useQuery } from "@tanstack/react-query";

import { getCategoryById } from "../api/categoryApi";

import { useToast } from "@/hooks/use-toast";

/**
 * Hook để lấy thông tin danh mục theo ID
 */
export const useCategoryById = (id: number) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      try {
        const response = await getCategoryById(id);
        return response.data;
      } catch (error: unknown) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin danh mục. Vui lòng thử lại sau.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 phút
  });
}; 