import { useState, useEffect } from 'react';
import type { UsePaginationProps, UsePaginationReturn } from '@/types';

export function usePagination({
  totalItems,
  initialItemsPerPage = 10,
  dependencies = [],
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, dependencies]);

  const resetToFirstPage = () => setCurrentPage(1);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    setCurrentPage,
    setItemsPerPage,
    resetToFirstPage,
  };
}
