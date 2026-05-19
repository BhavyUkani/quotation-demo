import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, FileText, Calendar, DollarSign, Phone, Search, Printer, MoreVertical, Copy, User, Filter, X, Construction, BookMarked, DraftingCompass, Send, Check, CheckCircleIcon, XCircleIcon, Users, FileWarning, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import MessageBox from '../../components/common/MessageBox';
import {
    getAllQuotations,
    updateQuotationStatus,
    deleteQuotation as deleteQuotationService,
    duplicateQuotation as duplicateQuotationService,
    downloadQuotationPDF
} from '../../api/quotationService';
import { createSiteFromQuotation } from '../../api/siteService';
import StatsCard from '../../components/common/StatsCard';
import Constants from '../../constents/constants';

const Quotations = () => {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [filter, setFilter] = useState(Constants.QUOTATION_FILTER.ALL); // all, draft, sent, accepted, rejected, expired
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });

    // PDF Download Progress State
    const [downloadProgress, setDownloadProgress] = useState({
        isOpen: false,
        progress: 0,
        loaded: 0,
        total: 0,
        fileName: '',
        isDownloading: false,
        speed: 0
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

    // Status Modal State
    // Status Modal State
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        quotationId: null,
        currentStatus: '',
        quotation: null
    });

    const openStatusModal = (quotation) => {
        setStatusModal({
            isOpen: true,
            quotationId: quotation.id,
            currentStatus: quotation.status,
            quotation: quotation
        });
        setOpenActionId(null);
    };

    const closeStatusModal = () => {
        setStatusModal({ isOpen: false, quotationId: null, currentStatus: '', quotation: null });
    };

    const handleStatusUpdate = async (newStatus) => {
        // Intercept Accepted status
        if (newStatus === Constants.QUOTATION_STATUS.ACCEPTED) {
            closeStatusModal();
            setSupervisorModal({
                isOpen: true,
                quotationId: statusModal.quotationId,
                quotation: statusModal.quotation
            });
            return;
        }

        try {
            await updateQuotationStatus(statusModal.quotationId, newStatus);

            // Update local state
            setQuotations(prev => prev.map(q =>
                q.id === statusModal.quotationId ? { ...q, status: newStatus } : q
            ));

            closeStatusModal();

            setMessageBox({
                isOpen: true,
                type: 'success',
                title: 'Status Updated',
                message: `Quotation status updated to ${newStatus}`,
                onOk: closeMessageBox,
                hideCancel: true
            });
        } catch (error) {
            console.error('Error updating status:', error);
            setMessageBox({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to update status.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    // Supervisor Modal State
    const [supervisorModal, setSupervisorModal] = useState({
        isOpen: false,
        quotationId: null,
        quotation: null
    });
    const [employees, setEmployees] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        if (supervisorModal.isOpen) {
            fetchEmployees();
        }
    }, [supervisorModal.isOpen]);

    const handleAssignSupervisor = async () => {
        if (!selectedSupervisor) {
            setMessageBox({
                isOpen: true,
                type: 'warning',
                title: 'Validation',
                message: 'Please enter a supervisor name',
                onOk: closeMessageBox,
                hideCancel: true
            });
            return;
        }

        setIsAssigning(true);
        try {
            // 1. Create Site
            const quotation = supervisorModal.quotation;

            // Prepare site payload
            const sitePayload = {
                quotationId: quotation.id,
                supervisorName: selectedSupervisor
            };

            // Try creating site
            try {
                await createSiteFromQuotation(sitePayload);
            } catch (siteError) {
                console.error("Site creation failed, but proceeding with status update", siteError);
            }

            // 2. Update Quotation Status
            await updateQuotationStatus(supervisorModal.quotationId, Constants.QUOTATION_STATUS.ACCEPTED);

            // Update local state
            setQuotations(prev => prev.map(q =>
                q.id === supervisorModal.quotationId ? { ...q, status: Constants.QUOTATION_STATUS.ACCEPTED } : q
            ));

            setSupervisorModal({ isOpen: false, quotationId: null, quotation: null });
            setSelectedSupervisor('');

            setMessageBox({
                isOpen: true,
                type: 'success',
                title: 'Quotation Accepted',
                message: 'Quotation accepted and Site created (Supervisor Assigned).',
                onOk: closeMessageBox,
                hideCancel: true
            });

        } catch (error) {
            console.error('Error assigning supervisor:', error);
            setMessageBox({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to assign supervisor and accept quotation.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        } finally {
            setIsAssigning(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuotations();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [currentPage, filter, searchTerm]);

    const fetchQuotations = async () => {
        try {
            if (quotations.length === 0 && loading) {
                // Initial load
            } else {
                setIsTableLoading(true);
            }
            const data = await getAllQuotations(currentPage, itemsPerPage, searchTerm, filter);
            setQuotations(data.quotations || []);
            setTotalPages(data.totalPages || 0);
            setTotalItems(data.total || 0);
        } catch (error) {
            console.error('Error fetching quotations:', error);
            setQuotations([]);
        } finally {
            setLoading(false);
            setIsTableLoading(false);
        }
    };

    const closeMessageBox = () => {
        setMessageBox(prev => ({ ...prev, isOpen: false }));
    };

    const deleteQuotation = (id) => {
        setMessageBox({
            isOpen: true,
            type: 'warning',
            title: 'Delete Quotation?',
            message: 'Are you sure you want to delete this quotation? This action cannot be undone.',
            onOk: async () => {
                setMessageBox(prev => ({
                    ...prev,
                    type: 'loading',
                    title: 'Deleting...',
                    message: 'Please wait while we delete the quotation.',
                    hideCancel: true
                }));
                try {
                    await deleteQuotationService(id);
                    setQuotations(prev => prev.filter(q => q.id !== id));
                    setMessageBox({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Quotation deleted successfully!',
                        onOk: closeMessageBox,
                        hideCancel: true,
                        okButtonName: 'OK'
                    });
                } catch (error) {
                    console.error('Error deleting quotation:', error);
                    setMessageBox({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete quotation.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const duplicateQuotation = (id) => {
        setMessageBox({
            isOpen: true,
            type: 'info',
            title: 'Duplicate Quotation?',
            message: 'Are you sure you want to duplicate this quotation?',
            onOk: async () => {
                setMessageBox(prev => ({
                    ...prev,
                    type: 'loading',
                    title: 'Duplicating...',
                    message: 'Please wait while we duplicate the quotation.',
                    hideCancel: true
                }));
                try {
                    await duplicateQuotationService(id);
                    await fetchQuotations(); // Reload list
                    setMessageBox({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Quotation duplicated successfully!',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                } catch (error) {
                    console.error('Error duplicating quotation:', error);
                    setMessageBox({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to duplicate quotation.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const handlePrint = async (id) => {
        // Reset and open progress modal
        setDownloadProgress({
            isOpen: true,
            progress: 0,
            loaded: 0,
            total: 0, // Will be set by axios
            speed: 0,
            fileName: 'Generating PDF...',
            isDownloading: false // Waiting for initial response
        });

        const startTime = Date.now();

        try {
            const response = await downloadQuotationPDF(id, (progressEvent) => {
                const total = progressEvent.total || progressEvent.estimated || 0;
                const current = progressEvent.loaded;
                const percentCompleted = total > 0 ? Math.round((current * 100) / total) : 0;

                const currentTime = Date.now();
                const timeElapsed = (currentTime - startTime) / 1000; // in seconds
                const speed = timeElapsed > 0 ? current / timeElapsed : 0; // bytes per second

                setDownloadProgress(prev => ({
                    ...prev,
                    isDownloading: true,
                    loaded: current,
                    total: total,
                    progress: percentCompleted,
                    speed: speed
                }));
            });

            const pdfBlob = response.data;

            // Extract filename from headers
            let filename = `Quotation_${id}.pdf`;
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }

            // Update filename in progress and complete
            setDownloadProgress(prev => ({
                ...prev,
                fileName: filename,
                progress: 100,
                loaded: prev.total, // Ensure UI shows full
            }));

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            // Close after a short delay
            setTimeout(() => {
                setDownloadProgress(prev => ({ ...prev, isOpen: false }));
                setMessageBox({
                    isOpen: true,
                    type: 'success',
                    title: 'Download Success',
                    message: 'Your PDF has been downloaded successfully!',
                    onOk: closeMessageBox,
                    hideCancel: true
                });
            }, 500);

        } catch (error) {
            console.error('Error in downloading PDF:', error);
            setDownloadProgress(prev => ({ ...prev, isOpen: false }));
            setMessageBox({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to generate PDF.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const getStatusColor = (status) => {
        const statusItem = Constants.QUOTATION_STATUS_ARRAY.find(item => item.value === status);
        return statusItem ? statusItem.color : 'bg-slate-100 text-slate-600';
    };

    const isExpired = (validTo) => {
        return new Date(validTo) < new Date();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Client-side filtering removed in favor of backend pagination
    const filteredQuotations = quotations;

    const stats = {
        total: quotations.length,
        draft: quotations.filter(q => q.status === Constants.QUOTATION_STATUS.DRAFT).length,
        sent: quotations.filter(q => q.status === Constants.QUOTATION_STATUS.SENT).length,
        accepted: quotations.filter(q => q.status === Constants.QUOTATION_STATUS.ACCEPTED).length,
        rejected: quotations.filter(q => q.status === Constants.QUOTATION_STATUS.REJECTED).length,
        expired: quotations.filter(q => isExpired(q.validTo) && q.status !== Constants.QUOTATION_STATUS.ACCEPTED).length
    };

    if (loading) {
        return (
            <div className="bg-[#f8fafb] min-h-screen p-4 md:p-6 space-y-6 animate-pulse">
                {/* Stats Shimmer */}
                <div className="flex overflow-x-auto gap-4 mb-3 md:grid md:grid-cols-5 hide-scrollbar pb-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="min-w-[160px] h-24 bg-white rounded-lg border border-slate-200 shrink-0 md:min-w-0 md:w-auto p-4 flex flex-col justify-between">
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
                    {[...Array(5)].map((_, i) => (
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
        <div className='bg-[#f8fafb] min-h-screen'>
            {/* Stats Cards */}

            <div className="flex overflow-x-auto gap-4 mb-3 md:grid md:grid-cols-5 hide-scrollbar pb-2">
                {[
                    { label: 'Total', count: stats.total, icon: <Users />, color: 'bg-blue-500' },
                    { label: 'Sent', count: stats.sent, icon: <Send />, color: 'bg-blue-300' },
                    { label: 'Accepted', count: stats.accepted, icon: <CheckCircleIcon />, color: 'bg-green-300' },
                    { label: 'Rejected', count: stats.rejected, icon: <XCircleIcon />, color: 'bg-red-300' },
                    { label: 'Expired', count: stats.expired, icon: <FileWarning />, color: 'bg-red-300' }
                ].map((stat, index) => (
                    <div key={index} className="min-w-[160px] shrink-0 md:min-w-0 md:w-auto">
                        <StatsCard
                            key={index}
                            title={stat.label}
                            count={stat.count}
                            icon={stat.icon}
                            color={stat.color}
                        />
                    </div>
                ))}
            </div>

            <div className='mb-3 flex gap-2 overflow-scroll hide-scrollbar'>
                {[
                    Constants.QUOTATION_FILTER.ALL,
                    Constants.QUOTATION_FILTER.SENT,
                    Constants.QUOTATION_FILTER.ACCEPTED,
                    Constants.QUOTATION_FILTER.REJECTED,
                    Constants.QUOTATION_FILTER.EXPIRED
                ].map((status, index) => (
                    <button
                        key={index}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all border ${filter === status ? 'bg-[#e11d48] text-white border-[#e11d48]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                            placeholder="Search quotations by client name, project, or number..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard/quotations/new')}
                    className="hidden md:flex px-4 py-2 bg-rose-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors items-center gap-2"
                >
                    <Plus size={20} />
                    New Quotation
                </button>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={() => navigate('/dashboard/quotations/new')}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center z-[90] transition-transform active:scale-95"
            >
                <Plus size={28} />
            </button>



            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 mb-20 mt-6 relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg">
                        <Loader2 className="animate-spin text-rose-600" size={30} />
                    </div>
                )}
                {filteredQuotations.map((quotation) => (
                    <div key={quotation.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <FileText size={20} className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{quotation.quotationNumber}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{quotation.projectName}</p>
                                    <div className="mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(quotation.status)}`}>
                                            {quotation.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setActionPosition({
                                        top: rect.bottom,
                                        left: rect.right - 192
                                    });
                                    setOpenActionId(openActionId === quotation.id ? null : quotation.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${openActionId === quotation.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-3 ml-1">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-800">{quotation.client?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-slate-400 shrink-0" />
                                <span className="font-semibold text-green-600">{formatCurrency(quotation.totalCost)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className={isExpired(quotation.validTo) ? 'text-red-500' : 'text-slate-400'} />
                                <span className={`text-xs ${isExpired(quotation.validTo) ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                                    Valid until: {formatDate(quotation.validTo)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredQuotations.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <FileText size={24} />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No quotations found</p>
                    </div>
                )}
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden mt-6 relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-rose-600" size={30} />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#f8fafc]/50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">Sr No</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Quotation No</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Project</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Total Cost</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Validity</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Project Coordinator</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredQuotations.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-lg font-semibold">No quotations found</p>
                                        <p className="text-sm mt-1">Create your first quotation to get started</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredQuotations.map((quotation, index) => (
                                    <tr key={quotation.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">
                                                    {quotation.quotationNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-bold text-slate-700">{quotation.client?.name}</p>
                                                {quotation.client?.phone && (
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                        <Phone size={10} className="text-slate-400" />
                                                        {quotation.client.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-semibold text-slate-700">{quotation.projectName}</p>
                                                {quotation.area && (
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                        <Construction size={10} className="text-slate-400" />
                                                        {quotation.area} Sq.Ft
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-bold text-emerald-600">{formatCurrency(quotation.totalCost)}</p>
                                                {quotation.discount > 0 && (
                                                    <p className="text-[10px] text-slate-400 line-through decoration-slate-300">
                                                        Disc: {formatCurrency(quotation.discount)}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                                    <span>{formatDate(quotation.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                                    <span className={isExpired(quotation.validTo) ? 'text-red-500 font-bold' : ''}>{formatDate(quotation.validTo)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-semibold text-slate-700">{quotation.salesPersonName}</span>
                                                    <span className="text-[10px] text-slate-400">{quotation.salesPersonMobile}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(quotation.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-60`}></span>
                                                {quotation.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setActionPosition({
                                                            top: rect.bottom,
                                                            left: rect.right - 192
                                                        });
                                                        setOpenActionId(openActionId === quotation.id ? null : quotation.id);
                                                    }}
                                                    className={`p-1.5 rounded-lg transition-colors ${openActionId === quotation.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
                                    const quotation = quotations.find(q => q.id === openActionId);
                                    if (!quotation) return null;
                                    return (
                                        <>
                                            <button
                                                onClick={() => {
                                                    navigate(`/dashboard/quotations/view/${quotation.id}`);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                                            >
                                                <Eye size={16} className="mr-3" />
                                                View Quotation
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // window.print();
                                                    handlePrint(quotation.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <Printer size={16} className="mr-3" />
                                                Print
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate(`/dashboard/quotations/edit/${quotation.id}`);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                                            >
                                                <Edit2 size={16} className="mr-3" />
                                                Edit Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    duplicateQuotation(quotation.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                                            >
                                                <Copy size={16} className="mr-3" />
                                                Duplicate
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openStatusModal(quotation);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-purple-600 transition-colors"
                                            >
                                                <div className="w-4 h-4 mr-3 rounded-full border-2 border-current flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                                </div>
                                                Update Status
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deleteQuotation(quotation.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete
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



            {/* Status Update Modal */}
            {statusModal.isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeStatusModal}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Update Status</h3>
                            <div className="space-y-3">
                                {Constants.QUOTATION_STATUS_ARRAY.map((statusItem) => (
                                    <button
                                        key={statusItem.value}
                                        onClick={() => handleStatusUpdate(statusItem.value)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${statusModal.currentStatus === statusItem.value
                                            ? 'border-red-600 bg-red-50 text-red-700'
                                            : 'border-slate-100 hover:border-red-200 hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        <span className="font-semibold">{statusItem.label}</span>
                                        {statusModal.currentStatus === statusItem.value && (
                                            <div className="w-4 h-4 rounded-full bg-red-600"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={closeStatusModal}
                                className="w-full mt-6 py-3 text-slate-500 font-medium hover:text-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Supervisor Assignment Modal */}
            {supervisorModal.isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSupervisorModal({ ...supervisorModal, isOpen: false })}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={24} className="text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Assign Supervisor</h3>
                                <p className="text-sm text-slate-500 mt-1">Enter supervisor name to create the site</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Supervisor Name</label>
                                <input
                                    type="text"
                                    value={selectedSupervisor}
                                    onChange={(e) => setSelectedSupervisor(e.target.value)}
                                    placeholder="Enter Supervisor Name"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-700"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSupervisorModal({ ...supervisorModal, isOpen: false })}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignSupervisor}
                                    disabled={isAssigning || !selectedSupervisor}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isAssigning ? 'Assigning...' : 'Confirm & Accept'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
            {/* PDF Download Progress Modal */}
            {downloadProgress.isOpen && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="mb-6 flex justify-center">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Downloading PDF...</h3>
                        <p className="text-sm text-slate-500 mb-8 truncate font-medium">{downloadProgress.fileName}</p>

                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                            <span>{(downloadProgress.loaded / (1024 * 1024)).toFixed(2)} MB</span>
                            <span>{(downloadProgress.total / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-1 relative">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${downloadProgress.progress}%` }}
                            ></div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-400 font-medium mr-2">
                                {downloadProgress.speed > 0 && `(${downloadProgress.speed < 1024 * 1024
                                    ? `${(downloadProgress.speed / 1024).toFixed(0)} KB/s`
                                    : `${(downloadProgress.speed / (1024 * 1024)).toFixed(1)} MB/s`})`}
                            </span>
                            <span className="text-sm font-bold text-blue-600">{downloadProgress.progress}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quotations;
