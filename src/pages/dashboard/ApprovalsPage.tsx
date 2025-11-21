import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests, approvePurchaseRequest, rejectPurchaseRequest } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PurchaseRequestItemsTable } from '@/components/shared/PurchaseRequestItemsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { PurchaseRequest } from '@/types';

export default function ApprovalsPage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);
    const [expandedId, setExpandedId] = useState<string | number | null>(null);
    const [actionComments, setActionComments] = useState<Record<string | number, string>>({});

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    const pendingRequests = requests.filter((req: PurchaseRequest) => req.status === 'PENDING');

    const handleApprove = async (id: string | number) => {
        await dispatch(approvePurchaseRequest({ id, comments: actionComments[id] || '' }));
        setActionComments((prev) => ({ ...prev, [id]: '' }));
    };

    const handleReject = async (id: string | number) => {
        await dispatch(rejectPurchaseRequest({ id, comments: actionComments[id] || '' }));
        setActionComments((prev) => ({ ...prev, [id]: '' }));
    };

    return (
        <div className="min-h-screen bg-background">
            <SimpleHeader />

            <main className="container mx-auto p-4 md:p-6 max-w-5xl">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Purchase Request Approvals</h2>
                        <p className="text-muted-foreground mt-1">
                            Review and approve purchase requests as {user?.role === 'approvelevel1' ? 'Level 1 Approver' : 'Level 2 Approver'}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground py-8">
                                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No pending requests to review</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pendingRequests.map((request: PurchaseRequest) => {
                                const isExpanded = expandedId === request.id;
                                return (
                                    <Card key={request.id} className="overflow-hidden">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle>{request.title}</CardTitle>
                                                    <CardDescription>
                                                        Requested by {request.created_by.name} on {new Date(request.created_at).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <StatusBadge status={request.status} />
                                                    <span className="text-lg font-semibold">${request.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium mb-1">Description</h4>
                                                    <p className="text-sm text-muted-foreground">{request.description}</p>
                                                </div>

                                                <div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setExpandedId(isExpanded ? null : request.id)}
                                                        className="mb-2"
                                                    >
                                                        {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                                                        {isExpanded ? 'Hide' : 'Show'} Items ({request.items.length})
                                                    </Button>

                                                    {isExpanded && (
                                                        <PurchaseRequestItemsTable items={request.items} />
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor={`comments-${request.id}`} className="text-sm font-medium">
                                                        Comments (optional)
                                                    </label>
                                                    <textarea
                                                        id={`comments-${request.id}`}
                                                        className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md"
                                                        placeholder="Add comments for this decision..."
                                                        value={actionComments[request.id] || ''}
                                                        onChange={(e) => setActionComments((prev) => ({ ...prev, [request.id]: e.target.value }))}
                                                    />
                                                </div>

                                                <div className="flex gap-3 pt-2">
                                                    <Button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="flex-1"
                                                        disabled={isLoading}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleReject(request.id)}
                                                        variant="destructive"
                                                        className="flex-1"
                                                        disabled={isLoading}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
