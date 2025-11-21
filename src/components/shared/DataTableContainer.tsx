import { Pagination } from '@/components/ui/pagination';
import type { DataTableContainerProps } from '@/types';

export function DataTableContainer({
  children,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false,
  showPagination = true,
}: DataTableContainerProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {children}
      {!isLoading && totalItems > 0 && showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
