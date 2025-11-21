import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Wallet } from 'lucide-react';
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
                {/* Left: Logo */}
                <div className="flex items-center space-x-2">
                    <Wallet className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-primary">IST</span>
                </div>

                {/* Right: User info & actions */}
                <div className="flex items-center gap-3">
                    {/* User Info */}
                    <div className="hidden sm:flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary text-white text-sm">
                                {user?.username ? getInitials(user.username) : <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-foreground">
                                {user?.username || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <DarkMode />

                    {/* Logout Button */}
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
