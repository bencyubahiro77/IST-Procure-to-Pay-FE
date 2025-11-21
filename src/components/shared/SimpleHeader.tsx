import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import DarkMode from '@/utils/darkmode';

export function SimpleHeader() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="bg-card border-b border-border sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-white text-sm">
                            {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {user?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <DarkMode />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
