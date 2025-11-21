import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { dashboardSummary } from '@/store/actions/dashboardAction';
import { Users, CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { summary, loading, error } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        if(!summary){
            dispatch(dashboardSummary());
        }
    }, [dispatch, summary]);

    const stats = [
        {
            title: 'Total Borrowers',
            value: summary?.total_borrowers ?? 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
        },
        {
            title: 'Active Loans',
            value: summary?.total_active_loans ?? 0,
            icon: CreditCard,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950',
        },
        {
            title: 'Total Loan Amount',
            value: `$${summary?.total_loan_amount?.toLocaleString() ?? 0}`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
        },
        {
            title: 'Overdue Loans',
            value: summary?.total_overdue_loans ?? 0,
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950',
        },
    ];

    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative bg-card border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-4 w-24 rounded" /> 
                                <Skeleton className="h-8 w-32 rounded" /> 
                            </div>
                        ) : (
                            <div className="relative space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 flex`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground ">
                                        {stat.title}
                                    </p>
                                </div>
                                <p className="text-3xl font-bold tracking-tight space-y-2 pl-3">{stat.value}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}