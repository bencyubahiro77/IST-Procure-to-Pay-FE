import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
    isLoading?: boolean;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    variant = "default",
    isLoading = false,
}: ConfirmationDialogProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
