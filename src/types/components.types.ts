import type { ReactNode } from 'react';

// Shared component types for better organization and debugging

// GenericFormDialog types
export interface GenericFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  title: string;
  description?: string;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  children: ReactNode;
  maxWidth?: string;
  isEditing?: boolean;
}

// FormField types
export interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'select';
  value: string | number;
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  selectOptions?: { value: string; label: string }[];
  selectPlaceholder?: string;
  step?: string;
  min?: string;
  max?: string;
}

// GenericDataTable types
export interface ColumnDef<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface GenericDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  onSort?: (field: string) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  emptyMessage?: string;
  loadingMessage?: string;
  getItemId: (item: T) => string;
  showActions?: boolean;
  customActions?: (item: T) => ReactNode;
}

// PageHeader types
export interface PageHeaderProps {
  title: string;
  description?: string;
  onRefresh?: () => void;
  onCreateClick?: () => void;
  createButtonText?: string;
  isLoading?: boolean;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  children?: ReactNode;
  showCreateButton?: boolean;
}

// DataTableContainer types
export interface DataTableContainerProps {
  children: ReactNode;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showPagination?: boolean;
}
