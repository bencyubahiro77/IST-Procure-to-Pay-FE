export interface DashboardState {
    summary: {
        total_borrowers: number;
        total_active_loans: number;
        total_loan_amount: number;
        total_overdue_loans: number;
    } | null;
    loading: boolean;
    error: string | null;
}