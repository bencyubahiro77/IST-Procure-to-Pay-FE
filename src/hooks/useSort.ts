import { useState } from 'react';
import type { UseSortReturn } from '@/types';

export function useSort(initialField: string = 'created_at', initialOrder: 'asc' | 'desc' = 'desc'): UseSortReturn {
  const [sortField, setSortField] = useState<string>(initialField);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialOrder);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return {
    sortField,
    sortOrder,
    handleSort,
    setSortField,
    setSortOrder,
  };
}
