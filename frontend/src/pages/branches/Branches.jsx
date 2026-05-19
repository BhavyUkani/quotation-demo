import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Building,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    X,
    User
} from 'lucide-react';

import api from '../../api/axios';
import MessageBox from '../../components/common/MessageBox';
import StatsCard from '../../components/common/StatsCard';

const Branches = () => {
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedManager, setSelectedManager] = useState('All');

    // Action menu state
    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [messageBoxConfig, setMessageBoxConfig] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onOk: null,
        onCancel: null,
        okButtonName: 'Confirm',
        cancelButtonName: 'Cancel',
        hideCancel: false
    });

    const closeMessageBox = () => {
        setMessageBoxConfig(prev => ({ ...prev, isOpen: false }));
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        manager: ''
    });

    // Derive unique managers
    const managers = [...new Set(branches.map(b => b.manager).filter(Boolean))];

    const fetchBranches = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/branches');
            setBranches(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching branches:', err);
            setError('Failed to load branches');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchBranches();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBranch) {
                await api.put(`/branches/${editingBranch.id}`, formData);
            } else {
                await api.post('/branches', formData);
            }
            fetchBranches();
            closeSidebar();
        } catch (err) {
            console.error('Error saving branch:', err);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save branch. Please try again.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const openEditSidebar = (branch) => {
        setEditingBranch(branch);
        setFormData({
            name: branch.name,
            email: branch.email,
            phone: branch.phone,
            address: branch.address,
            manager: branch.manager
        });
        setIsSidebarOpen(true);
    };

    const openAddSidebar = () => {
        setEditingBranch(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            manager: ''
        });
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setEditingBranch(null);
    };

    const deleteBranch = (id) => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'warning',
            title: 'Delete Branch',
            message: 'Are you sure you want to delete this branch?',
            okButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            onOk: async () => {
                try {
                    await api.delete(`/branches/${id}`);
                    setBranches(branches.filter(b => b.id !== id));
                    closeMessageBox();
                } catch (err) {
                    console.error('Error deleting branch:', err);
                    closeMessageBox();
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete branch.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const filteredBranches = branches.filter(branch => {
        const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (branch.address && branch.address.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesManager = selectedManager === 'All' || branch.manager === selectedManager;
        return matchesSearch && matchesManager;
    });

    const stats = {
        total: branches.length,
        managers: managers.length
    };

    return (
        <>
            <div>
                {/* Stats Cards */}
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title="Total Branches"
                        count={stats.total}
                        icon={<Building />}
                        color="bg-blue-500"
                    />
                    <StatsCard
                        title="Active Managers"
                        count={stats.managers}
                        icon={<User />}
                        color="bg-amber-500"
                    />
                </div>

                {/* Search Bar & Mobile Filter Trigger */}
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search branches by name or address..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Desktop Manager Filter - Hidden on Mobile */}
                        <div className="relative hidden md:block">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                            <select
                                className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-slate-600 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                                value={selectedManager}
                                onChange={(e) => setSelectedManager(e.target.value)}
                            >
                                <option value="All">All Managers</option>
                                {managers.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="md:hidden px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Filter size={20} />
                        </button>
                    </div>

                    <button
                        onClick={openAddSidebar}
                        className="hidden md:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        New Branch
                    </button>
                </div>

                {/* Mobile FAB */}
                <button
                    onClick={openAddSidebar}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center z-[90] transition-transform active:scale-95"
                >
                    <Plus size={28} />
                </button>

                {/* Mobile Filter Drawer */}
                {isMobileFilterOpen && (
                    <div className="fixed inset-0 z-[10001] flex justify-end bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setIsMobileFilterOpen(false)}>
                        <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col animate-slide-in-right" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Filter size={20} className="text-red-600" />
                                    Filters
                                </h3>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-3 overflow-y-auto flex-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">By Manager</p>
                                <button
                                    onClick={() => { setSelectedManager('All'); setIsMobileFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${selectedManager === 'All'
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-slate-50 text-slate-600 border border-slate-100'
                                        }`}
                                >
                                    <span>All Managers</span>
                                </button>
                                {managers.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => { setSelectedManager(m); setIsMobileFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${selectedManager === m
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-white border border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        <span>{m}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 mb-20 mt-6">
                    {filteredBranches.map((branch) => (
                        <div key={branch.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                        <Building size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">{branch.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{branch.departmentCount || 0} Departments</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const leftPos = window.innerWidth < 640
                                            ? Math.min(rect.right - 192, window.innerWidth - 200)
                                            : rect.right - 192;

                                        setActionPosition({
                                            top: rect.bottom + window.scrollY,
                                            left: Math.max(10, leftPos + window.scrollX)
                                        });
                                        setOpenActionId(openActionId === branch.id ? null : branch.id);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${openActionId === branch.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 mb-3 ml-1">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{branch.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-slate-400 shrink-0" />
                                    <span>{branch.phone}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                    <span className="truncate max-w-[250px]">{branch.address}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-semibold text-slate-500">Manager:</span>
                                    <span className="text-sm text-slate-700">{branch.manager}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredBranches.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <Building size={24} />
                            </div>
                            <p className="text-lg font-medium text-slate-600">No branches found</p>
                        </div>
                    )}
                </div>

                {/* Branches Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden mt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBranches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3">
                                                    <Building size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{branch.name}</p>
                                                    <p className="text-xs text-slate-500">{branch.departmentCount || 0} Departments</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 space-y-1">
                                                <div className="flex items-center"><Mail size={12} className="mr-2 text-slate-400" /> {branch.email}</div>
                                                <div className="flex items-center"><Phone size={12} className="mr-2 text-slate-400" /> {branch.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start text-sm text-slate-600">
                                                <MapPin size={14} className="mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                                                <span className="line-clamp-2 max-w-xs">{branch.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{branch.manager}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setActionPosition({
                                                            top: rect.bottom + window.scrollY,
                                                            left: rect.right - 192 + window.scrollX
                                                        });
                                                        setOpenActionId(openActionId === branch.id ? null : branch.id);
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${openActionId === branch.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBranches.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                    <Building size={24} />
                                                </div>
                                                <p className="text-lg font-medium text-slate-600">No branches found</p>
                                                <p className="text-sm">Try adjusting your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar / Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">
                            {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                        </h2>
                        <button onClick={closeSidebar} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    placeholder="e.g. New York HQ"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        placeholder="branch@company.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                                <input
                                    type="text"
                                    name="manager"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    placeholder="Manager Name"
                                    value={formData.manager}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                                    placeholder="Full address..."
                                    value={formData.address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeSidebar}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    {editingBranch ? 'Update Branch' : 'Create Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Action Menu Portal */}
            {
                openActionId && ReactDOM.createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[9998]"
                            onClick={() => setOpenActionId(null)}
                        ></div>
                        <div
                            className="absolute bg-white rounded-lg shadow-xl border border-slate-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100 w-48"
                            style={{
                                top: `${actionPosition.top}px`,
                                left: `${actionPosition.left}px`
                            }}
                        >
                            <div className="py-1">
                                {(() => {
                                    const branch = branches.find(b => b.id === openActionId);
                                    if (!branch) return null;
                                    return (
                                        <>
                                            <button
                                                onClick={() => {
                                                    openEditSidebar(branch);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                                            >
                                                <Edit2 size={16} className="mr-3" />
                                                Edit Branch
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deleteBranch(branch.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete Branch
                                            </button>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </>,
                    document.body
                )
            }

            {/* MessageBox */}
            <MessageBox
                isOpen={messageBoxConfig.isOpen}
                type={messageBoxConfig.type}
                title={messageBoxConfig.title}
                message={messageBoxConfig.message}
                onOk={messageBoxConfig.onOk}
                onCancel={messageBoxConfig.onCancel || closeMessageBox}
                okButtonName={messageBoxConfig.okButtonName}
                cancelButtonName={messageBoxConfig.cancelButtonName}
                hideCancel={messageBoxConfig.hideCancel}
            />
        </>
    );
};

export default Branches;
