import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests, approvePurchaseRequest, rejectPurchaseRequest } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PurchaseRequestItemsTable } from '@/components/shared/PurchaseRequestItemsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
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

export default function ApprovalsPage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);
    const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    const pendingRequests = requests.filter((req: PurchaseRequest) => req.status === 'PENDING');

    const handleApprove = async (id: string | number) => {
        const confirmed = confirm('Are you sure you want to approve this request?');
        if (confirmed) {
            await dispatch(approvePurchaseRequest({ id, comments: '' }));
        }
    };

    const handleReject = async (id: string | number) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason !== null) {
            await dispatch(rejectPurchaseRequest({ id, comments: reason }));
        }
    };

    const columns: ColumnDef<PurchaseRequest>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => <div className="font-medium">{row.getValue('title')}</div>,
        },
        {
            accessorKey: 'created_by',
            header: 'Requested By',
            cell: ({ row }) => <div>{row.getValue('created_by')}</div>,
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }) => {
                return new Date(row.getValue('created_at')).toLocaleDateString();
            },
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
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const request = row.original;
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
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="h-8 w-8 p-0 hover:text-green-600"
                            title="Approve"
                        >
                            <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            className="h-8 w-8 p-0 hover:text-destructive"
                            title="Reject"
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
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
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Purchase Request Approvals</h2>
                        <p className="text-muted-foreground mt-1">
                            Review and approve purchase requests as {user?.profile.role === 'approver_l1' ? 'Level 1 Approver' : 'Level 2 Approver'}
                        </p>
                    </div>

                    {pendingRequests.length === 0 && !isLoading ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground py-8">
                                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No pending requests to review</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={pendingRequests}
                            isLoading={isLoading}
                            searchPlaceholder="Search requests..."
                        />
                    )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>{selectedRequest?.title}</DialogTitle>
                                <DialogDescription>
                                    Requested by {selectedRequest?.created_by} on {selectedRequest && new Date(selectedRequest.created_at).toLocaleDateString()}
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

                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                handleReject(selectedRequest.id);
                                                setIsDialogOpen(false);
                                            }}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleApprove(selectedRequest.id);
                                                setIsDialogOpen(false);
                                            }}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </div>
    );
}
