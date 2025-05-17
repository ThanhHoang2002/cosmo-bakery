import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';

import CustomerDialog from '@/features/customers/components/CustomerDialog';
import CustomerPagination from '@/features/customers/components/CustomerPagination';
import CustomerSearchBar from '@/features/customers/components/CustomerSearchBar';
import CustomerTable from '@/features/customers/components/CustomerTable';
import { CustomerDialogMode } from '@/features/customers/constants';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { Customer, CustomerFormData } from '@/features/customers/types/customer';
import { formatDate } from '@/features/customers/utils/formatDate';
import { useToast } from '@/hooks/use-toast';

/**
 * Admin Customer Management Page
 * 
 * Displays a list of customers with search, pagination and detail view functionality
 */
const CustomerPage = () => {
  // Toast for notifications
  const { toast } = useToast();
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<CustomerDialogMode>(CustomerDialogMode.VIEW);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
  // Loading state for api calls
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Use custom hook for customers data and operations
  const { 
    customers,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    refreshData
  } = useCustomers();

  // Open dialog for viewing customer details
  const handleViewCustomer = useCallback(async (customer: Customer) => {
    try {
      // Fetch detailed customer information
      const detailedCustomer = await fetchCustomerById(customer.id);
      setCurrentCustomer(detailedCustomer);
      setDialogMode(CustomerDialogMode.VIEW);
      setDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khách hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lấy thông tin khách hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [fetchCustomerById, toast]);

  // Open dialog for editing customer
  const handleEditCustomer = useCallback(async (customer: Customer) => {
    try {
      // Fetch detailed customer information for editing
      const detailedCustomer = await fetchCustomerById(customer.id);
      setCurrentCustomer(detailedCustomer);
      setDialogMode(CustomerDialogMode.EDIT);
      setDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin khách hàng cho chỉnh sửa:", error);
      toast({
        title: "Lỗi",
        description: "Không thể chuẩn bị khách hàng cho chỉnh sửa. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }, [fetchCustomerById, toast]);

  // Open dialog for creating a new customer
  const handleCreateCustomer = useCallback(() => {
    setCurrentCustomer(null);
    setDialogMode(CustomerDialogMode.CREATE);
    setDialogOpen(true);
  }, []);

  // Close dialog
  const handleCloseDialog = useCallback(() => {
    if (!isSubmitting) {
      setDialogOpen(false);
    }
  }, [isSubmitting]);

  // Save customer (create or update)
  const handleSaveCustomer = useCallback(async (formData: CustomerFormData) => {
    try {
      setIsSubmitting(true);
      if (dialogMode === CustomerDialogMode.CREATE) {
        await createCustomer(formData);
        toast({
          title: "Thành công",
          description: "Khách hàng đã được tạo thành công.",
        });
      } else if (dialogMode === CustomerDialogMode.EDIT && currentCustomer) {
        await updateCustomer(currentCustomer.id, formData);
        toast({
          title: "Thành công",
          description: "Khách hàng đã được cập nhật thành công.",
        });
      }
      setDialogOpen(false);
      // Refresh customer list after create/update
      refreshData();
    } catch (error) {
      console.error("Lỗi khi lưu khách hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu khách hàng. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createCustomer, updateCustomer, dialogMode, currentCustomer, toast, refreshData]);

  return (
    <motion.div 
      className="container mx-auto py-8" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        <p className="mt-1 text-muted-foreground">Xem và quản lý tài khoản khách hàng</p>
      </div>
      
      {/* Search and Add Customer */}
      <CustomerSearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onCreateCustomer={handleCreateCustomer}
      />
      
      {/* Customer data table */}
      <CustomerTable 
        customers={customers}
        loading={loading}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        formatDate={formatDate}
      />
      
      {/* Pagination controls */}
      {totalItems > 0 && (
        <CustomerPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          goToPage={goToPage}
        />
      )}
      
      {/* Customer dialog for create/view/edit */}
      <CustomerDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        customer={currentCustomer}
        mode={dialogMode}
        onSave={handleSaveCustomer}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
};

export default CustomerPage; 