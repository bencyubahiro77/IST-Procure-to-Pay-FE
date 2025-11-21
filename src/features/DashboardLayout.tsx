import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet, LogOut, Menu, X, LayoutDashboard, Layers, ChevronLeft, ChevronRight, User } from 'lucide-react';
import DarkMode from '@/utils/darkmode';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(user?.role === 'staff' ? [{ icon: Wallet, label: 'Purchase Requests', path: '/dashboard/purchase-requests' }] : []),
    ...(['approvelevel1', 'approvelevel2'].includes(user?.role || '') ? [{ icon: Layers, label: 'Approvals', path: '/dashboard/approvals' }] : []),
    ...(user?.role === 'finance' ? [{ icon: Wallet, label: 'Finance', path: '/dashboard/finance' }] : []),
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-[#0a1628] border-r border-border transform transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${collapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/dashboard" className={`flex items-center space-x-3 ${collapsed ? 'lg:justify-center lg:space-x-0' : ''}`}>
              <div className="p-2 bg-primary rounded-lg">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              {!collapsed && <span className="text-lg font-bold text-foreground">IST</span>}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center absolute -right-3 top-4 h-6 w-6 rounded-full shadow bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center ${collapsed ? "lg:justify-center" : "space-x-2.5"
                    } px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  title={collapsed ? item.label : ""}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "group-hover:text-foreground"
                      }`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            {!collapsed ? (
              <>
                <div className="flex items-center space-x-2.5 mb-2.5">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {user?.full_name ? getInitials(user.full_name) : <User />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary text-sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user?.full_name ? getInitials(user.full_name) : <User />}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex justify-center text-muted-foreground hover:text-foreground hover:bg-secondary p-2"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-end px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 lg:hidden" />
            <div className="flex items-center space-x-4">
              <DarkMode />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
