import type { PurchaseRequestItem } from '@/types';

interface PurchaseRequestItemsTableProps {
    items: PurchaseRequestItem[];
}

export function PurchaseRequestItemsTable({ items }: PurchaseRequestItemsTableProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted">
                    <tr>
                        <th className="text-left py-2 px-3">Item</th>
                        <th className="text-right py-2 px-3">Qty</th>
                        <th className="text-right py-2 px-3">Unit Price</th>
                        <th className="text-right py-2 px-3">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="border-t">
                            <td className="py-2 px-3">{item.name}</td>
                            <td className="py-2 px-3 text-right">{item.qty}</td>
                            <td className="py-2 px-3 text-right">${item.unit_price.toFixed(2)}</td>
                            <td className="py-2 px-3 text-right">${item.total_price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
