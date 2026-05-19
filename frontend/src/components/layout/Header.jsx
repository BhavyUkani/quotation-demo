import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, LogOut, ChevronDown, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const currentUser = user?.user || user;
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Get user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get page title and description based on route
    const getPageInfo = () => {
        const path = location.pathname;

        const routes = {
            '/dashboard': { title: 'Dashboard', description: "Welcome back! Here's what's happening today" },
            '/dashboard/leads': { title: 'Leads', description: 'Manage and track all your leads' },
            '/dashboard/clients': { title: 'Clients', description: 'Manage your client relationships' },
            '/dashboard/packages': { title: 'Packages', description: 'Browse and manage service packages' },
            '/dashboard/quotations': { title: 'Quotations', description: 'Manage and track all your quotations' },
            '/dashboard/quotations/new': { title: 'New Quotation', description: 'Create a new quotation for your client' },
            '/dashboard/reports': { title: 'Reports', description: 'View analytics and reports' },
            '/dashboard/site': { title: 'Site', description: 'Manage site information' },
            '/dashboard/employees': { title: 'Employees', description: 'Manage your team members' },
            '/dashboard/departments': { title: 'Departments', description: 'Organize your departments' },
            '/dashboard/branches': { title: 'Branches', description: 'Manage your branches' },
            '/dashboard/notifications': { title: 'Notifications', description: 'Stay updated with system notifications' },
            '/dashboard/settings': { title: 'Settings', description: 'Configure your preferences' },
        };

        // Check for dynamic routes
        if (path.startsWith('/dashboard/packages/')) {
            return { title: 'Package Details', description: 'View package details and specifications' };
        }
        if (path.startsWith('/dashboard/quotations/view/')) {
            return { title: 'View Quotation', description: 'Quotation details and information' };
        }
        if (path.startsWith('/dashboard/quotations/edit/')) {
            return { title: 'Edit Quotation', description: 'Update quotation details' };
        }

        return routes[path] || { title: 'Dashboard', description: '' };
    };

    // ... (existing code: title, description destructuring)
    const { title, description } = getPageInfo();

    // Master / Branch Switcher Logic
    const isMaster = currentUser?.role === 'Admin' || currentUser?.isMaster;
    const [branches, setBranches] = useState([]);

    // Initialize selected branch from user profile (DB source of truth) or fallback to local storage
    const [selectedBranchId, setSelectedBranchId] = useState(currentUser?.lastSelectedBranchId || '');

    React.useEffect(() => {
        if (isMaster) {
            const fetchBranches = async () => {
                try {
                    const response = await api.get('/branches');
                    setBranches(response.data);

                    // If user has no last selected branch in DB, but we have branches, maybe select first?
                    // Or keep it empty to show "All"? User request implied "if a branch is selected".
                    // Let's rely on currentUser.lastSelectedBranchId. 
                } catch (error) {
                    console.error('Failed to fetch branches:', error);
                }
            };
            fetchBranches();
        }
    }, [isMaster]);

    const handleBranchSwitch = async (e) => {
        const branchId = e.target.value; // Can be empty string for "All" ?
        setSelectedBranchId(branchId);

        try {
            // Persist the selection to the backend
            await api.post('/branches/select', { branchId: branchId || null });

            // Reload to refresh all data views with new context
            window.location.reload();
        } catch (err) {
            console.error('Failed to switch branch:', err);
            // Revert UI if failed? Or just alert.
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                        onClick={onMenuClick}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Dynamic Page Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                        {description && (
                            <p className="text-sm text-slate-600 mt-0.5">{description}</p>
                        )}
                    </div>
                </div>

                {/* Right Side - Notifications & Profile */}
                <div className="flex items-center gap-4">
                    {/* Branch Switcher (Masters Only) */}
                    {isMaster && (
                        <div className="hidden md:flex items-center bg-slate-50 rounded-lg border border-slate-200 px-3 py-2">
                            <Building size={16} className="text-slate-500 mr-2" />
                            <select
                                value={selectedBranchId}
                                onChange={handleBranchSwitch}
                                className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notifications */}
                    <button
                        onClick={() => navigate('/dashboard/notifications')}
                        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Bell size={20} />
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-semibold">
                                    {getUserInitials(currentUser?.name)}
                                </span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-slate-800">{currentUser?.name || 'User'}</p>
                                <p className="text-xs text-slate-500">{currentUser?.email || ''}</p>

                            </div>
                            <ChevronDown size={16} className="text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                                    {isMaster && (
                                        <div className="md:hidden px-4 py-2 border-b border-slate-100 mb-1">
                                            <div className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                                                <Building size={12} />
                                                Switch Branch
                                            </div>
                                            <select
                                                value={selectedBranchId}
                                                onChange={handleBranchSwitch}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-300"
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map(branch => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsProfileDropdownOpen(false);
                                            navigate('/dashboard/settings');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <ChevronDown size={16} />
                                        Settings
                                    </button>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
