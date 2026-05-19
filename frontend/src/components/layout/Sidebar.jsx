import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    X,
    Building2,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Menu
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse, unreadCount = 0 }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [isMyCompanyOpen, setIsMyCompanyOpen] = React.useState(false); // Default closed

    // Handle potential nested user object from API response structure
    const currentUser = user?.user || user;
    const userPermissions = currentUser?.permissions || [];
    const userRole = currentUser?.role;

    const homeMenuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
        { name: 'Leads', path: '/dashboard/leads', icon: Users, permission: 'Leads' },
        { name: 'Clients', path: '/dashboard/clients', icon: Briefcase, permission: 'Clients' },
        { name: 'Quotations', path: '/dashboard/quotations', icon: FileText, permission: 'Quotations' },
        { name: 'Sites', path: '/dashboard/sites', icon: MapPin, permission: 'Sites' },
        { name: 'Packages', path: '/dashboard/packages', icon: Package, permission: 'Packages' },
    ];

    const filteredHomeMenuItems = homeMenuItems.filter(item => {
        if (!item.permission) return true;
        if (userRole === 'Admin') return true;
        return userPermissions.includes(item.permission);
    });

    const companyMenuItems = [
        { name: 'Employees', path: '/dashboard/employees', icon: UserCircle, permission: 'Employees' },
        { name: 'Departments', path: '/dashboard/departments', icon: Building, permission: 'Departments' },
        { name: 'Branches', path: '/dashboard/branches', icon: Building2, permission: 'Branches' },
    ];

    const filteredCompanyMenuItems = companyMenuItems.filter(item => {
        if (!item.permission) return true;
        if (userRole === 'Admin') return true;
        return userPermissions.includes(item.permission);
    });

    const businessManagementItems = [
        { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, permission: 'Reports' },
        { name: 'Notifications', path: '/dashboard/notifications', icon: Bell, badge: unreadCount, permission: 'Notifications' },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings, permission: 'Settings' },
    ];

    const filteredBusinessManagementItems = businessManagementItems.filter(item => {
        if (!item.permission) return true;
        if (userRole === 'Admin') return true;
        return userPermissions.includes(item.permission);
    });

    const isCompanyActive = filteredCompanyMenuItems.some(item => location.pathname.startsWith(item.path));

    // Auto-expand "My Company" if an item inside is active
    useEffect(() => {
        if (isCompanyActive && !isCollapsed) {
            setIsMyCompanyOpen(true);
        }
    }, [isCompanyActive, isCollapsed]);

    const NavItem = ({ item, isSubitem = false }) => {
        const Icon = item.icon;
        return (
            <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                        ? (isSubitem ? 'bg-rose-50 text-rose-600 font-semibold' : 'bg-rose-500 text-white font-semibold')
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${isCollapsed ? 'justify-center' : ''}`
                }
                onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                }}
                title={isCollapsed ? item.name : ''}
            >
                <Icon size={20} className={`flex-shrink-0 group-hover:scale-110 transition-transform duration-200`} />

                {!isCollapsed && (
                    <>
                        <span className="flex-1 text-sm font-medium whitespace-nowrap overflow-hidden">{item.name}</span>
                        {item.badge > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {item.badge > 99 ? '99+' : item.badge}
                            </span>
                        )}
                    </>
                )}

                {isCollapsed && item.badge > 0 && (
                    <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                )}
            </NavLink>
        );
    };

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200 shadow-xl transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className={`h-30 flex items-center border-b border-slate-100 flex-shrink-0 bg-white transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'px-6'}`}>
                        <div className='w-full h-16 object-cover '>
                            <img src={logo} alt="Tattvix" className="w-full h-16 object-contain" />
                        </div>
                        <button
                            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-md"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu - Scrollable */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 hide-scrollbar">
                        {/* Home Section */}
                        <div>
                            <div className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 ${isCollapsed ? 'text-center' : ''}`}>
                                {isCollapsed ? 'Main' : 'Main Menu'}
                            </div>
                            <div className="space-y-1">
                                {filteredHomeMenuItems.map((item) => (
                                    <NavItem key={item.path} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Business Management Section */}
                        <div>
                            <div className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 ${isCollapsed ? 'text-center' : ''}`}>
                                {isCollapsed ? 'Mgmt' : 'Business Management'}
                            </div>
                            <div className="space-y-1">
                                {/* My Company Submenu */}
                                {!isCollapsed ? (
                                    <>
                                        <button
                                            onClick={() => setIsMyCompanyOpen(!isMyCompanyOpen)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group mb-1 ${isCompanyActive
                                                ? 'bg-rose-500 text-white font-semibold'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Building size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                                                <span className="text-sm font-medium whitespace-nowrap">My Company</span>
                                            </div>
                                            {isMyCompanyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                        <div className={`transition-all duration-200 overflow-hidden ${isMyCompanyOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {filteredCompanyMenuItems.map((item) => (
                                                <div key={item.path} className="pl-4">
                                                    <NavItem item={item} isSubitem={true} />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    // When collapsed, show company items directly to avoid complex nested flyouts
                                    filteredCompanyMenuItems.map((item) => (
                                        <NavItem key={item.path} item={item} />
                                    ))
                                )}

                                {/* Remaining Business Items */}
                                {filteredBusinessManagementItems.map((item) => (
                                    <NavItem key={item.path} item={item} />
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* Logout & Collapse Section */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">

                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:flex w-full items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>

                        {!isCollapsed && (
                            <div className="mt-2 text-xs text-slate-400 text-center font-medium">
                                v1.0.0 • © 2024 Tattvix
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
