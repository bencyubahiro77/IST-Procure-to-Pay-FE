import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Search, FileText, Download } from 'lucide-react';
import type { PurchaseRequest } from '@/types';

export default function FinancePage() {
    const dispatch = useAppDispatch();
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    // Only show APPROVED requests for Finance
    const approvedRequests = requests.filter((req: PurchaseRequest) => req.status === 'APPROVED');

    const filteredRequests = approvedRequests.filter((req: PurchaseRequest) => {
        const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.created_by.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalAmount = approvedRequests.reduce((sum, req) => sum + Number(req.amount), 0);

    const handleDownloadPO = async (url: string, filename: string) => {
        try {
            // Fetch the PDF as a blob to bypass CORS restrictions
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a temporary object URL from the blob
            const blobUrl = window.URL.createObjectURL(blob);

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading PO:', error);
            // Fallback: open in new tab if blob download fails
            window.open(url, '_blank');
        }
    };

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
                    <div className="grid gap-4 md:grid-cols-2">
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
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title or requester..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
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
                                    <p>No approved requests found</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredRequests.map((request: PurchaseRequest) => (
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
                                                {request.purchase_order && (
                                                    <button
                                                        onClick={() => handleDownloadPO(request.purchase_order!, `PO_${request.id}.pdf`)}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download PO
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Description</h4>
                                                <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto whitespace-pre-wrap border rounded-md p-2 bg-muted/20">
                                                    {request.description}
                                                </div>
                                            </div>

                                            {request.approvals && request.approvals.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2">Approval History</h4>
                                                    <div className="space-y-2">
                                                        {request.approvals.map((approval, index) => (
                                                            <div key={index} className="text-sm border-l-2 border-primary pl-3 py-1">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
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
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
