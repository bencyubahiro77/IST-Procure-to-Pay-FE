import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests, approvePurchaseRequest, rejectPurchaseRequest } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PurchaseRequestItemsTable } from '@/components/shared/PurchaseRequestItemsTable';
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog';
import { InputDialog } from '@/components/shared/InputDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import type { PurchaseRequest } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Pagination } from '@/components/ui/pagination';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export default function ApprovalsPage() {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { user } = useAppSelector((state) => state.auth);
    const { requests, isLoading, count, currentPage } = useAppSelector((state) => state.purchaseRequests);
    const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [pendingActionRequest, setPendingActionRequest] = useState<PurchaseRequest | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        dispatch(fetchPurchaseRequests(1));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchPurchaseRequests(page));
    };

    // Helper to check if current user has already acted on this request
    const hasUserActed = (request: PurchaseRequest): { acted: boolean; approved?: boolean } => {
        const username = user?.username;
        const email = user?.email;

        const userApproval = request.approvals?.find(
            (approval) => approval.approver === username || approval.approver === email
        );

        if (userApproval) {
            return { acted: true, approved: userApproval.approved };
        }
        return { acted: false };
    };

    const relevantRequests = requests.filter((req: PurchaseRequest) => {
        const userAction = hasUserActed(req);
        return req.status === 'PENDING' || userAction.acted;
    });

    const handleApprove = async (request: PurchaseRequest) => {
        setPendingActionRequest(request);
        setApproveConfirmOpen(true);
    };

    const confirmApprove = async () => {
        if (!pendingActionRequest) return;

        setIsProcessing(true);
        try {
            await dispatch(approvePurchaseRequest({ id: pendingActionRequest.id, comments: '' })).unwrap();
            setApproveConfirmOpen(false);
            toast({
                title: "Request Approved",
                description: `Successfully approved "${pendingActionRequest.title}"`,
                variant: "success",
            });
            await dispatch(fetchPurchaseRequests(currentPage));
        } catch (error) {
            toast({
                title: "Approval Failed",
                description: "Failed to approve the request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setPendingActionRequest(null);
        }
    };

    const handleReject = async (request: PurchaseRequest) => {
        setPendingActionRequest(request);
        setRejectDialogOpen(true);
    };

    const confirmReject = async (reason: string) => {
        if (!pendingActionRequest) return;

        setIsProcessing(true);
        try {
            await dispatch(rejectPurchaseRequest({ id: pendingActionRequest.id, comments: reason })).unwrap();
            setRejectDialogOpen(false);
            toast({
                title: "Request Rejected",
                description: `Successfully rejected "${pendingActionRequest.title}"`,
                variant: "default",
            });
            await dispatch(fetchPurchaseRequests(currentPage));
        } catch (error) {
            toast({
                title: "Rejection Failed",
                description: "Failed to reject the request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
            setPendingActionRequest(null);
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
                return <div className="font-medium">RWF {amount.toFixed(2)}</div>;
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
            id: 'my_decision',
            header: 'My Decision',
            cell: ({ row }) => {
                const request = row.original;
                const userAction = hasUserActed(request);

                if (userAction.acted) {
                    return (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm w-fit">
                            {userAction.approved ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-green-600 font-medium">Approved</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 text-destructive" />
                                    <span className="text-destructive font-medium">Rejected</span>
                                </>
                            )}
                        </div>
                    );
                }
                return <span className="text-muted-foreground pl-2">-</span>;
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const request = row.original;
                const userAction = hasUserActed(request);

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
                        {!userAction.acted && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApprove(request)}
                                    className="h-8 w-8 p-0 hover:text-green-600"
                                    title="Approve"
                                    disabled={isProcessing}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReject(request)}
                                    className="h-8 w-8 p-0 hover:text-destructive"
                                    title="Reject"
                                    disabled={isProcessing}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </>
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
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Purchase Request Approvals</h2>
                        <p className="text-muted-foreground mt-1">
                            Review and approve purchase requests as {user?.profile.role === 'approver_l1' ? 'Level 1 Approver' : 'Level 2 Approver'}
                        </p>
                    </div>

                    {relevantRequests.length === 0 && !isLoading ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground py-8">
                                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No requests to review</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <DataTable
                                columns={columns}
                                data={relevantRequests}
                                isLoading={isLoading}
                                searchPlaceholder="Search requests..."
                            />
                            {count > 10 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(count / 10)}
                                    totalItems={count}
                                    itemsPerPage={10}
                                    onPageChange={handlePageChange}
                                    disabled={isLoading}
                                />
                            )}
                        </>
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
                                                RWF {Number(selectedRequest.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                        {!hasUserActed(selectedRequest).acted && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        handleReject(selectedRequest);
                                                        setIsDialogOpen(false);
                                                    }}
                                                    disabled={isProcessing}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        handleApprove(selectedRequest);
                                                        setIsDialogOpen(false);
                                                    }}
                                                    disabled={isProcessing}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    <ConfirmationDialog
                        open={approveConfirmOpen}
                        onOpenChange={setApproveConfirmOpen}
                        title="Approve Request"
                        description={`Are you sure you want to approve "${pendingActionRequest?.title}"?`}
                        confirmText="Approve"
                        onConfirm={confirmApprove}
                        isLoading={isProcessing}
                    />

                    <InputDialog
                        open={rejectDialogOpen}
                        onOpenChange={setRejectDialogOpen}
                        title="Reject Request"
                        description={`Please provide a reason for rejecting "${pendingActionRequest?.title}"`}
                        label="Rejection Reason"
                        placeholder="Enter your reason for rejection..."
                        confirmText="Reject"
                        onConfirm={confirmReject}
                        required={true}
                        isLoading={isProcessing}
                    />
                </div>
            </main >
        </div >
    );
}
