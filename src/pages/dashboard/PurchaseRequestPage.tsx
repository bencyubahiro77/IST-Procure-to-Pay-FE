import { useMemo, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createPurchaseRequest, fetchPurchaseRequests } from '@/store/slices/purchaseRequestSlice';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FormField } from '@/components/shared/FormField';
import { GenericFormDialog } from '@/components/shared/GenericFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import type { PurchaseRequestItem } from '@/types';

export default function PurchaseRequestPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.purchaseRequests);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<PurchaseRequestItem[]>([]);
  const [proforma, setProforma] = useState<File | null>(null);

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemUnitPrice, setItemUnitPrice] = useState('');

  useEffect(() => {
    dispatch(fetchPurchaseRequests());
  }, [dispatch]);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.total_price, 0),
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
      id: items.length ? items[items.length - 1].id + 1 : 1,
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

  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProforma(e.target.files[0]);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || items.length === 0) {
      return;
    }

    const result = await dispatch(createPurchaseRequest({
      title: title.trim(),
      description: description.trim(),
      amount: totalAmount,
      items,
      proforma: proforma,
    }));

    if (createPurchaseRequest.fulfilled.match(result)) {
      // Reset form
      setTitle('');
      setDescription('');
      setItems([]);
      setProforma(null);
      // Reset file input
      const fileInput = document.getElementById('proforma-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const myRequests = requests.filter((req) => req.created_by.id === user?.id);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Purchase Requests</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create New Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Request</CardTitle>
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
                id="description"
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Describe what you are purchasing and why"
              />

              <div className="space-y-2">
                <label htmlFor="proforma-upload" className="text-sm font-medium">
                  Proforma Invoice (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="proforma-upload"
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {proforma ? proforma.name : 'Choose file'}
                  </label>
                  <input
                    id="proforma-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {proforma && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProforma(null);
                        const fileInput = document.getElementById('proforma-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

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
                              ${item.unit_price.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-right">
                              ${item.total_price.toFixed(2)}
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
                disabled={!title.trim() || items.length === 0 || isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Purchase Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>My Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No requests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{request.items.length} items</span>
                      <span className="font-semibold">${request.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
    </div>
  );
}
