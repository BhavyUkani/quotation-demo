import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Trash2,
    Edit2,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    ArrowDownRight,
    User,
    Building,
    Eye,
    Filter,
    X,
    Construction,
    CheckCircle,
    File,
    Loader2
} from 'lucide-react';
import * as siteService from '../../api/siteService';
import MessageBox from '../../components/common/MessageBox';
import StatsCard from '../../components/common/StatsCard';

const Sites = () => {
    const navigate = useNavigate();
    const [sites, setSites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingSite, setEditingSite] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');

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
        clientName: '',
        projectName: '',
        supervisorName: '',
        supervisorPhone: '',

        address: '',
        status: 'Active'
    });

    const fetchSitesData = async () => {
        try {
            if (sites.length === 0 && isLoading) {
                // Initial load
            } else {
                setIsTableLoading(true);
            }
            const data = await siteService.fetchSites(currentPage, itemsPerPage, searchTerm, statusFilter);
            setSites(data.sites || []);
            setTotalPages(data.totalPages || 0);
            setTotalItems(data.total || 0);
        } catch (err) {
            console.error('Error fetching sites:', err);
            setSites([]);
        } finally {
            setIsLoading(false);
            setIsTableLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSitesData();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, statusFilter]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Show loading
        setMessageBoxConfig({
            isOpen: true,
            type: 'loading',
            title: editingSite ? 'Updating Site' : 'Creating Site',
            message: 'Please wait while we process your request...',
            hideCancel: true
        });

        try {
            if (editingSite) {
                await siteService.updateSite(editingSite.id, formData);
            } else {
                await siteService.createSite(formData);
            }
            fetchSitesData();

            // Success message
            setMessageBoxConfig({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: editingSite ? 'Site updated successfully!' : 'Site created successfully!',
                onOk: () => {
                    closeMessageBox();
                    closeSidebar();
                },
                hideCancel: true
            });
        } catch (err) {
            console.error('Error saving site:', err);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save site. Please try again.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const deleteSiteHandler = (id) => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'warning',
            title: 'Delete Site',
            message: 'Are you sure you want to delete this site? This action cannot be undone.',
            okButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            onOk: async () => {
                setMessageBoxConfig(prev => ({
                    ...prev,
                    type: 'loading',
                    title: 'Deleting...',
                    message: 'Please wait while we delete the site.',
                    hideCancel: true
                }));
                try {
                    await siteService.deleteSite(id);
                    setSites(sites.filter(s => s.id !== id));
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Site deleted successfully.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                } catch (err) {
                    console.error('Error deleting site:', err);
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete site.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const openEditSidebar = (site) => {
        setEditingSite(site);
        setFormData({
            clientName: site.clientName,
            projectName: site.projectName,
            supervisorName: site.supervisorName || '',
            supervisorPhone: site.supervisorPhone || '',

            address: site.address || '',
            status: site.status || 'Active'
        });
        setIsSidebarOpen(true);
    };

    const openAddSidebar = () => {
        setEditingSite(null);
        setFormData({
            clientName: '',
            projectName: '',
            supervisorName: '',
            supervisorPhone: '',

            address: '',
            status: 'Active'
        });
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setEditingSite(null);
    };

    // Client-side filtering removed
    const filteredByStatus = sites;

    const stats = {
        total: totalItems,
        active: sites.filter(s => s.status === 'Active').length,
        completed: sites.filter(s => s.status === 'Completed').length
    };

    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : '??';
    };

    if (isLoading) {
        return (
            <div className="bg-[#f8fafb] min-h-screen p-4 md:p-6 space-y-6 animate-pulse">
                {/* Stats Shimmer */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                            <div className="flex justify-between items-end">
                                <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                                <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters Shimmer */}
                <div className="flex gap-2 overflow-scroll hide-scrollbar mb-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-24 h-10 bg-white rounded-lg border border-slate-200 shrink-0"></div>
                    ))}
                </div>

                {/* Search & Action Shimmer */}
                <div className="flex flex-col md:flex-row gap-2 h-10">
                    <div className="flex-1 bg-white rounded-lg border border-slate-200"></div>
                    <div className="hidden md:block w-32 bg-slate-200 rounded-lg"></div>
                </div>

                {/* List/Table Shimmer */}
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mt-6 h-96">
                    <div className="h-10 border-b border-slate-200 bg-slate-50"></div>
                    <div className="p-4 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-slate-50 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f8fafb] min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                {[
                    { label: 'Total Sites', count: stats.total, color: 'bg-blue-500', icon: <Construction /> },
                    { label: 'Active Sites', count: stats.active, color: 'bg-orange-500', icon: <CheckCircle /> },
                    { label: 'Completed Sites', count: stats.completed, color: 'bg-green-500', icon: <File /> },
                ].map((stat) => (
                    <StatsCard
                        key={stat.label}
                        title={stat.label}
                        count={stat.count}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}

            </div>
            <div className='mb-3 flex flex-wrap gap-2'>
                {['all', 'active', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all border ${statusFilter === status ? 'bg-[#e11d48] text-white border-[#e11d48]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                        {status === 'all' ? `All (${stats.total})` : status.charAt(0).toUpperCase() + status.slice(1) + ` (${stats[status] || 0})`}

                    </button>
                ))}
            </div>

            {/* Search Bar & Mobile Filter Trigger */}
            <div className="flex flex-col md:flex-row gap-2">

                <div className="relative flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search sites by client, project, or supervisor..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                    className="hidden md:flex px-4 py-2 bg-rose-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors items-center gap-2"
                >
                    <Plus size={20} />
                    New Site
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
                            <button
                                onClick={() => { setStatusFilter('all'); setIsMobileFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${statusFilter === 'all'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-slate-50 text-slate-600 border border-slate-100'
                                    }`}
                            >
                                <span>All Sites</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusFilter === 'all' ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'}`}>{stats.total}</span>
                            </button>

                            <div className="border-t border-slate-100 my-2"></div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">By Status</p>

                            {[
                                { id: 'active', label: 'Active', count: stats.active },
                                { id: 'completed', label: 'Completed', count: stats.completed }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setStatusFilter(item.id); setIsMobileFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${statusFilter === item.id
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-white border border-slate-200 text-slate-600'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusFilter === item.id ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-500'}`}>{item.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 mb-20 mt-6 relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg">
                        <Loader2 className="animate-spin text-rose-600" size={30} />
                    </div>
                )}
                {filteredByStatus.map((site) => (
                    <div key={site.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                                    {getInitials(site.projectName || site.clientName)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{site.projectName}</p>
                                    <p className="text-xs text-slate-500">{site.clientName}</p>
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
                                    setOpenActionId(openActionId === site.id ? null : site.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${openActionId === site.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-3 ml-1">
                            <div className="flex items-start gap-2">
                                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                <span className="truncate max-w-[250px]">{site.address || 'No Address'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-slate-400 shrink-0" />
                                <span>{site.supervisorName || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 w-4 font-bold text-center">₹</span>
                                <span className="font-medium text-slate-700">{(site.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="mt-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${site.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {site.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredByStatus.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Search size={24} />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No sites found</p>
                    </div>
                )}
            </div>

            {/* Sites Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden mt-6 relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-rose-600" size={30} />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-20">SrNo</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Site Address</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Supervisor</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Total Expense</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredByStatus.map((site, index) => (
                                <tr key={site.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-600">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{site.clientName}</span>
                                            <span className="text-xs text-slate-500">{site.projectName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-start text-sm text-slate-600 max-w-xs">
                                            <MapPin size={16} className="text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <span>{site.address || 'No Address'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm font-medium text-slate-700">
                                                <User size={14} className="text-slate-400 mr-2" />
                                                {site.supervisorName || 'N/A'}
                                            </div>

                                            {site.supervisorPhone && (
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Phone size={12} className="text-slate-400 mr-2" />
                                                    {site.supervisorPhone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-700">
                                            ₹ {(site.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border 
                                            ${site.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-2 opacity-60 ${site.status === 'Active' ? 'bg-green-600' : 'bg-slate-500'}`}></span>
                                            {site.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setActionPosition({
                                                        top: rect.bottom + window.scrollY,
                                                        left: rect.right - 192 + window.scrollX // Align right, width 48 (12rem = 192px)
                                                    });
                                                    setOpenActionId(openActionId === site.id ? null : site.id);
                                                }}
                                                className={`p-2 rounded-lg transition-colors ${openActionId === site.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredByStatus.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <Search size={24} />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No sites found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-white rounded-b-lg">
                    <div className="text-sm text-slate-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 text-sm font-medium rounded-md border ${currentPage === pageNum ? 'bg-red-600 text-white border-red-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar Portal */}
            {
                isSidebarOpen && ReactDOM.createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/20 backdrop-blur-sm"
                        onClick={closeSidebar}
                    >
                        <div
                            className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-slide-in-right"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        {editingSite ? <Edit2 size={20} className="text-red-600" /> : <Plus size={20} className="text-red-600" />}
                                        {editingSite ? 'Edit Site Details' : 'Add New Site'}
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {editingSite ? 'Update the site information below' : 'Fill in the details to create a new site'}
                                    </p>
                                </div>
                                <button
                                    onClick={closeSidebar}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                                >
                                    <ArrowDownRight size={24} className="transform -rotate-90" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Main Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                                            <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                                <Building size={18} />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Project Details</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                                                <input
                                                    type="text"
                                                    name="projectName"
                                                    required
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="e.g. HQ Renovation"
                                                    value={formData.projectName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Name <small className="text-red-500">(Read Only)</small></label>
                                                <input
                                                    type="text"
                                                    name="clientName"
                                                    required
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Client Name"
                                                    value={formData.clientName}
                                                    onChange={handleInputChange}
                                                    readOnly
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Site Address</label>
                                                <textarea
                                                    name="address"
                                                    rows="3"
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Full site address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                                                <div className="relative">
                                                    <select
                                                        name="status"
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all cursor-pointer appearance-none font-medium text-slate-700"
                                                        value={formData.status}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                                                        <ArrowDownRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Supervisor Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <User size={18} />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Supervisor Details</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Supervisor Name</label>
                                                <input
                                                    type="text"
                                                    name="supervisorName"
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Supervisor Name"
                                                    value={formData.supervisorName}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                                        <input
                                                            type="tel"
                                                            name="supervisorPhone"
                                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                            placeholder="Phone Number"
                                                            value={formData.supervisorPhone}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="pt-4 flex gap-3 border-t border-slate-50">
                                        <button
                                            type="button"
                                            onClick={closeSidebar}
                                            className="flex-1 px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-5 py-2.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                        >
                                            {editingSite ? 'Save Changes' : 'Create Site'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
            {/* Action Menu Control */}
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
                                    const site = sites.find(s => s.id === openActionId);
                                    if (!site) return null;
                                    return (
                                        <>
                                            <button
                                                onClick={() => {
                                                    navigate(`/dashboard/sites/${site.id}`);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                                            >
                                                <Eye size={16} className="mr-3" />
                                                Add Expenses
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openEditSidebar(site);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                                            >
                                                <Edit2 size={16} className="mr-3" />
                                                Edit Site
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deleteSiteHandler(site.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete Site
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
        </div>
    );
};

export default Sites;
