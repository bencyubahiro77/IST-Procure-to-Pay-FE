import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PurchaseRequestItemsTable } from '@/components/shared/PurchaseRequestItemsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Search, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { PurchaseRequest } from '@/types';

export default function FinancePage() {
    const dispatch = useAppDispatch();
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'REJECTED'>('ALL');
    const [expandedId, setExpandedId] = useState<string | number | null>(null);

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    const filteredRequests = requests.filter((req: PurchaseRequest) => {
        const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.created_by.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' ? req.status !== 'PENDING' : req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const approvedRequests = requests.filter((req: PurchaseRequest) => req.status === 'APPROVED');
    const rejectedRequests = requests.filter((req: PurchaseRequest) => req.status === 'REJECTED');
    const totalAmount = approvedRequests.reduce((sum, req) => sum + Number(req.amount), 0);

    return (
        <div className="min-h-screen bg-background">
            <SimpleHeader />

            <main className="container mx-auto p-4 md:p-6 max-w-6xl">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Finance Dashboard</h2>
                        <p className="text-muted-foreground mt-1">
                            View and manage approved purchase requests
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{approvedRequests.length}</div>
                                <p className="text-xs text-muted-foreground">Purchase requests approved</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                                <FileText className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">From approved requests</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                                <XCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{rejectedRequests.length}</div>
                                <p className="text-xs text-muted-foreground">Purchase requests rejected</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title or requester..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStatusFilter('ALL')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-primary text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setStatusFilter('APPROVED')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'APPROVED' ? 'bg-green-600 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setStatusFilter('REJECTED')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>

                    {/* Requests List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center text-muted-foreground py-8">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No requests found</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredRequests.map((request: PurchaseRequest) => {
                                const isExpanded = expandedId === request.id;
                                return (
                                    <Card key={request.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle>{request.title}</CardTitle>
                                                    <CardDescription>
                                                        Requested by {request.created_by} on {new Date(request.created_at).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <StatusBadge status={request.status} />
                                                    <span className="text-lg font-semibold">${Number(request.amount).toFixed(2)}</span>
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
                                                    <button
                                                        onClick={() => setExpandedId(isExpanded ? null : request.id)}
                                                        className="flex items-center text-sm font-medium text-primary hover:underline mb-2"
                                                    >
                                                        {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                                                        {isExpanded ? 'Hide' : 'Show'} Items ({request.items_display.length})
                                                    </button>

                                                    {isExpanded && (
                                                        <PurchaseRequestItemsTable items={request.items_display} />
                                                    )}
                                                </div>

                                                {request.approvals && request.approvals.length > 0 && (
                                                    <div>
                                                        <h4 className="text-sm font-medium mb-2">Approval History</h4>
                                                        <div className="space-y-2">
                                                            {request.approvals.map((approval, index) => (
                                                                <div key={index} className="text-sm border-l-2 border-primary pl-3 py-1">
                                                                    <div className="flex items-center gap-2">
                                                                        {approval.approved ? (
                                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                                        ) : (
                                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                                        )}
                                                                        <span className="font-medium">{approval.approver}</span>
                                                                        <span className="text-muted-foreground">•</span>
                                                                        <span className="text-muted-foreground">
                                                                            {new Date(approval.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    {approval.comment && (
                                                                        <p className="text-muted-foreground mt-1">{approval.comment}</p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
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
