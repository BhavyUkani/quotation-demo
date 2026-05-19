import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Building,
    Package,
    FileText,
    BarChart3,
    MapPin,
    UserCircle,
    Bell,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronDown
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = ({ onLogout, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
        { name: 'Lead', path: '/dashboard/leads', icon: Users },
        { name: 'Clients', path: '/dashboard/clients', icon: Briefcase },
        { name: 'Packages', path: '/dashboard/packages', icon: Package },
        { name: 'Quotations', path: '/dashboard/quotations', icon: FileText },
        { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
        { name: 'Site', path: '/dashboard/site', icon: MapPin },
        { name: 'Employees', path: '/dashboard/employees', icon: UserCircle },
        { name: 'Departments', path: '/dashboard/departments', icon: Building },
        { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    // Fetch unread notification count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await api.get('/notifications/unread/count');
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();

        // Refresh count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Get user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar - Fixed and Sticky */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0">
                        <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="text-xl font-bold text-slate-800">Tattvix</span>
                        <button
                            className="ml-auto lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation - Scrollable */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon
                                    size={20}
                                    className={`mr-3 transition-colors ${'text-slate-400 group-hover:text-slate-600'
                                        }`}
                                    style={{ color: 'inherit' }}
                                />
                                <span className="font-medium text-sm">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile / Logout - Fixed at bottom */}
                    <div className="p-4 border-t border-slate-100 flex-shrink-0">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span className="font-medium text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content - With left margin for fixed sidebar */}
            <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
                {/* Top Header - Sticky */}
                <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden text-slate-500 hover:text-slate-700"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>

                            {/* Dynamic Page Title */}
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    {location.pathname === '/dashboard' && 'Dashboard'}
                                    {location.pathname === '/dashboard/leads' && 'Leads'}
                                    {location.pathname === '/dashboard/clients' && 'Clients'}
                                    {location.pathname === '/dashboard/packages' && 'Packages'}
                                    {location.pathname.startsWith('/dashboard/packages/') && 'Package Details'}
                                    {location.pathname === '/dashboard/quotations' && 'Quotations'}
                                    {location.pathname === '/dashboard/quotations/new' && 'New Quotation'}
                                    {location.pathname.startsWith('/dashboard/quotations/edit/') && 'Edit Quotation'}
                                    {location.pathname === '/dashboard/reports' && 'Reports'}
                                    {location.pathname === '/dashboard/site' && 'Site'}
                                    {location.pathname === '/dashboard/employees' && 'Employees'}
                                    {location.pathname === '/dashboard/departments' && 'Departments'}
                                    {location.pathname === '/dashboard/notifications' && 'Notifications'}
                                    {location.pathname === '/dashboard/settings' && 'Settings'}
                                </h1>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    {location.pathname === '/dashboard' && 'Welcome back! Here\'s what\'s happening today'}
                                    {location.pathname === '/dashboard/leads' && 'Manage and track all your leads'}
                                    {location.pathname === '/dashboard/clients' && 'Manage your client relationships'}
                                    {location.pathname === '/dashboard/packages' && 'Browse and manage service packages'}
                                    {location.pathname.startsWith('/dashboard/packages/') && 'View package details and specifications'}
                                    {location.pathname === '/dashboard/quotations' && 'Manage and track all your quotations'}
                                    {location.pathname === '/dashboard/quotations/new' && 'Create a new quotation for your client'}
                                    {location.pathname.startsWith('/dashboard/quotations/edit/') && 'Update quotation details'}
                                    {location.pathname === '/dashboard/reports' && 'View analytics and reports'}
                                    {location.pathname === '/dashboard/site' && 'Manage site information'}
                                    {location.pathname === '/dashboard/employees' && 'Manage your team members'}
                                    {location.pathname === '/dashboard/departments' && 'Organize your departments'}
                                    {location.pathname === '/dashboard/notifications' && 'Stay updated with system notifications'}
                                    {location.pathname === '/dashboard/settings' && 'Configure your preferences'}
                                </p>
                            </div>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="flex items-center space-x-4 relative">
                            {/* Notification Bell */}
                            <button
                                onClick={() => navigate('/dashboard/notifications')}
                                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Notifications"
                            >
                                <Bell size={22} className="text-slate-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* User Profile */}
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-3 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                    {user ? getUserInitials(user.name) : 'U'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-semibold text-slate-800">
                                        {user?.name || 'User'}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {user?.role || 'Employee'}
                                    </div>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {user ? getUserInitials(user.name) : 'U'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-800 truncate">
                                                        {user?.name || 'User'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 truncate">
                                                        {user?.email || 'user@example.com'}
                                                    </div>
                                                    <div className="text-xs text-red-600 font-medium mt-0.5">
                                                        {user?.role || 'Employee'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dashboard Router Outlet - Scrollable Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
