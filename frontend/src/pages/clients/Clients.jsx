import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Trash2,
    Edit2,
    ArrowDownRight,
    StickyNote,
    CheckCircle,
    Circle,
    Copy,
    Users,
    Filter,
    X,
    Phone,
    Mail,
    Building2,
    MessageSquare,
    Briefcase,
    User,
    MapPin,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';
import * as clientService from '../../api/clientService';
import MessageBox from '../../components/common/MessageBox';
import Avatar from '../../components/common/Avatar';
import StatusCard from '../../components/common/StatsCard';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [noteClient, setNoteClient] = useState(null);
    const [noteForm, setNoteForm] = useState({ note: '' });
    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [alertState, setAlertState] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });
    const [deleteClientConfirmOpen, setDeleteClientConfirmOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [deleteNoteConfirmOpen, setDeleteNoteConfirmOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);

    const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        company: '',
        address: '',
        propertyType: 'Residential',
        totalArea: '',
        remarks: '',
        status: 'Active'
    });

    // Property Types
    const propertyTypes = ['Residential', 'Commercial'];

    const fetchClientsData = async () => {
        try {
            if (clients.length === 0 && isLoading) {
                // Initial load
            } else {
                setIsTableLoading(true);
            }
            const data = await clientService.fetchClients();
            setClients(data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setIsLoading(false);
            setIsTableLoading(false);
        }
    };

    useEffect(() => {
        fetchClientsData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await clientService.updateClient(editingClient.id, formData);
            } else {
                await clientService.createClient(formData);
            }
            fetchClientsData();
            closeSidebar();
            setAlertState({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: editingClient ? 'Client updated successfully.' : 'New client created successfully.'
            });
        } catch (err) {
            console.error('Error saving client:', err);
            setAlertState({
                isOpen: true,
                type: 'error',
                title: 'Operation Failed',
                message: 'Failed to save client details. Please try again.'
            });
        }
    };

    const deleteClientHandler = (id) => {
        setClientToDelete(id);
        setDeleteClientConfirmOpen(true);
    };

    const confirmDeleteClient = async () => {
        if (!clientToDelete) return;
        try {
            await clientService.deleteClient(clientToDelete);
            setClients(clients.filter(c => c.id !== clientToDelete));
            setDeleteClientConfirmOpen(false);
            setClientToDelete(null);

            setAlertState({
                isOpen: true,
                type: 'success',
                title: 'Client Deleted',
                message: 'The client has been successfully removed.'
            });
        } catch (err) {
            console.error('Error deleting client:', err);
            setDeleteClientConfirmOpen(false);
            setAlertState({
                isOpen: true,
                type: 'error',
                title: 'Deletion Failed',
                message: 'Failed to delete client. Please try again.'
            });
        }
    };

    const openEditSidebar = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            whatsapp: client.whatsapp || '',
            company: client.company || '',
            address: client.address || '',
            propertyType: client.propertyType || 'Residential',
            totalArea: client.totalArea || '',
            remarks: client.remarks || '',

            status: client.status
        });
        setIsSidebarOpen(true);
    };

    const openAddSidebar = () => {
        setEditingClient(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            whatsapp: '',
            company: '',
            address: '',
            propertyType: 'Residential',
            totalArea: '',
            remarks: '',

            status: 'Active'
        });
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setEditingClient(null);
    };

    const openNotesModal = (client) => {
        setNoteClient(client);
        setNoteForm({ note: '' });
        setIsNotesOpen(true);
    };

    const closeNotesModal = () => {
        setIsNotesOpen(false);
        setNoteClient(null);
        setNoteForm({ note: '' });
    };

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            await clientService.addNote(noteClient.id, noteForm.note);
            await fetchClientsData();
            setNoteForm({ note: '' });
        } catch (err) {
            console.error('Error adding note:', err);
            setAlertState({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to add note.'
            });
        }
    };



    const deleteNoteHandler = (noteId) => {
        setNoteToDelete(noteId);
        setDeleteNoteConfirmOpen(true);
    };

    const confirmDeleteNote = async () => {
        if (!noteToDelete) return;
        try {
            await clientService.deleteNote(noteToDelete);
            await fetchClientsData();
            setDeleteNoteConfirmOpen(false);
            setNoteToDelete(null);
        } catch (err) {
            console.error('Error deleting note:', err);
            setDeleteNoteConfirmOpen(false);
            setAlertState({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to delete note.'
            });
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate stats
    const stats = {
        total: clients.length,
        active: clients.filter(c => c.status === 'Active').length,
        inactive: clients.filter(c => c.status === 'Inactive').length,
        residential: clients.filter(c => c.propertyType === 'Residential').length,
        commercial: clients.filter(c => c.propertyType === 'Commercial').length
    };

    const [statusFilter, setStatusFilter] = useState('all');

    const filteredByStatus = statusFilter === 'all'
        ? filteredClients
        : filteredClients.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());

    // Pagination Logic
    const totalItems = filteredByStatus.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedClients = filteredByStatus.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



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
        <div className='bg-[#f8fafb] min-h-screen'>
            <div className="flex overflow-x-auto gap-4 mb-3 md:grid md:grid-cols-5 hide-scrollbar pb-2">
                {[
                    { label: 'Total', count: stats.total, icon: <Users />, color: 'bg-[#3b82f6]' },
                    { label: 'Active', count: stats.active, icon: <CheckCircle />, color: 'bg-[#4ade80]' },
                    { label: 'Inactive', count: stats.inactive, icon: <Circle />, color: 'bg-[#ef4444]' },
                    { label: 'Residential', count: stats.residential, icon: <Users />, color: 'bg-[#3b82f6]' },
                    { label: 'Commercial', count: stats.commercial, icon: <Users />, color: 'bg-[#3b82f6]' }
                ].map((item, index) => (
                    <div key={index} className="min-w-[160px] shrink-0 md:min-w-0 md:w-auto">
                        <StatusCard
                            title={item.label}
                            count={item.count}
                            icon={item.icon}
                            color={item.color}
                        />
                    </div>
                ))}
            </div>


            <div className="mb-3 flex flex-wrap gap-2">
                {[
                    'all', 'active', 'inactive'
                ].map((status, index) => (
                    <button
                        key={index}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all border ${statusFilter === status ? 'bg-[#e11d48] text-white border-[#e11d48]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
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
                    New Client
                </button>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={openAddSidebar}
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
                {filteredByStatus.map((client) => (
                    <div key={client.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-start gap-3">
                                <Avatar name={client.name} />
                                <div>
                                    <h3 className="font-bold text-slate-800 leading-tight">{client.company || client.name}</h3>
                                    {client.company && <p className="text-xs text-slate-500">{client.name}</p>}
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${client.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                            {client.status}
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
                                    setOpenActionId(openActionId === client.id ? null : client.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${openActionId === client.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-3 ml-1">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400 shrink-0" />
                                <span className="truncate">{client.email}</span>
                            </div>
                            {client.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-slate-400 shrink-0" />
                                    <span>{client.phone}</span>
                                </div>
                            )}
                            {client.address && (
                                <div className="flex items-start gap-2">
                                    <Building2 size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                    <span className="truncate max-w-[250px]">{client.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {filteredByStatus.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Search size={24} />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No clients found</p>
                    </div>
                )}
            </div>

            {/* Clients Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden mt-6 relative">
                {isTableLoading && (
                    <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-rose-600" size={30} />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8fafc]/50 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-12">SrNo</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Address</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Property Type</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Remarks</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedClients.map((client, index) => (
                                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                                        {((currentPage - 1) * itemsPerPage) + index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={client.name} className="w-8 h-8 rounded-full font-semibold text-xs shrink-0" />
                                            <div>
                                                <p className="font-semibold text-[#1e293b] text-[13px]">{client.name}</p>
                                                {client.company && <p className="text-[11px] text-slate-500 font-medium">{client.company}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                                                <Mail size={11} className="text-slate-400 shrink-0" />
                                                <span className="truncate max-w-[150px]" title={client.email}>{client.email}</span>
                                            </div>
                                            {client.phone && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                                                    <Phone size={11} className="text-slate-400 shrink-0" />
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {client.address ? (
                                            <div className="flex items-start gap-1.5 text-[11px] text-slate-500 font-medium leading-relaxed max-w-[150px]">
                                                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                                <span className="line-clamp-2" title={client.address}>{client.address}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 italic">No address</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-1">
                                            <div className="text-[11px] font-bold text-slate-700">
                                                {client.propertyType || '-'}
                                            </div>
                                            {client.totalArea && (
                                                <div className="text-[10px] text-slate-500">
                                                    {client.totalArea}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-slate-300">-</span>
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
                                                    setOpenActionId(openActionId === client.id ? null : client.id);
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors ${openActionId === client.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedClients.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <Search size={24} />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No clients found</p>
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

            {/* Modal Overlay - Rendered via Portal */}
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
                            {/* Header - Compact */}
                            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                        <Briefcase size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-md font-bold text-slate-800">{editingClient ? 'Edit Client' : 'New Client'}</h2>
                                        <p className="text-[11px] font-medium text-slate-500">Client Details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeSidebar}
                                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                                >
                                    <ArrowDownRight size={20} className="transform -rotate-90" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Company & Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Company Name</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="Company Name (Optional)"
                                                    value={formData.company}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Contact Name <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="e.g. Jane Doe"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="contact@example.com"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center">
                                                    WhatsApp
                                                </label>
                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, whatsapp: prev.phone }))} className="text-[9px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 bg-rose-50 px-1.5 py-0.5 rounded transition-colors uppercase"><Copy size={9} /> Copy Phone</button>
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <input
                                                    type="tel"
                                                    name="whatsapp"
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={formData.whatsapp}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2 text-slate-400" size={15} />
                                            <textarea
                                                name="address"
                                                rows="2"
                                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                placeholder="Full business address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Property & Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Property Type</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <select
                                                    name="propertyType"
                                                    className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer text-sm font-medium text-slate-700 appearance-none"
                                                    value={formData.propertyType}
                                                    onChange={handleInputChange}
                                                >
                                                    {propertyTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Area</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                                <input
                                                    type="text"
                                                    name="totalArea"
                                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                                    placeholder="e.g. 1500 sq ft"
                                                    value={formData.totalArea}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</label>
                                            <div className="relative">
                                                <select
                                                    name="status"
                                                    className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all cursor-pointer text-sm font-medium text-slate-700 appearance-none"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remarks */}
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Remarks</label>
                                        <textarea
                                            name="remarks"
                                            rows="2"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                                            placeholder="Notes..."
                                            value={formData.remarks}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="pt-4 flex gap-3 border-t border-slate-100 mt-4 p-4 -mx-5 -mb-5 sticky bottom-0">
                                        <button
                                            type="button"
                                            onClick={closeSidebar}
                                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold transition-all text-xs uppercase tracking-wide"

                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 bg-rose-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors items-center gap-2"
                                        >
                                            {editingClient ? 'Save Changes' : 'Create Client'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
            {isNotesOpen && ReactDOM.createPortal(
                <div className="fixed inset-0 z-[10000] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeNotesModal}></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-rose-50 p-2.5 rounded-lg text-rose-600">
                                    <StickyNote size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">{noteClient?.company || noteClient?.name}</h2>
                                    <p className="text-xs text-slate-500 font-medium">Notes & Interaction History</p>
                                </div>
                            </div>
                            <button onClick={closeNotesModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f8fafc] custom-scrollbar">
                            {(() => {
                                const activeClient = clients.find(c => c.id === noteClient?.id) || noteClient;
                                const notes = activeClient?.notes || [];

                                if (notes.length === 0) {
                                    return (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                            <MessageSquare size={48} strokeWidth={1.5} className="mb-4 text-slate-300" />
                                            <p className="text-sm font-medium">No notes yet</p>
                                            <p className="text-xs">Start the conversation below</p>
                                        </div>
                                    );
                                }

                                return [...notes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((note) => (
                                    <div key={note.id} className="group flex flex-col items-start pl-2">
                                        <div className="relative overflow-hidden max-w-[90%] bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 text-sm text-slate-700 leading-relaxed hover:shadow-md transition-shadow">
                                            {/* Delete Action */}
                                            <button
                                                onClick={() => deleteNoteHandler(note.id)}
                                                className="absolute right-2 top-2 p-1 text-slate-300 hover:text-rose-500 rounded-full transition-colors z-10 bg-white/80"
                                                title="Delete Note"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <p className="whitespace-pre-wrap break-words">{note.note}</p>

                                            <div className="mt-1.5 flex items-center justify-end gap-2 select-none">
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                                    {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                            <form onSubmit={handleNoteSubmit} className="flex gap-2 items-end">
                                <div className="relative flex-1">
                                    <textarea
                                        className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none text-sm font-medium text-slate-700 placeholder:text-slate-400 custom-scrollbar"
                                        rows="1"
                                        style={{ minHeight: '46px', maxHeight: '120px' }}
                                        placeholder="Type a note..."
                                        value={noteForm.note}
                                        onChange={(e) => {
                                            setNoteForm({ note: e.target.value });
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleNoteSubmit(e);
                                                // Reset height
                                                setTimeout(() => {
                                                    const textarea = document.querySelector('textarea[placeholder="Type a note..."]');
                                                    if (textarea) textarea.style.height = 'auto';
                                                }, 0);
                                            }
                                        }}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!noteForm.note.trim()}
                                    className="p-3 mb-[1px] bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center shrink-0"
                                >
                                    <ArrowDownRight size={20} className="transform -rotate-90" />
                                </button>
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
                                    const client = clients.find(c => c.id === openActionId);
                                    if (!client) return null;
                                    return (
                                        <>
                                            <button
                                                onClick={() => {
                                                    openNotesModal(client);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                                            >
                                                <StickyNote size={16} className="mr-3" />
                                                Notes
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openEditSidebar(client);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                                            >
                                                <Edit2 size={16} className="mr-3" />
                                                Edit Details
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deleteClientHandler(client.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete Client
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
            {/* Delete Client Confirmation */}
            <MessageBox
                isOpen={deleteClientConfirmOpen}
                type="warning"
                title="Delete Client"
                message="Are you sure you want to delete this client? This will remove all associated notes and history."
                onOk={confirmDeleteClient}
                onCancel={() => {
                    setDeleteClientConfirmOpen(false);
                    setClientToDelete(null);
                }}
                okButtonName="Delete Client"
                cancelButtonName="Keep Client"
            />

            {/* Delete Note Confirmation */}
            <MessageBox
                isOpen={deleteNoteConfirmOpen}
                type="warning"
                title="Delete Note"
                message="Are you sure you want to delete this note?"
                onOk={confirmDeleteNote}
                onCancel={() => {
                    setDeleteNoteConfirmOpen(false);
                    setNoteToDelete(null);
                }}
                okButtonName="Delete"
                cancelButtonName="Cancel"
            />

            {/* Generic Alerts */}
            <MessageBox
                isOpen={alertState.isOpen}
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
                onOk={closeAlert}
                onCancel={closeAlert}
                okButtonName="OK"
                hideCancel={true}
            />
        </div>
    );
};

export default Clients;
