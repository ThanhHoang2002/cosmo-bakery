import { Plus, Search, CircleDollarSign, Edit, Trash } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PRODUCT_STATUS_VI } from '@/constant/product-status';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { Category } from '@/features/categories/types';
import ConfirmDeleteDialog from '@/features/products/components/ConfirmDeleteDialog';
import PaginationControl from '@/features/products/components/PaginationControl';
import ProductDialog from '@/features/products/components/ProductDialog';
import SortableHeader from '@/features/products/components/SortableHeader';
import { useAdminProducts } from '@/features/products/hooks/useAdminProducts';
import { useToast } from '@/hooks/use-toast';

const ProductPage = () => {
  const {
    products,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    isLoading,
    isError,
    currentProduct,
    isProductDialogOpen,
    isDeleteDialogOpen,
    filters,
    sortField,
    sortDirection,
    handleAddProduct,
    handleEditProduct,
    handleDeleteClick,
    handleDeleteConfirm,
    handleSaveProduct,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleItemsPerPageChange,
    setIsProductDialogOpen,
    setIsDeleteDialogOpen,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminProducts();

  const { categories } = useCategories();
  const [searchInput, setSearchInput] = useState(filters.search);
  const { toast } = useToast();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Handle search input submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchChange(searchInput);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMING_SOON':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle xử lý xóa sản phẩm
  const handleConfirmDelete = async () => {
    setDeleteError(null);
    const result = await handleDeleteConfirm();
    
    if (!result.success) {
      setDeleteError(result.message);
      
      // Hiển thị thông báo lỗi dùng toast
      toast({
        variant: "destructive",
        title: "Không thể xóa sản phẩm",
        description: result.message,
      });
    } else {
      // Xóa thành công, hiển thị thông báo thành công
      toast({
        title: "Sản phẩm đã được xóa thành công",
        description: "Sản phẩm đã được xóa thành công",
      });
    }
  };

  // Đóng dialog xóa và reset lỗi
  const handleCloseDeleteDialog = () => {
    setDeleteError(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative col-span-2 flex"
        >
          <Input
              placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-10"
          />
          <Button
            type="submit"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Category filter */}
        <Select
          value={filters.categoryName || "all"}
          onValueChange={(value: string) => 
            handleFilterChange({ categoryName: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value: string) => 
            handleFilterChange({ status: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
            <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
            <SelectItem value="COMING_SOON">Sắp ra mắt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price range filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Giá min"
            value={filters.minPrice || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              handleFilterChange({ minPrice: value });
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            placeholder="Giá max"
            value={filters.maxPrice || ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              handleFilterChange({ maxPrice: value });
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                field="id"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSortChange}
              >
                ID
              </SortableHeader>
              <SortableHeader
                field="name"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSortChange}
              >
                Tên sản phẩm
              </SortableHeader>
              <SortableHeader
                field="sellPrice"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSortChange}
              >
                Giá bán
              </SortableHeader>
              <SortableHeader
                field="quantity"
                currentSortField={sortField}
                currentSortDirection={sortDirection}
                onSort={handleSortChange}
              >
                Tồn kho
              </SortableHeader>
              <TableHead>Danh mục</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="flex items-center justify-center py-4">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Đang tải sản phẩm...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500">
                  <div className="py-4">
                    <p className="font-medium">Lỗi tải sản phẩm</p>
                    <p className="mt-1 text-sm">Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="py-8">
                    <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
                    {filters.search || filters.categoryName || filters.status || filters.minPrice || filters.maxPrice ? (
                      <p className="mt-2 text-sm text-muted-foreground">Vui lòng điều chỉnh các bộ lọc</p>
                    ) : (
                      <Button 
                        onClick={handleAddProduct} 
                        variant="outline" 
                        className="mt-4"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm sản phẩm
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-md">
                        <img
                          src={product.image || '/placeholder.png'}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(product.sellPrice)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadge(
                        product.status
                      )}`}
                    >
                      {PRODUCT_STATUS_VI[product.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Product Dialog */}
      <ProductDialog
        open={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSave={handleSaveProduct}
        product={currentProduct || undefined}
        isSubmitting={currentProduct ? isUpdating : isCreating}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${currentProduct?.name}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};

export default ProductPage;