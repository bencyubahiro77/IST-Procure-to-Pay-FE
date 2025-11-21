import type { User } from './user.types';

// Purchase Request Status
export type PurchaseRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Purchase Request Item
export interface PurchaseRequestItem {
    id: number;
    name: string;
    qty: number;
    unit_price: number;
    total_price: number;
}

// Approval Record
export interface ApprovalRecord {
    approver: User;
    status: 'APPROVED' | 'REJECTED';
    comments?: string;
    timestamp: string;
}

// Purchase Request
export interface PurchaseRequest {
    id: number | string;
    title: string;
    description: string;
    amount: number;
    status: PurchaseRequestStatus;
    created_by: {
        id: string;
        email: string;
        name: string;
    };
    approved_by: ApprovalRecord[];
    created_at: string;
    updated_at: string;
    proforma: string | null;
    purchase_order: string | null;
    receipt: string | null;
    items: PurchaseRequestItem[];
}

// Purchase Request State
export interface PurchaseRequestState {
    requests: PurchaseRequest[];
    currentRequest: PurchaseRequest | null;
    isLoading: boolean;
    error: string | null;
    total: number;
    lastFetched: number | null;
}

// Purchase Request Form Data
export interface PurchaseRequestFormData {
    title: string;
    description: string;
    items: PurchaseRequestItem[];
    proforma?: File | null;
}

// Purchase Request Actions
export interface CreatePurchaseRequestPayload {
    title: string;
    description: string;
    amount: number;
    items: PurchaseRequestItem[];
    proforma?: File | null;
}

export interface UpdatePurchaseRequestPayload {
    id: string | number;
    title?: string;
    description?: string;
    items?: PurchaseRequestItem[];
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
