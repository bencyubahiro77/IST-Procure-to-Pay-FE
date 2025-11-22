import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    label: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: (value: string) => void;
    required?: boolean;
    isLoading?: boolean;
}

export function InputDialog({
    open,
    onOpenChange,
    title,
    description,
    label,
    placeholder = "",
    confirmText = "Submit",
    cancelText = "Cancel",
    onConfirm,
    required = true,
    isLoading = false,
}: InputDialogProps) {
    const [value, setValue] = useState("");

    const handleConfirm = () => {
        if (required && !value.trim()) {
            return;
        }
        onConfirm(value);
    };

    const handleCancel = () => {
        setValue("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) {
                setValue("");
            }
            onOpenChange(open);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label htmlFor="input-dialog-field">{label}</Label>
                    <Textarea
                        id="input-dialog-field"
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={(required && !value.trim()) || isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
