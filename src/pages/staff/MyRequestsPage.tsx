import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests, submitReceipt, deletePurchaseRequest } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, PlusCircle, Eye, Trash2, Upload } from 'lucide-react';
import type { PurchaseRequest } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PurchaseRequestItemsTable } from '@/components/shared/PurchaseRequestItemsTable';
import { useToast } from '@/hooks/use-toast';

export default function MyRequestsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);
    const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<PurchaseRequest | null>(null);

    // Receipt Upload State
    const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
    const [selectedRequestForReceipt, setSelectedRequestForReceipt] = useState<PurchaseRequest | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    const myRequests = Array.isArray(requests) ? requests : [];

    const handleDelete = (request: PurchaseRequest) => {
        setRequestToDelete(request);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!requestToDelete) return;

        setIsDeleting(true);
        try {
            await dispatch(deletePurchaseRequest(requestToDelete.id)).unwrap();
            setDeleteConfirmOpen(false);
            toast({
                title: "Request Deleted",
                description: `Successfully deleted "${requestToDelete.title}"`,
                variant: "success",
            });
            await dispatch(fetchPurchaseRequests());
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: "Failed to delete the request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setRequestToDelete(null);
        }
    };

    const handleUploadReceiptClick = (request: PurchaseRequest) => {
        setSelectedRequestForReceipt(request);
        setReceiptFile(null);
        setReceiptDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

            if (!validTypes.includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload a PDF or an image file (JPEG, PNG, WEBP).",
                    variant: "destructive",
                });
                e.target.value = ''; // Reset input
                setReceiptFile(null);
                return;
            }

            setReceiptFile(file);
        }
    };

    const confirmUploadReceipt = async () => {
        if (!selectedRequestForReceipt || !receiptFile) return;

        setIsUploading(true);
        try {
            await dispatch(submitReceipt({
                id: selectedRequestForReceipt.id,
                receipt: receiptFile
            })).unwrap();

            toast({
                title: "Receipt Uploaded",
                description: "Your receipt has been successfully submitted.",
                variant: "success",
            });

            setReceiptDialogOpen(false);
            dispatch(fetchPurchaseRequests());
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "Failed to upload receipt. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            setSelectedRequestForReceipt(null);
            setReceiptFile(null);
        }
    };

    const columns: ColumnDef<PurchaseRequest>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }) => {
                return new Date(row.getValue('created_at')).toLocaleDateString();
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue('amount'));
                return <div className="font-medium">${amount.toFixed(2)}</div>;
            },
        },
        {
            accessorKey: 'items_display',
            header: 'Items',
            cell: ({ row }) => {
                const items = row.original.items_display;
                return <div>{items ? items.length : 0} items</div>;
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const request = row.original;
                const canDelete = request.status === 'PENDING' && (!request.approvals || request.approvals.length === 0);
                const canUploadReceipt = request.status === 'APPROVED' && !request.receipt;

                return (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedRequest(request);
                                setIsDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {canDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(request)}
                                className="h-8 w-8 p-0 hover:text-destructive"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        {canUploadReceipt && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUploadReceiptClick(request)}
                                className="h-8 w-8 p-0 hover:text-blue-600"
                                title="Upload Receipt"
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <SimpleHeader />

            <main className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">My Purchase Requests</h2>
                            <p className="text-muted-foreground mt-1">
                                View all your purchase requests and their status
                            </p>
                        </div>
                        <Button onClick={() => navigate('/create-request')}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Request
                        </Button>
                    </div>

                    {myRequests.length === 0 && !isLoading ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground py-8">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p className="mb-4">No requests yet</p>
                                    <Button onClick={() => navigate('/create-request')}>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Create Your First Request
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={myRequests}
                            isLoading={isLoading}
                            searchPlaceholder="Search requests..."
                        />
                    )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>{selectedRequest?.title}</DialogTitle>
                                <DialogDescription>
                                    Created on {selectedRequest && new Date(selectedRequest.created_at).toLocaleDateString()}
                                </DialogDescription>
                            </DialogHeader>

                            {selectedRequest && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Description</h4>
                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                            {selectedRequest.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Items</h4>
                                        <PurchaseRequestItemsTable items={selectedRequest.items_display} />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <div className="text-right">
                                            <span className="text-sm text-muted-foreground mr-2">Total Amount:</span>
                                            <span className="text-lg font-bold">
                                                ${Number(selectedRequest.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Upload Receipt</DialogTitle>
                                <DialogDescription>
                                    Upload the receipt for "{selectedRequestForReceipt?.title}"
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label htmlFor="receipt-upload" className="text-sm font-medium">
                                        Receipt File
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <label
                                            htmlFor="receipt-upload"
                                            className="flex-1 flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-secondary transition-colors h-32 flex-col"
                                        >
                                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                {receiptFile ? receiptFile.name : 'Click to select file'}
                                            </span>
                                        </label>
                                        <input
                                            id="receipt-upload"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                    {receiptFile && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setReceiptFile(null);
                                                const fileInput = document.getElementById('receipt-upload') as HTMLInputElement;
                                                if (fileInput) fileInput.value = '';
                                            }}
                                            className="w-full"
                                        >
                                            Remove Selected File
                                        </Button>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setReceiptDialogOpen(false)}
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={confirmUploadReceipt}
                                        disabled={!receiptFile || isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <ConfirmationDialog
                        open={deleteConfirmOpen}
                        onOpenChange={setDeleteConfirmOpen}
                        title="Delete Request"
                        description={`Are you sure you want to delete "${requestToDelete?.title}"? This action cannot be undone.`}
                        confirmText="Delete"
                        onConfirm={confirmDelete}
                        variant="destructive"
                        isLoading={isDeleting}
                    />
                </div>
            </main>
        </div >
    );
}
