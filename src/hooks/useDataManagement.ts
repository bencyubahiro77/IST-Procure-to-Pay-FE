import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';
import type { UseDataManagementProps, UseDataManagementReturn } from '@/types';

export function useDataManagement<T extends { id: string }>({
  fetchAction,
  deleteAction,
  updateAction,
  createAction,
  isCacheValid,
  invalidateCache,
  lastFetched,
  entityName,
}: UseDataManagementProps): UseDataManagementReturn<T> {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data if cache is invalid
  useEffect(() => {
    if (!isCacheValid(lastFetched)) {
      dispatch(fetchAction({}));
    }
  }, [dispatch, lastFetched, fetchAction, isCacheValid]);

  const handleRefresh = useCallback(async () => {
    try {
      dispatch(invalidateCache());
      await dispatch(fetchAction({})).unwrap();
      toast({
        title: "Success",
        description: `${capitalizeFirst(entityName)}s refreshed successfully`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to refresh ${entityName}s`,
        variant: "destructive",
      });
    }
  }, [dispatch, fetchAction, invalidateCache, toast, entityName]);

  const handleCreateClick = useCallback(() => {
    setEditingItem(null);
    setFormOpen(true);
  }, []);

  const handleEditClick = useCallback((item: T) => {
    setEditingItem(item);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (!deleteAction) {
      toast({
        title: "Info",
        description: "Delete functionality not yet implemented",
        variant: "default",
      });
      return;
    }
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, [deleteAction, toast]);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete || !deleteAction) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteAction(itemToDelete)).unwrap();
      toast({
        title: "Success",
        description: `${capitalizeFirst(entityName)} deleted successfully`,
        variant: "success",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to delete ${entityName}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [dispatch, deleteAction, itemToDelete, toast, entityName]);

  const handleFormSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingItem && updateAction) {
        // Different entities have different payload structures
        let updatePayload;
        if ('userData' in data || 'borrowerData' in data || 'loanData' in data) {
          // Already wrapped
          updatePayload = data;
        } else {
          // Need to wrap based on entity type
          const dataKey = entityName === 'user' ? 'userData' 
            : entityName === 'borrower' ? 'borrowerData'
            : entityName === 'loan' ? 'loanData'
            : 'data';
          updatePayload = { id: editingItem.id, [dataKey]: data };
        }
        await dispatch(updateAction(updatePayload)).unwrap();
        
        // Close form first
        setFormOpen(false);
        setEditingItem(null);
        
        // Then show success and refetch data
        toast({
          title: "Success",
          description: `${capitalizeFirst(entityName)} updated successfully`,
          variant: "success",
        });
        
        // Refetch latest data
        await dispatch(fetchAction({})).unwrap();
      } else if (createAction) {
        await dispatch(createAction(data)).unwrap();
        
        // Close form first
        setFormOpen(false);
        setEditingItem(null);
        
        // Then show success and refetch data
        toast({
          title: "Success",
          description: `${capitalizeFirst(entityName)} created successfully`,
          variant: "success",
        });
        
        // Refetch latest data
        await dispatch(fetchAction({})).unwrap();
      } else {
        toast({
          title: "Info",
          description: `${editingItem ? 'Update' : 'Create'} functionality not yet implemented`,
          variant: "default",
        });
        setFormOpen(false);
        setEditingItem(null);
      }
    } catch (error: any) {
      console.error('Operation failed:', error);
      toast({
        title: "Error",
        description: error.message || 'Operation failed',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, editingItem, updateAction, createAction, fetchAction, toast, entityName]);

  return {
    formOpen,
    editingItem,
    setFormOpen,
    setEditingItem,
    handleRefresh,
    handleCreateClick,
    handleEditClick,
    handleDelete,
    handleFormSubmit,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    isDeleting,
    isSubmitting,
  };
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
