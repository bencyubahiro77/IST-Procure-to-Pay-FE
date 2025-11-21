export interface UseSortReturn {
  sortField: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: string) => void;
  setSortField: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}

// usePagination hook types
export interface UsePaginationProps {
  totalItems: number;
  initialItemsPerPage?: number;
  dependencies?: any[];
}

export interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  resetToFirstPage: () => void;
}

// useFormValidation hook types
export interface ValidationRule<T = any> {
  field: keyof T;
  validate: (value: any, formData: T) => string | undefined;
}

export interface UseFormValidationProps<T> {
  initialData: T;
  validationRules?: ValidationRule<T>[];
  onDataChange?: (data: T) => void;
}

export interface UseFormValidationReturn<T> {
  formData: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  updateField: (field: keyof T, value: any) => void;
  validate: () => boolean;
  validateField: (field: keyof T) => boolean;
  reset: () => void;
  setFormData: (data: T) => void;
  setFieldError: (field: keyof T, error: string) => void;
}

// useDataManagement hook types
export interface UseDataManagementProps {
  fetchAction: any; // AsyncThunk type
  deleteAction?: any;
  updateAction?: any;
  createAction?: any;
  isCacheValid: (lastFetched: number | null) => boolean;
  invalidateCache: () => any;
  lastFetched: number | null;
  entityName: string;
}

export interface UseDataManagementReturn<T> {
  formOpen: boolean;
  editingItem: T | null;
  setFormOpen: (open: boolean) => void;
  setEditingItem: (item: T | null) => void;
  handleRefresh: () => Promise<void>;
  handleCreateClick: () => void;
  handleEditClick: (item: T) => void;
  handleDelete: (id: string) => void;
  handleFormSubmit: (data: any) => Promise<void>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => Promise<void>;
  isDeleting: boolean;
  isSubmitting: boolean;
}
