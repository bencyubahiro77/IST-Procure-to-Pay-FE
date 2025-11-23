import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createPurchaseRequest } from '@/store/slices/purchaseRequestSlice';
import { SimpleHeader } from '@/components/shared/SimpleHeader';
import { FormField } from '@/components/shared/FormField';
import { GenericFormDialog } from '@/components/shared/GenericFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { PurchaseRequestItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function CreateRequestPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { isLoading } = useAppSelector((state) => state.purchaseRequests);

    const [title, setTitle] = useState('');
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState<PurchaseRequestItem[]>([]);

    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemQty, setItemQty] = useState('1');
    const [itemUnitPrice, setItemUnitPrice] = useState('');

    const totalAmount = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.total_price || 0), 0),
        [items]
    );

    const currentItemTotal = useMemo(() => {
        const qty = Number(itemQty) || 0;
        const price = Number(itemUnitPrice) || 0;
        return qty * price;
    }, [itemQty, itemUnitPrice]);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        const qty = Number(itemQty);
        const unitPrice = Number(itemUnitPrice);

        if (!itemName.trim() || !qty || qty <= 0 || !unitPrice || unitPrice <= 0) {
            return;
        }

        const newItem: PurchaseRequestItem = {
            id: items.length ? (items[items.length - 1].id || 0) + 1 : 1,
            name: itemName.trim(),
            qty,
            unit_price: unitPrice,
            total_price: qty * unitPrice,
        };

        setItems((prev) => [...prev, newItem]);
        setItemName('');
        setItemQty('1');
        setItemUnitPrice('');
        setItemDialogOpen(false);
    };

    const handleRemoveItem = (id: number | undefined) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };


    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !vendor.trim() || items.length === 0) {
            return;
        }

        try {
            await dispatch(createPurchaseRequest({
                title: title.trim(),
                vendor: vendor.trim(),
                description: description.trim(),
                amount: totalAmount.toFixed(2),
                items: items.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    unit_price: String(item.unit_price)
                })),
            })).unwrap();

            toast({
                title: "Request Created",
                description: "Your purchase request has been submitted successfully.",
                variant: "success",
            });

            // Redirect to my requests page
            navigate('/my-requests');
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "Failed to create purchase request. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SimpleHeader />

            <main className="container mx-auto p-4 md:p-6 max-w-3xl">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/my-requests')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to My Requests
                        </Button>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Create Purchase Request</h2>
                        <p className="text-muted-foreground mt-1">
                            Fill out the form below to submit a new purchase request
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Request Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitRequest} className="space-y-4">
                                <FormField
                                    id="title"
                                    label="Title"
                                    value={title}
                                    onChange={setTitle}
                                    placeholder="Enter purchase request title"
                                    required
                                />

                                <FormField
                                    id="vendor"
                                    label="Vendor"
                                    value={vendor}
                                    onChange={setVendor}
                                    placeholder="Enter vendor name"
                                    required
                                />

                                <FormField
                                    id="description"
                                    label="Description"
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Describe what you are purchasing and why"
                                />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Items</h3>
                                        <Button type="button" size="sm" onClick={() => setItemDialogOpen(true)}>
                                            Add Item
                                        </Button>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        {items.length === 0 ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                No items added yet. Click "Add Item" to start.
                                            </div>
                                        ) : (
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted">
                                                    <tr>
                                                        <th className="text-left py-2 px-3">Name</th>
                                                        <th className="text-right py-2 px-3">Qty</th>
                                                        <th className="text-right py-2 px-3">Unit Price</th>
                                                        <th className="text-right py-2 px-3">Total</th>
                                                        <th className="py-2 px-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item) => (
                                                        <tr key={item.id} className="border-t">
                                                            <td className="py-2 px-3">{item.name}</td>
                                                            <td className="py-2 px-3 text-right">{item.qty}</td>
                                                            <td className="py-2 px-3 text-right">
                                                                ${Number(item.unit_price).toFixed(2)}
                                                            </td>
                                                            <td className="py-2 px-3 text-right">
                                                                ${Number(item.total_price).toFixed(2)}
                                                            </td>
                                                            <td className="py-2 px-3 text-right">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveItem(item.id)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>
                                                    <tr className="border-t bg-muted/50">
                                                        <td className="py-2 px-3 font-semibold" colSpan={3}>
                                                            Total Amount
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-semibold">
                                                            ${totalAmount.toFixed(2)}
                                                        </td>
                                                        <td />
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!title.trim() || !vendor.trim() || items.length === 0 || isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Purchase Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <GenericFormDialog
                    open={itemDialogOpen}
                    onClose={() => setItemDialogOpen(false)}
                    onSubmit={handleAddItem}
                    title="Add Item"
                    description="Add an item to this purchase request"
                >
                    <FormField
                        id="item-name"
                        label="Item Name"
                        value={itemName}
                        onChange={setItemName}
                        placeholder="e.g. MacBook Air M2"
                        required
                    />
                    <FormField
                        id="item-qty"
                        label="Quantity"
                        type="number"
                        value={itemQty}
                        onChange={setItemQty}
                        min="1"
                        required
                    />
                    <FormField
                        id="item-unit-price"
                        label="Unit Price"
                        type="number"
                        value={itemUnitPrice}
                        onChange={setItemUnitPrice}
                        step="0.01"
                        min="0"
                        required
                    />
                    <FormField
                        id="item-total"
                        label="Item Total"
                        type="number"
                        value={currentItemTotal.toFixed(2)}
                        onChange={() => { }}
                        disabled
                    />
                </GenericFormDialog>
            </main>
        </div>
    );
}
