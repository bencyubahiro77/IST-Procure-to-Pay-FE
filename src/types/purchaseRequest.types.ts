export type PurchaseRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Purchase Request Item
export interface PurchaseRequestItem {
    id?: number; // Optional for creation
    name: string;
    qty: number;
    unit_price: number | string;
    total_price?: number | string; // Read-only
}

export interface PurchaseRequestApproval {
    id: number;
    approver: string; // Email
    level: number;
    approved: boolean;
    comment: string;
    created_at: string;
}

export interface ReceiptValidation {
    is_valid: boolean;
    validated_at: string;
    discrepancies: string[];
}

export interface PurchaseRequest {
    id: string | number;
    title: string;
    vendor: string;
    description: string;
    amount: string; // Decimal string
    status: PurchaseRequestStatus;
    created_by: string; // Email
    last_approved_by: string | null; // Email
    created_at: string;
    updated_at?: string;
    proforma?: string | null; // URL
    purchase_order: string | null;
    receipt: string | null;
    receipt_validation?: ReceiptValidation | null;
    items_display: PurchaseRequestItem[];
    approvals: PurchaseRequestApproval[];
}

export interface PurchaseRequestState {
    requests: PurchaseRequest[];
    currentRequest: PurchaseRequest | null;
    isLoading: boolean;
    error: string | null;
    total: number;
    lastFetched: number | null;
    count: number;
    next: string | null;
    previous: string | null;
    currentPage: number;
}

export interface PurchaseRequestFormData {
    title: string;
    vendor: string;
    description: string;
    items: PurchaseRequestItem[];
    proforma?: File | null;
}

export interface CreatePurchaseRequestPayload {
    title: string;
    vendor: string;
    description: string;
    amount: string;
    items: {
        name: string;
        qty: number;
        unit_price: string;
    }[];
    proforma?: File | null;
}

export interface UpdatePurchaseRequestPayload {
    id: string | number;
    title?: string;
    vendor?: string;
    description?: string;
    items?: {
        name: string;
        qty: number;
        unit_price: string;
    }[];
}

export interface ApprovePurchaseRequestPayload {
    id: string | number;
    comments?: string;
}

export interface RejectPurchaseRequestPayload {
    id: string | number;
    comments?: string;
}

export interface SubmitReceiptPayload {
    id: string | number;
    receipt: File;
}
