import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    Home,
    Building2,
    ArrowDownRight,
    Eye,
    MoreVertical,
    Filter,
    X,
    CheckCircle,
    Info,
    IndianRupee,
    Loader2
} from 'lucide-react';
import * as packageService from '../../api/packageService';
import MessageBox from '../../components/common/MessageBox';
import StatsCard from '../../components/common/StatsCard';

const Packages = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        category: '',
        description: '',
        features: '',
        costType: 'Calculated',
        fixedCost: ''
    });

    // Message Box State
    const [messageBox, setMessageBox] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onOk: null,
        onCancel: null
    });

    // Fetch packages from API
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPackagesData();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentPage, searchTerm, categoryFilter]);

    const fetchPackagesData = async () => {
        try {
            if (packages.length === 0 && isLoading) {
                // Initial load
            } else {
                setIsTableLoading(true);
            }
            const data = await packageService.fetchPackages(currentPage, itemsPerPage, searchTerm, categoryFilter);
            setPackages(data.packages || []);
            setTotalPages(data.totalPages || 0);
            setTotalItems(data.total || 0);
        } catch (err) {
            console.error('Error fetching packages:', err);
            setPackages([]);
        } finally {
            setIsLoading(false);
            setIsTableLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const closeMessageBox = () => {
        setMessageBox(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Show loading
        setMessageBox({
            isOpen: true,
            type: 'loading',
            title: editingPackage ? 'Updating Package' : 'Creating Package',
            message: 'Please wait while we process your request...',
            hideCancel: true
        });

        try {
            if (editingPackage) {
                // Update package
                await packageService.updatePackage(editingPackage.id, formData);
            } else {
                // Add new package
                await packageService.createPackage(formData);
            }
            fetchPackagesData();

            // Success message
            setMessageBox({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: editingPackage ? 'Package updated successfully!' : 'Package created successfully!',
                onOk: () => {
                    closeMessageBox();
                    closeModal();
                },
                hideCancel: true
            });
        } catch (err) {
            console.error('Error saving package:', err);
            setMessageBox({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save package.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const openAddModal = () => {
        setEditingPackage(null);
        setFormData({
            name: '',
            type: '',
            category: '',
            description: '',
            features: '',
            costType: 'Calculated',
            fixedCost: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            type: pkg.type,
            category: pkg.category,
            description: pkg.description,
            features: pkg.features,
            costType: pkg.costType || 'Calculated',
            fixedCost: pkg.fixedCost || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPackage(null);
    };

    const deletePackageHandler = (id) => {
        setMessageBox({
            isOpen: true,
            type: 'warning',
            title: 'Delete Package?',
            message: 'Are you sure you want to delete this package? This action cannot be undone.',
            onOk: async () => {
                setMessageBox(prev => ({
                    ...prev,
                    type: 'loading',
                    title: 'Deleting...',
                    message: 'Please wait while we delete the package.',
                    hideCancel: true
                }));
                try {
                    await packageService.deletePackage(id);
                    setPackages(packages.filter(pkg => pkg.id !== id));
                    setMessageBox({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Package deleted successfully.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                } catch (err) {
                    console.error('Error deleting package:', err);
                    setMessageBox({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete package.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const handleViewPackage = (pkg) => {
        navigate(`/dashboard/packages/${pkg.id}`, { state: { package: pkg } });
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Basic': 'bg-slate-100 text-slate-700 border-slate-200',
            'Silver': 'bg-gray-100 text-gray-700 border-gray-300',
            'Gold': 'bg-amber-100 text-amber-700 border-amber-300',
            'Platinum': 'bg-purple-100 text-purple-700 border-purple-300',
            'Premium': 'bg-red-100 text-red-700 border-red-300'
        };
        return colors[category] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getTypeIcon = (type) => {
        if (type.includes('Villa') || type.includes('Penthouse')) {
            return <Building2 size={16} />;
        }
        return <Home size={16} />;
    };

    // Hardcoded categories to ensure filters are always visible even with pagination
    const uniqueCategories = ['Basic', 'Silver', 'Gold', 'Platinum', 'Premium'];

    const stats = {
        total: totalItems,
        // These stats are now only reflecting the current page or would need backend support.
        // For now, simpler to just assume known counts are partial or rely on total.
        // We will keep 'total' accurate.
        totalTypes: new Set(packages.map(p => p.type)).size,
        totalCategories: uniqueCategories.length,
        counts: {} // Detailed counts by category are broken with backend pagination unless extra API call
    };

    const filteredByCategory = packages;

    if (isLoading) {
        return (
            <div className="bg-[#f8fafb] min-h-screen p-4 md:p-6 space-y-6 animate-pulse">
                {/* Stats Shimmer */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                <div className="flex gap-2 flex-wrap mb-4">
                    {[...Array(4)].map((_, i) => (
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
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <StatsCard
                    title="Total Packages"
                    count={stats.total}
                    icon={<Package />}
                    color="bg-slate-500"
                />
                <StatsCard
                    title="Total Types"
                    count={stats.totalTypes}
                    icon={<Home />}
                    color="bg-indigo-500"
                />
                <StatsCard
                    title="Total Categories"
                    count={stats.totalCategories}
                    icon={<Building2 />}
                    color="bg-purple-500"
                />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden md:flex gap-2 flex-wrap mb-4">
                <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${categoryFilter === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    All ({stats.total})
                </button>
                {uniqueCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${categoryFilter === category
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {category} ({stats.counts[category] || 0})
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
                            placeholder="Search packages by name or description..."
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
                    onClick={openAddModal}
                    className="hidden md:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors items-center gap-2"
                >
                    <Plus size={20} />
                    New Package
                </button>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={openAddModal}
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
                                onClick={() => { setCategoryFilter('all'); setIsMobileFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${categoryFilter === 'all'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-slate-50 text-slate-600 border border-slate-100'
                                    }`}
                            >
                                <span>All Packages</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryFilter === 'all' ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'}`}>{stats.total}</span>
                            </button>

                            <div className="border-t border-slate-100 my-2"></div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">By Category</p>

                            {uniqueCategories.map(item => (
                                <button
                                    key={item}
                                    onClick={() => { setCategoryFilter(item); setIsMobileFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${categoryFilter === item
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-white border border-slate-200 text-slate-600'
                                        }`}
                                >
                                    <span>{item}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryFilter === item ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-500'}`}>{stats.counts[item]}</span>
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
                {filteredByCategory.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-red-100 to-indigo-100 text-red-700 shadow-sm">
                                    {getTypeIcon(pkg.type)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{pkg.type} {pkg.category}</h3>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border mt-1 ${getCategoryColor(pkg.category)}`}>
                                        {pkg.category}
                                    </span>
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
                                    setOpenActionId(openActionId === pkg.id ? null : pkg.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${openActionId === pkg.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-3 ml-1">
                            <div className="flex items-center gap-2">
                                <Home size={14} className="text-slate-400 shrink-0" />
                                <span className="font-medium">{pkg.type}</span>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                {pkg.description}
                            </p>
                        </div>
                    </div>
                ))}
                {filteredByCategory.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Package size={24} />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No packages found</p>
                    </div>
                )}
            </div>

            {/* Packages Table - Desktop */}
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
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Package Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Category</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>

                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Features</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredByCategory.map((pkg) => (
                                <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-sm bg-gradient-to-br from-red-100 to-indigo-100 text-red-700">
                                                {getTypeIcon(pkg.type)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{pkg.type} {pkg.category}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                                    {pkg.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Home size={14} className="mr-2 text-slate-400" />
                                                {pkg.type}
                                            </div>
                                            <div>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryColor(pkg.category)}`}>
                                                    {pkg.category}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-lg font-bold text-red-600">{pkg.price}</p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">
                                            {pkg.features || 'No features listed'}
                                        </p>
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
                                                    setOpenActionId(openActionId === pkg.id ? null : pkg.id);
                                                }}
                                                className={`p-2 rounded-lg transition-colors ${openActionId === pkg.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredByCategory.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <Package size={24} />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No packages found</p>
                                            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
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

            {/* Add/Edit Package Modal */}
            {isModalOpen && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/20 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-slide-in-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    {editingPackage ? <Edit2 size={20} className="text-red-600" /> : <Plus size={20} className="text-red-600" />}
                                    {editingPackage ? 'Edit Package' : 'Add New Package'}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {editingPackage ? 'Update the package information' : 'Fill in the details to create a new package'}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <ArrowDownRight size={24} className="transform -rotate-90" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Package Type & Category */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                            <Package size={18} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Package Details</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Package Type</label>
                                            <input
                                                type="text"
                                                name="type"
                                                required
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                placeholder="e.g. 2BHK"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                                            <input
                                                type="text"
                                                name="category"
                                                required
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                                placeholder="e.g. Gold"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            />
                                        </div>



                                        {/* Cost Settings */}
                                        <div className="md:col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-sm font-semibold text-slate-700">
                                                    Package Costing Method
                                                </label>
                                                <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, costType: 'Calculated' }))}
                                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.costType === 'Calculated'
                                                            ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        Calculated
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, costType: 'Fixed' }))}
                                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.costType === 'Fixed'
                                                            ? 'bg-red-50 text-red-600 shadow-sm border border-red-100'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        Fixed Cost
                                                    </button>
                                                </div>
                                            </div>

                                            {formData.costType === 'Fixed' ? (
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Fixed Amount (₹)
                                                    </label>
                                                    <div className="relative">
                                                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                                        <input
                                                            type="number"
                                                            name="fixedCost"
                                                            step="0.01"
                                                            required={formData.costType === 'Fixed'}
                                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-slate-700"
                                                            placeholder="Enter fixed package cost"
                                                            value={formData.fixedCost}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                                                        <Info size={12} />
                                                        This amount will be used as the base cost for quotations.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-500 italic bg-white p-3 rounded border border-dashed border-slate-300 text-center">
                                                    Cost will be calculated automatically based on the sum of all spaces and work items.
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                            <textarea
                                                name="description"
                                                rows="3"
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400"
                                                placeholder="Brief description of the package"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Features</label>
                                            <textarea
                                                name="features"
                                                rows="2"
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none font-medium text-slate-700 placeholder:text-slate-400"
                                                placeholder="Comma-separated features"
                                                value={formData.features}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="pt-4 flex gap-3 border-t border-slate-50">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-5 py-2.5 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-700 hover:to-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                    >
                                        {editingPackage ? 'Save Changes' : 'Create Package'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}

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
                                    const pkg = packages.find(p => p.id === openActionId);
                                    if (!pkg) return null;
                                    return (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleViewPackage(pkg);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                                            >
                                                <Eye size={16} className="mr-3" />
                                                Edit Space
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openEditModal(pkg);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                                            >
                                                <Edit2 size={16} className="mr-3" />
                                                Edit Package
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deletePackageHandler(pkg.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete Package
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
            {/* Message Box */}
            <MessageBox
                isOpen={messageBox.isOpen}
                type={messageBox.type}
                title={messageBox.title}
                message={messageBox.message}
                onOk={messageBox.onOk}
                onCancel={messageBox.onCancel}
                hideCancel={messageBox.hideCancel}
            />
        </div>
    );
};

export default Packages;
