export function sortData<T>(
  data: T[],
  sortField: string,
  sortOrder: 'asc' | 'desc',
  dateFields: string[] = ['created_at', 'updated_at', 'due_date', 'start_date']
): T[] {
  return [...data].sort((a, b) => {
    let aValue: any = a[sortField as keyof T];
    let bValue: any = b[sortField as keyof T];

    // Handle date fields
    if (dateFields.includes(sortField)) {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    // Handle nested properties (e.g., 'borrower.name')
    if (sortField.includes('.')) {
      const keys = sortField.split('.');
      aValue = keys.reduce((obj, key) => obj?.[key], a as any) || '';
      bValue = keys.reduce((obj, key) => obj?.[key], b as any) || '';
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

export function filterBySearch<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T | string)[]
): T[] {
  if (!searchTerm) return data;

  const lowerSearch = searchTerm.toLowerCase();
  
  return data.filter((item) => {
    return searchFields.some((field) => {
      // Handle nested properties (e.g., 'borrower.name')
      let value: any;
      if (typeof field === 'string' && field.includes('.')) {
        const keys = field.split('.');
        value = keys.reduce((obj, key) => obj?.[key], item as any);
      } else {
        value = item[field as keyof T];
      }

      // Convert to string and check
      if (value != null) {
        return String(value).toLowerCase().includes(lowerSearch);
      }
      return false;
    });
  });
}


export function filterByField<T>(
  data: T[],
  field: keyof T,
  filterValue: string | number,
  includeAll: boolean = true
): T[] {
  if (includeAll && (filterValue === 'all' || filterValue === '')) {
    return data;
  }
  
  return data.filter((item) => item[field] === filterValue);
}


export function applyFilters<T>(
  data: T[],
  filters: Array<(data: T[]) => T[]>
): T[] {
  return filters.reduce((filteredData, filter) => filter(filteredData), data);
}

export function paginateData<T>(
  data: T[],
  page: number,
  itemsPerPage: number
): T[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
}
