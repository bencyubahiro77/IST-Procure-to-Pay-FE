export const getStatusColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'pending':
            return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'overdue':
            return 'bg-red-500/10 text-red-500 border-red-500/20';
        case 'active':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default:
            return 'bg-muted/10 text-muted-foreground border-border';
    }
};