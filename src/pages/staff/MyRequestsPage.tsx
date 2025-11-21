import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPurchaseRequests } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, PlusCircle } from 'lucide-react';
import type { PurchaseRequest } from '@/types';

export default function MyRequestsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);

    useEffect(() => {
        dispatch(fetchPurchaseRequests());
    }, [dispatch]);

    const myRequests = requests.filter((req: PurchaseRequest) => req.created_by.id === user?.id);

    return (
        <div className="min-h-screen bg-background">
            <SimpleHeader />

            <main className="container mx-auto p-4 md:p-6 max-w-5xl">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">My Purchase Requests</h2>
                        <p className="text-muted-foreground mt-1">
                            View all your purchase requests and their status
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : myRequests.length === 0 ? (
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
                        <>
                            <div className="grid gap-4">
                                {myRequests.map((request: PurchaseRequest) => (
                                    <Card key={request.id}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle>{request.title}</CardTitle>
                                                    <CardDescription>
                                                        Created on {new Date(request.created_at).toLocaleDateString()}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <StatusBadge status={request.status} />
                                                    <span className="text-lg font-semibold">${request.amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="text-sm font-medium mb-1">Description</h4>
                                                    <p className="text-sm text-muted-foreground">{request.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between text-sm border-t pt-3">
                                                    <span className="text-muted-foreground">{request.items.length} items</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button
                                    size="lg"
                                    onClick={() => navigate('/create-request')}
                                    className="w-full sm:w-auto"
                                >
                                    <PlusCircle className="h-5 w-5 mr-2" />
                                    Create New Request
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
