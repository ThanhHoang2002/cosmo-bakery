/**
 * Default page size for customer listing
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Available page size options
 */
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

/**
 * Dialog modes for customer management
 */
export enum CustomerDialogMode {
  VIEW = 'view',
  EDIT = 'edit',
  CREATE = 'create'
}

/**
 * Customer table column definitions
 */
export const CUSTOMER_TABLE_COLUMNS = [
  { key: 'name', label: 'Khách hàng' },
  { key: 'contactInfo', label: 'Thông tin liên hệ' },
  { key: 'role', label: 'Vai trò' },
  { key: 'registrationDate', label: 'Ngày đăng ký' },
  { key: 'actions', label: 'Hành động' },
]; 