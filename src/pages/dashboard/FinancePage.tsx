import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, Search, FileText, Download, Info, AlertCircle, XCircle } from 'lucide-react';
import type { PurchaseRequest } from '@/types';

export default function FinancePage() {
    const dispatch = useAppDispatch();
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    const filteredRequests = requests.filter((req: PurchaseRequest) => {
        const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.created_by.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalAmount = requests.reduce((sum, req) => sum + Number(req.amount), 0);

    const getFileExtension = (url: string) => {
        const extension = url.split('.').pop();
        return extension ? `.${extension}` : '';
    };

    const handleDownloadFile = async (url: string, filename: string) => {
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
            console.error('Error downloading file:', error);
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
                        {isLoading ? (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-7 w-16 mb-2" />
                                        <Skeleton className="h-3 w-40" />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-7 w-24 mb-2" />
                                        <Skeleton className="h-3 w-36" />
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{requests.length}</div>
                                        <p className="text-xs text-muted-foreground">Purchase requests approved</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                                        <FileText className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">RWF {totalAmount.toFixed(2)}</div>
                                        <p className="text-xs text-muted-foreground">From approved requests</p>
                                    </CardContent>
                                </Card>
                            </>
                        )}
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
                                                <span className="text-lg font-semibold">RWF {Number(request.amount).toFixed(2)}</span>
                                                <div className="flex gap-2">
                                                    {request.purchase_order && (
                                                        <button
                                                            onClick={() => handleDownloadFile(request.purchase_order!, `PO_${request.id}.pdf`)}
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download PO
                                                        </button>
                                                    )}
                                                    {request.receipt && (
                                                        <button
                                                            onClick={() => {
                                                                const ext = getFileExtension(request.receipt!);
                                                                handleDownloadFile(request.receipt!, `Receipt_${request.id}${ext}`);
                                                            }}
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Receipt
                                                        </button>
                                                    )}
                                                </div>
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

                                            {/* Receipt Validation Status */}
                                            <div className="flex items-center gap-2 mt-4">
                                                <h4 className="text-sm font-medium">Receipt Status:</h4>
                                                {!request.receipt ? (
                                                    <div className="flex items-center text-muted-foreground text-sm bg-muted px-2 py-1 rounded-full">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        Not Submitted
                                                    </div>
                                                ) : request.receipt_validation?.is_valid ? (
                                                    <div className="flex items-center text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Valid
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center text-red-600 text-sm bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                                            <XCircle className="h-4 w-4 mr-1" />
                                                            Flagged
                                                        </div>
                                                        {request.receipt_validation?.discrepancies && request.receipt_validation.discrepancies.length > 0 && (
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                                                                        <Info className="h-5 w-5 text-red-500" />
                                                                    </button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle className="flex items-center gap-2 text-red-600">
                                                                            <AlertCircle className="h-5 w-5" />
                                                                            Receipt Discrepancies
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            The following discrepancies were found between the receipt and the purchase order.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="mt-4 space-y-2">
                                                                        {request.receipt_validation.discrepancies.map((discrepancy, index) => (
                                                                            <div key={index} className="flex items-start gap-2 text-sm p-3 bg-red-50 rounded-md border border-red-100 text-red-900">
                                                                                <span className="font-bold min-w-[20px]">{index + 1}.</span>
                                                                                <span>{discrepancy}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                    </div>
                                                )}
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
