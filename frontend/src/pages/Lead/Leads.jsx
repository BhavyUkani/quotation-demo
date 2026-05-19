import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Trash2,
    Edit2,
    Phone,
    Mail,
    CheckCircle,
    Clock,
    History,
    User,
    Globe,
    Eye,
    Building2,
    Users,
    TrendingUp,
    Handshake,
    Sun,
    X,
    MessageCircle,
    Copy,
    ChevronDown,
    MapPin,
    ExternalLink,
    Filter,
    ArrowDownRight,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import * as leadService from '../../api/leadService';
import { useAuth } from '../../contexts/AuthContext';
import MessageBox from '../../components/common/MessageBox';
import Avatar from '../../components/common/Avatar';
import StatusCard from '../../components/common/StatsCard';

const Leads = () => {
    const { user } = useAuth();
    const currentUser = user?.user || user;
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Kept for initial load logic primarily
    const [isTableLoading, setIsTableLoading] = useState(false); // To show loading state on table w/o full page skeleton
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalLeads, setTotalLeads] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        propertyType: 'Residential',
        totalArea: '',
        remarks: '',
        status: 'New',
        source: '',
        assignedToEmployeeId: ''
    });

    // Activity Tracking State
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const [trackLead, setTrackLead] = useState(null);
    const [trackForm, setTrackForm] = useState({ status: '', remarks: '' });

    const [employees, setEmployees] = useState([]);

    // MessageBox States
    const [convertConfirmOpen, setConvertConfirmOpen] = useState(false);
    const [leadToConvert, setLeadToConvert] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [alertState, setAlertState] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

    const fetchLeadsData = async () => {
        try {
            // Only set full page loading if it's the very first load and we have no data
            // Otherwise, we just want to show table loading
            if (leads.length === 0 && isLoading) {
                // Initial load is already handled by state initialization, 
                // but if we were re-fetching, we might want to ensure isLoading matches intent.
            } else {
                setIsTableLoading(true);
            }

            const data = await leadService.fetchLeads(currentPage, itemsPerPage, searchTerm, statusFilter);
            setLeads(data.leads || []);
            setTotalPages(data.totalPages || 0);
            setTotalLeads(data.total || 0);
        } catch (err) {
            console.error('Error fetching leads:', err);
        } finally {
            setIsLoading(false);
            setIsTableLoading(false);
        }
    };

    const fetchEmployeesData = async () => {
        try {
            const data = await leadService.fetchEmployees();
            setEmployees(data || []);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    useEffect(() => {
        fetchLeadsData();
    }, [currentPage, itemsPerPage, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchLeadsData();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchEmployeesData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const copyPhoneToWhatsapp = () => {
        setFormData(prev => ({ ...prev, whatsapp: prev.phone }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Hide sidebar immediately for better UX
        setIsSidebarOpen(false);

        // Show loading dialog
        setAlertState({
            isOpen: true,
            type: 'loading',
            title: editingLead ? 'Updating Lead' : 'Creating Lead',
            message: 'Please wait while we process your request...'
        });

        try {
            let result;
            const isEdit = !!editingLead; // Capture boolean before async op

            if (editingLead) {
                result = await leadService.updateLead(editingLead.id, formData);
                setLeads(prev => prev.map(l => l.id === result.id ? result : l));
            } else {
                result = await leadService.createLead(formData);
                setLeads(prev => [result, ...prev]);
            }

            setEditingLead(null);

            setAlertState({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: isEdit ? 'Lead updated successfully.' : 'New lead created successfully.',
                onOk: closeAlert
            });
        } catch (err) {
            console.error('Error saving lead:', err);
            // Re-open sidebar on error so user doesn't lose data
            setIsSidebarOpen(true);
            setAlertState({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save lead.',
                onOk: closeAlert
            });
        }
    };

    const handleTrackSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        try {
            // Use the returned updated lead directly for instant feedback
            const updatedLead = await leadService.updateLead(trackLead.id, {
                status: trackForm.status,
                remarks: trackForm.remarks
            });

            // Update both the main list and the drawer state
            setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
            setTrackLead(updatedLead);

            setTrackForm(prev => ({ ...prev, remarks: '' }));
            setAlertState({ isOpen: true, type: 'success', title: 'Updated', message: 'Activity logged.' });
        } catch (err) {
            console.error('Track submit error:', err);
            setAlertState({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to update.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmConvert = async () => {
        setIsSubmitting(true);
        try {
            await leadService.convertLeadToClient(leadToConvert);
            setConvertConfirmOpen(false);
            await fetchLeadsData();
            setAlertState({ isOpen: true, type: 'success', title: 'Success', message: 'Converted to client.' });
        } catch (err) {
            setConvertConfirmOpen(false);
            setAlertState({ isOpen: true, type: 'error', title: 'Error', message: 'Conversion failed.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!leadToDelete) return;
        setIsDeleting(true);
        try {
            await leadService.deleteLead(leadToDelete);
            setLeads(prev => prev.filter(l => l.id !== leadToDelete));
            setDeleteConfirmOpen(false);
            setLeadToDelete(null);
            setAlertState({ isOpen: true, type: 'success', title: 'Deleted', message: 'Lead removed.' });
        } catch (err) {
            setDeleteConfirmOpen(false);
            setAlertState({ isOpen: true, type: 'error', title: 'Error', message: 'Delete failed.' });
        } finally {
            setIsDeleting(false);
        }
    };

    const openEditSidebar = (lead) => {
        setEditingLead(lead);
        setFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone || '',
            whatsapp: lead.whatsapp || '',
            address: lead.address || '',
            propertyType: lead.propertyType || 'Residential',
            totalArea: lead.totalArea || '',
            remarks: lead.remarks || '',
            status: lead.status,
            source: lead.source || '',
            assignedToEmployeeId: lead.assignedToEmployeeId || ''
        });
        setIsSidebarOpen(true);
        setViewOnly(false);
    };

    const openViewSidebar = (lead) => {
        openEditSidebar(lead);
        setViewOnly(true);
    };

    const openAddSidebar = () => {
        setEditingLead(null);
        setFormData({
            name: '', email: '', phone: '', whatsapp: '', address: '',
            propertyType: 'Residential', totalArea: '', remarks: '',
            status: 'New', source: '',
            assignedToEmployeeId: ''
        });
        setIsSidebarOpen(true);
        setViewOnly(false);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setEditingLead(null);
    };

    const stats = useMemo(() => ({
        total: totalLeads,
        new: 0, // Cannot calculate efficiently on client side now
        closed: 0,
        converted: 0,
        lost: 0,
    }), [totalLeads]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const sortedTrackHistory = useMemo(() => {
        if (!trackLead?.statusHistory) return [];
        return [...trackLead.statusHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [trackLead]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'New': return 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]';
            case 'Contacted': return 'bg-[#fffbeb] text-[#d97706] border-[#fef3c7]';
            case 'Qualified': return 'bg-[#f5f3ff] text-[#7c3aed] border-[#ede9fe]';
            case 'Proposal': return 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]';
            case 'Closed': return 'bg-[#ecfdf5] text-[#059669] border-[#d1fae5]';
            case 'Converted': return 'bg-[#f0fdfa] text-[#0d9488] border-[#ccfbf1]';
            default: return 'bg-[#f8fafc] text-[#64748b] border-[#f1f5f9]';
        }
    };

    if (isLoading) {
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
                    {[...Array(6)].map((_, i) => (
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
            <div className="flex overflow-x-auto gap-4 mb-3 md:grid md:grid-cols-5 hide-scrollbar pb-2">
                {[
                    { label: 'Total', count: stats.total, icon: <Users />, color: 'bg-[#3b82f6]' },
                    { label: 'New', count: stats.new, icon: <TrendingUp />, color: 'bg-[#ef4444]' },
                    { label: 'Closed', count: stats.closed, icon: <Handshake />, color: 'bg-[#10b981]' },
                    { label: 'Converted', count: stats.converted, icon: <Sun />, color: 'bg-[#06b6d4]' },
                    { label: 'Lost', count: stats.lost, icon: <Users />, color: 'bg-[#f43f5e]' },
                ].map((item, idx) => (
                    <div key={idx} className="min-w-[160px] shrink-0 md:min-w-0 md:w-auto">
                        <StatusCard
                            title={item.label}
                            count={item.count}
                            icon={item.icon}
                            color={item.color}
                        />
                    </div>
                ))}
            </div>

            <div className="mb-3 flex gap-2 overflow-scroll hide-scrollbar">
                {['all', 'new', 'contacted', 'qualified', 'proposal', 'converted'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all border ${statusFilter === s ? 'bg-[#e11d48] text-white border-[#e11d48]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                        {s === 'all' ? `All (${stats.total})` : s.charAt(0).toUpperCase() + s.slice(1) + ` (${stats[s] || 0})`}
                    </button>
                ))}
            </div>

            {/* Search & Action Bar */}
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients by name, email, or company..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium text-slate-700 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={openAddSidebar}
                    className="hidden md:flex px-4 py-2 bg-rose-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors items-center gap-2"
                >
                    <Plus size={20} />
                    New Lead
                </button>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={openAddSidebar}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg shadow-rose-500/30 flex items-center justify-center z-[90] transition-transform active:scale-95"
            >
                <Plus size={28} />
            </button>



            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 mb-20 mt-6">
                {leads.map((lead) => (
                    <div key={lead.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">


                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-start gap-3">
                                <Avatar name={lead.name} className="w-10 h-10 rounded-full font-semibold text-sm" />
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{lead.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium">
                                        <Clock size={12} />
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(lead.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                            {lead.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setActionPosition({ top: rect.bottom, left: rect.right - 200 });
                                    setOpenActionId(openActionId === lead.id ? null : lead.id);
                                }}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-[13px] text-slate-600 mb-3 ml-1">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400 shrink-0" />
                                <span className="truncate">{lead.email}</span>
                            </div>
                            {lead.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-slate-400 shrink-0" />
                                    <span>{lead.phone}</span>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <Building2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                <span>{lead.propertyType} • {lead.totalArea} sqft</span>
                            </div>
                            {lead.address && (
                                <div className="flex items-start gap-2">
                                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{lead.address}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Assigned To</span>
                                <span className="text-[12px] font-bold text-slate-700">{lead.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                            {lead.source && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                    <Globe size={11} className="text-slate-400" />
                                    {lead.source}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Mobile Pagination */}
                {totalLeads > itemsPerPage && (
                    <div className="flex items-center justify-between pt-4 pb-8">
                        <button
                            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 shadow-sm"
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <span className="text-xs font-bold text-slate-500">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 disabled:opacity-50 shadow-sm"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Table Container - Hidden on Mobile */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden mt-6 shadow-sm relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-rose-600" size={30} />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]/80 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">SrNo</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lead</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Address</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Property</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Assigned</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Added By</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Remarks</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map((lead, index) => (
                                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={lead.name} className="w-8 h-8 rounded-full font-semibold text-xs shrink-0 shadow-sm" />
                                            <div>
                                                <p className="font-semibold text-[#1e293b] text-[13px]">{lead.name}</p>
                                                {lead.phone && (
                                                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 font-medium">
                                                        <Phone size={10} className="text-slate-400" />
                                                        {lead.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                                                <Mail size={11} className="text-slate-400 shrink-0" />
                                                <span className="truncate max-w-[200px]" title={lead.email}>{lead.email}</span>
                                            </div>
                                            {lead.whatsapp && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                                                    <MessageCircle size={11} className="text-green-500 shrink-0" />
                                                    {lead.whatsapp}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {lead.address ? (
                                            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 font-medium leading-relaxed max-w-[150px]">
                                                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                                <span className="line-clamp-2" title={lead.address}>{lead.address}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 italic">No address</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-bold text-slate-700">
                                                {lead.propertyType}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                {lead.totalArea || '0'} Sq Ft
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-[11px] text-slate-600 font-medium">
                                            {lead.assignedTo?.name || <span className="text-slate-300 italic">Unassigned</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-[11px] text-slate-600 font-medium">
                                            {lead.addedBy?.name || '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {lead.remarks ? (
                                            <div className="max-w-[150px] text-[11px] text-slate-500 leading-snug line-clamp-2" title={lead.remarks}>
                                                {lead.remarks}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setActionPosition({ top: rect.bottom, left: rect.right - 200 });
                                                setOpenActionId(openActionId === lead.id ? null : lead.id);
                                            }}
                                            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-white rounded-b-lg">
                    <div className="text-sm text-slate-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalLeads)} of {totalLeads} results
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

            {isSidebarOpen && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[1000] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={closeSidebar}></div>
                    <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">
                        {/* Drawer Header */}
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="text-rose-600 bg-rose-50 p-2 rounded-lg"><Plus size={20} strokeWidth={3} /></div>
                                <div>
                                    <h2 className="text-md font-bold text-slate-800">{editingLead ? (viewOnly ? 'View Lead' : 'Edit Lead') : 'New Lead'}</h2>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Fill details below</p>
                                </div>
                            </div>
                            <button onClick={closeSidebar} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1 rounded-full transition-colors">
                                <ArrowDownRight size={20} className="transform -rotate-90" />
                            </button>
                        </div>

                        {/* Drawer Body - Form */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                        <input name="name" value={formData.name} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400" placeholder="e.g. John Doe" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</label>
                                        <div className="relative">
                                            <select name="status" value={formData.status} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm font-medium text-slate-700 cursor-pointer">
                                                {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed', 'Lost', 'Converted'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input name="email" value={formData.email} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="john@example.com" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input name="phone" value={formData.phone} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="+1 234 567 890" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp</label>
                                            {!viewOnly && <button onClick={copyPhoneToWhatsapp} className="text-[9px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded transition-colors"><Copy size={9} /> Copy Phone</button>}
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="Same as phone" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Source</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input name="source" value={formData.source} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="e.g. Google" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Property Type</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer">
                                                <option value="Residential">Residential</option>
                                                <option value="Commercial">Commercial</option>
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Area</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input name="totalArea" value={formData.totalArea} onChange={handleInputChange} disabled={viewOnly} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="e.g. 100 sqft" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Assign Employee</label>
                                        <div className="relative">
                                            <select name="assignedToEmployeeId" value={formData.assignedToEmployeeId} onChange={handleInputChange} disabled={viewOnly} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer">
                                                <option value="">-- Select --</option>
                                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} disabled={viewOnly} rows="2" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="Full address"></textarea>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Remarks</label>
                                    <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} disabled={viewOnly} rows="2" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-rose-500" placeholder="Additional notes"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        {!viewOnly && (
                            <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50">
                                <button onClick={closeSidebar} className="py-2.5 px-4 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-all text-xs uppercase tracking-wide">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} disabled={isSubmitting} className="py-2.5 px-4 bg-rose-600 text-white rounded-lg font-bold shadow-md hover:bg-rose-700 transition-all text-xs uppercase tracking-wide flex items-center justify-center gap-2">
                                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                                    {editingLead ? 'Update Lead' : 'Create Lead'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* Redesigned Track Lead Drawer */}
            {isTrackOpen && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[1001] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setIsTrackOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                    <History size={18} />
                                </div>
                                <div>
                                    <h2 className="text-md font-bold text-slate-800">Track Lead</h2>
                                    <p className="text-[11px] font-medium text-slate-500">{trackLead?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsTrackOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1 rounded-full transition-colors">
                                <ArrowDownRight size={20} className="transform -rotate-90" />
                            </button>
                        </div>

                        {/* Timeline Body */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Activity History</h3>
                            </div>

                            <div className="relative ml-2 border-l-[2px] border-slate-200 pl-6 space-y-6 py-1">
                                {sortedTrackHistory.map((h, i) => (
                                    <div key={h.id || i} className="relative">
                                        {/* Dot */}
                                        <div className={`absolute -left-[32.5px] top-3 w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm ${i === 0 ? 'bg-rose-500' : 'bg-slate-200'}`}></div>

                                        <div className="relative bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-sm">
                                            {/* WhatsApp style tail */}
                                            <div className="absolute top-4 -left-1.5 w-3 h-3 bg-slate-50 border-l border-b border-slate-200 rotate-45 rounded-sm"></div>

                                            <p className="text-[12px] font-medium text-slate-700 relative z-10">
                                                {h.fromStatus ? (
                                                    <span>Changed to <span className="font-bold text-rose-600">{h.toStatus}</span></span>
                                                ) : (
                                                    <span>Created: <span className="font-bold text-rose-600">{h.toStatus}</span></span>
                                                )}
                                            </p>
                                            {h.remarks && (
                                                <p className="mt-1 text-[11px] text-slate-500 italic relative z-10 leading-relaxed">"{h.remarks}"</p>
                                            )}

                                            <div className="mt-1.5 flex justify-end relative z-10">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                                                    {new Date(h.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {sortedTrackHistory.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-xs text-slate-400">No activity history found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Form */}
                        <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Add Update</h3>

                            <div className="space-y-2.5">
                                <div className="relative">
                                    <select
                                        value={trackForm.status}
                                        onChange={(e) => setTrackForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all cursor-pointer"
                                    >
                                        <option value="">Select Status</option>
                                        {['New', 'Contacted', 'Qualified', 'Proposal', 'Closed', 'Lost', 'Converted'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                </div>

                                <textarea
                                    value={trackForm.remarks}
                                    onChange={(e) => setTrackForm(prev => ({ ...prev, remarks: e.target.value }))}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all resize-none min-h-[80px]"
                                    placeholder="Add remarks..."
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={() => setIsTrackOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex-1 uppercase tracking-wide"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleTrackSubmit}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex-[2] uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                                    Save Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Action Menu Popover */}
            {openActionId && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[1002]" onClick={() => setOpenActionId(null)}>
                    <div
                        className="absolute bg-white rounded-lg shadow-2xl border border-slate-100 py-1 w-48 overflow-hidden"
                        style={{ top: actionPosition.top, left: actionPosition.left }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={() => { openViewSidebar(leads.find(l => l.id === openActionId)); setOpenActionId(null); }} className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                            <Eye size={16} /> View
                        </button>
                        <button onClick={() => { openEditSidebar(leads.find(l => l.id === openActionId)); setOpenActionId(null); }} className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                            <Edit2 size={16} /> Edit
                        </button>
                        <button onClick={() => {
                            const l = leads.find(l => l.id === openActionId);
                            setTrackLead(l);
                            setTrackForm({ status: l.status, remarks: '' });
                            setIsTrackOpen(true);
                            setOpenActionId(null);
                        }} className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3">
                            <History size={16} /> Track
                        </button>
                        <button onClick={() => { setLeadToConvert(openActionId); setConvertConfirmOpen(true); setOpenActionId(null); }} className="w-full px-4 py-2.5 text-left text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-3">
                            <CheckCircle size={16} /> Convert
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={() => { setLeadToDelete(openActionId); setDeleteConfirmOpen(true); setOpenActionId(null); }} className="w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3">
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* MessageBoxes */}
            <MessageBox isOpen={convertConfirmOpen} onCancel={() => !isSubmitting && setConvertConfirmOpen(false)} onOk={confirmConvert} isLoading={isSubmitting} type="success" title="Convert Lead" message="Are you sure you want to convert this lead to a client?" />
            <MessageBox isOpen={deleteConfirmOpen} onCancel={() => !isDeleting && setDeleteConfirmOpen(false)} onOk={confirmDelete} isLoading={isDeleting} type="danger" title="Delete Lead" message="Are you sure? This action is permanent." />
            <MessageBox isOpen={alertState.isOpen} onCancel={closeAlert} onOk={closeAlert} type={alertState.type} title={alertState.title} message={alertState.message} hideCancel okButtonName="Okay" />
        </div>
    );
};

export default Leads;
