import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { GenericFormDialogProps } from '@/types';

export function GenericFormDialog({
  open,
  onClose,
  onSubmit,
  title,
  description,
  loading = false,
  submitText,
  cancelText = 'Cancel',
  children,
  maxWidth = 'sm:max-w-[500px]',
  isEditing = false,
}: GenericFormDialogProps) {
  const defaultSubmitText = loading 
    ? 'Saving...' 
    : isEditing 
    ? 'Update' 
    : 'Create';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">{children}</div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button type="submit" disabled={loading}>
              {submitText || defaultSubmitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
