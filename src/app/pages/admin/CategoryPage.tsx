import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, FileText, MoreVertical, ArrowUpDown, Plus, Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryDialog } from '@/features/categories/components/CategoryDialog';
import { CategoryToolbar } from '@/features/categories/components/CategoryToolbar';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useDeleteCategory } from '@/features/categories/hooks/useDeleteCategory';
import { Category } from '@/features/categories/types';

// Memo component cho CategoryRow để tránh re-render không cần thiết
const CategoryTableRow = memo(({ 
  category, 
  formatDate, 
  onEditClick, 
  onDeleteClick 
}: { 
  category: Category, 
  formatDate: (date: string | null) => string,
  onEditClick: (category: Category) => void, 
  onDeleteClick: (category: Category) => void 
}) => {
  return (
    <TableRow key={category.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {category.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-xs text-muted-foreground">#{category.id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-1">
          <FileText className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
          <span className="max-w-[300px] truncate text-sm">
            {category.description || "No description available."}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{formatDate(category.createdAt)}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{category.createdBy}</span>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Mở menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditClick(category)}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa danh mục
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDeleteClick(category)}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa danh mục
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});

CategoryTableRow.displayName = 'CategoryTableRow';

// Memo component cho SortableHeader để tránh re-render không cần thiết
const SortableHeader = memo(({ 
  column, 
  label, 
  sortBy, 
  sortOrder, 
  onToggleSort 
}: { 
  column: string, 
  label: string, 
  sortBy: string | undefined, 
  sortOrder: 'asc' | 'desc' | undefined, 
  onToggleSort: (column: string) => void 
}) => {
  return (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onToggleSort(column)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={14} className="ml-1" />
        {sortBy === column && (
          <span className="ml-1 text-xs">
            ({sortOrder === 'asc' ? '↑' : '↓'})
          </span>
        )}
      </div>
    </TableHead>
  );
});

SortableHeader.displayName = 'SortableHeader';

// Memo component cho DeleteDialog
const DeleteDialog = memo(({ 
  isOpen, 
  isDeleting, 
  categoryName, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean, 
  isDeleting: boolean, 
  categoryName: string | undefined, 
  onClose: () => void, 
  onConfirm: () => void 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa danh mục <strong>{categoryName}</strong>? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Hủy bỏ
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

DeleteDialog.displayName = 'DeleteDialog';

// Memo component cho PaginationControls
const PaginationControls = memo(({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  onPageChange 
}: { 
  currentPage: number, 
  totalPages: number, 
  totalItems: number, 
  pageSize: number, 
  onPageChange: (page: number) => void 
}) => {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <div>
        Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} của {totalItems} danh mục
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';

const CategoryPage = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Use the category hooks
  const {
    categories,
    meta,
    isLoading,
    filters,
    handleSearch,
    handlePageChange,
    handleSortChange,
  } = useCategories();

  const { deleteCategory, isDeleting } = useDeleteCategory({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
    }
  });

  // Handle edit button click - memoize callback
  const handleEditClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsFormDialogOpen(true);
  }, []);

  // Handle delete button click - memoize callback
  const handleDeleteClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  }, []);

  // Handle add new button click - memoize callback
  const handleAddNewClick = useCallback(() => {
    setSelectedCategory(null);
    setIsFormDialogOpen(true);
  }, []);

  // Handle delete confirmation - memoize callback
  const handleConfirmDelete = useCallback(() => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
    }
  }, [deleteCategory, selectedCategory]);

  // Handle dialog close - memoize callback
  const handleFormDialogClose = useCallback(() => {
    setIsFormDialogOpen(false);
  }, []);

  // Handle delete dialog close - memoize callback
  const handleDeleteDialogClose = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  // Format date - memoize callback
  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }, []);

  // Toggle sort direction - memoize callback
  const toggleSort = useCallback((column: string) => {
    const direction = 
      filters.sortBy === column && filters.sortOrder === 'asc' 
        ? 'desc' 
        : 'asc';
    handleSortChange(column, direction);
  }, [filters.sortBy, filters.sortOrder, handleSortChange]);

  // Memoize các hàng của table để tránh re-render không cần thiết
  const categoryRows = useMemo(() => {
    return categories.map((category) => (
      <CategoryTableRow
        key={category.id}
        category={category}
        formatDate={formatDate}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
    ));
  }, [categories, formatDate, handleEditClick, handleDeleteClick]);

  return (
    <motion.div 
      className="container mx-auto py-8" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Button onClick={handleAddNewClick} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>
      
      {/* Search and add toolbar */}
      <CategoryToolbar 
        onSearch={handleSearch}
        onAddNew={handleAddNewClick}
      />
      
      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader 
                column="name" 
                label="Danh mục" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onToggleSort={toggleSort} 
              />
              <SortableHeader 
                column="description" 
                label="Mô tả" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onToggleSort={toggleSort} 
              />
              <SortableHeader 
                column="createdAt" 
                label="Ngày tạo" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onToggleSort={toggleSort} 
              />
              <SortableHeader 
                column="createdBy" 
                label="Người tạo" 
                sortBy={filters.sortBy} 
                sortOrder={filters.sortOrder} 
                onToggleSort={toggleSort} 
              />
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Đang tải danh mục...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không có danh mục nào.
                </TableCell>
              </TableRow>
            ) : (
              categoryRows
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {meta && meta.total > 0 && (
        <PaginationControls
          currentPage={meta.page}
          totalPages={meta.pages}
          totalItems={meta.total}
          pageSize={meta.pageSize}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Category Form Dialog */}
      <CategoryDialog
        isOpen={isFormDialogOpen}
        onOpenChange={handleFormDialogClose}
        category={selectedCategory}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        categoryName={selectedCategory?.name}
        onClose={handleDeleteDialogClose}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  );
};

export default CategoryPage;