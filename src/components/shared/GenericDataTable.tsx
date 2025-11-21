import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { GenericDataTableProps, ColumnDef } from '@/types';

export type { ColumnDef };

export function GenericDataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
  onSort,
  sortField,
  emptyMessage = 'No data found',
  loadingMessage = 'Loading...',
  getItemId,
  showActions = true,
  customActions,
}: GenericDataTableProps<T>) {
  const SortIcon = ({ field }: { field: string }) => (
    <ArrowUpDown
      className={`ml-2 h-4 w-4 inline-block ${
        sortField === field ? 'text-primary' : 'text-muted-foreground opacity-50'
      }`}
    />
  );

  const totalColumns = columns.length + (showActions ? 1 : 0);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[hsl(var(--table-header))] dark:bg-[#0d1b2a] border-b border-border hover:bg-[hsl(var(--table-header))]">
          {columns.map((column) => (
            <TableHead key={column.key} className={`text-muted-foreground font-medium ${column.className || ''}`}>
              {column.sortable && onSort ? (
                <Button
                  variant="ghost"
                  onClick={() => onSort(column.key)}
                  className="font-medium hover:text-foreground -ml-4"
                >
                  {column.label}
                  <SortIcon field={column.key} />
                </Button>
              ) : (
                column.label
              )}
            </TableHead>
          ))}
          {showActions && (
            <TableHead className="text-right text-muted-foreground font-medium">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={totalColumns} className="text-center py-12 text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                {loadingMessage}
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={totalColumns} className="text-center py-12 text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const itemId = getItemId(item);
            return (
              <TableRow 
                key={itemId} 
                className="border-b border-border hover:bg-secondary/50 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell 
                    key={`${itemId}-${column.key}`}
                    className={column.className || 'text-foreground'}
                  >
                    {column.render 
                      ? column.render(item) 
                      : String((item as any)[column.key] || 'N/A')}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell className="text-right">
                    {customActions ? (
                      customActions(item)
                    ) : (
                      <div className="flex justify-end gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(itemId)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
