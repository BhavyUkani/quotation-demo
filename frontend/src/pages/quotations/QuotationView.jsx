import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    Edit2,
    Plus,
    Trash2,
    X,
    ArrowUp,
    ArrowDown,
    User,
    Building,
    Calendar,
    IndianRupee,
    Check
} from 'lucide-react';
import api from '../../api/axios';
import * as quotationSpaceService from '../../api/quotationSpaceService';
import MessageBox from '../../components/common/MessageBox';

const QuotationView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [quotation, setQuotation] = useState(null);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState('');

    // Notes state
    const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
    const [notes, setNotes] = useState([]);
    const [editingNoteIndex, setEditingNoteIndex] = useState(null);
    const [editingNoteText, setEditingNoteText] = useState('');

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

    useEffect(() => {
        if (quotation) {
            setNotes(quotation.notes || []);
        }
    }, [quotation]);

    // Note Handlers
    const handleAddNote = () => {
        const newNotes = [...notes, ''];
        setNotes(newNotes);
        setEditingNoteIndex(newNotes.length - 1); // Start editing the new empty note
        setEditingNoteText('');
    };

    const handleStartEditNote = (index, text) => {
        setEditingNoteIndex(index);
        setEditingNoteText(text);
    };

    const handleCancelEdit = () => {
        if (editingNoteIndex !== null && notes[editingNoteIndex] === '') {
            // If cancelling a new empty note, remove it
            const newNotes = notes.filter((_, i) => i !== editingNoteIndex);
            setNotes(newNotes);
        }
        setEditingNoteIndex(null);
        setEditingNoteText('');
    };

    const handleSaveEditedNote = async () => {
        if (editingNoteIndex === null) return;

        const updatedNotes = [...notes];
        if (editingNoteText.trim()) {
            updatedNotes[editingNoteIndex] = editingNoteText.trim();
        } else {
            // Remove empty note if saved as empty
            updatedNotes.splice(editingNoteIndex, 1);
        }

        try {
            await api.put(`/quotations/${id}`, { notes: updatedNotes });
            setNotes(updatedNotes);
            setEditingNoteIndex(null);
            setEditingNoteText('');
            // Optionally refresh quotation to stay in sync
            // fetchQuotation(); 
        } catch (error) {
            console.error('Error saving note:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save note',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const handleDeleteNote = (index) => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'warning',
            title: 'Delete Note',
            message: 'Are you sure you want to delete this note?',
            okButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            onOk: async () => {
                const updatedNotes = notes.filter((_, i) => i !== index);
                try {
                    await api.put(`/quotations/${id}`, { notes: updatedNotes });
                    setNotes(updatedNotes);
                    closeMessageBox();
                } catch (error) {
                    console.error('Error deleting note:', error);
                    closeMessageBox();
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete note',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    useEffect(() => {
        fetchQuotation();
    }, [id]);

    const fetchQuotation = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/quotations/${id}`);
            setQuotation(response.data);

            // Load spaces for this quotation
            const spacesData = await quotationSpaceService.fetchQuotationSpaces(id);
            // Map workItems to items for frontend compatibility
            const mappedSpaces = spacesData.map(space => ({
                ...space,
                items: space.workItems || []
            }));
            setSpaces(mappedSpaces);
        } catch (error) {
            console.error('Error fetching quotation:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to load quotation',
                onOk: closeMessageBox,
                hideCancel: true
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
            'Sent': 'bg-red-100 text-red-800 border-red-200',
            'Accepted': 'bg-green-100 text-green-800 border-green-200',
            'Rejected': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Add Space
    const handleAddSpaceClick = () => {
        setNewSpaceName(`Space ${spaces.length + 1}`);
        setIsModalOpen(true);
    };

    const handleAddSpace = async () => {
        if (!newSpaceName.trim()) {
            setMessageBoxConfig({
                isOpen: true,
                type: 'warning',
                title: 'Validation',
                message: 'Please enter a space name',
                onOk: closeMessageBox,
                hideCancel: true
            });
            return;
        }

        try {
            const newSpace = await quotationSpaceService.createQuotationSpace(id, {
                name: newSpaceName.trim(),
                order: spaces.length
            });

            // Add initial work item
            const workItem = await quotationSpaceService.addWorkItem(newSpace.id, {
                item: '',
                quantity: 0,
                width: 0,
                length: 0,
                sqft: 0,
                rsPerFt: 0,
                total: 0,
                order: 0
            });

            setSpaces([...spaces, { ...newSpace, items: [workItem] }]);
            setIsModalOpen(false);
            setNewSpaceName('');
        } catch (error) {
            console.error('Error creating space:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to create space',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    // Update space name (UI Only)
    const handleSpaceNameChange = (spaceId, newName) => {
        setSpaces(spaces.map(space =>
            space.id === spaceId ? { ...space, name: newName } : space
        ));
    };

    // Save space name (Backend)
    const handleSpaceNameBlur = async (spaceId, name) => {
        try {
            await quotationSpaceService.updateQuotationSpace(spaceId, { name });
        } catch (error) {
            console.error('Error updating space name:', error);
        }
    };

    // Delete space
    const handleDeleteSpace = (spaceId) => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'warning',
            title: 'Delete Space',
            message: 'Are you sure you want to delete this space?',
            okButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            onOk: async () => {
                try {
                    await quotationSpaceService.deleteQuotationSpace(spaceId);
                    setSpaces(spaces.filter(space => space.id !== spaceId));
                    closeMessageBox();
                } catch (error) {
                    console.error('Error deleting space:', error);
                    closeMessageBox();
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete space',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    // Move space up
    const handleMoveSpaceUp = async (index) => {
        if (index === 0) return;

        const newSpaces = [...spaces];
        [newSpaces[index - 1], newSpaces[index]] = [newSpaces[index], newSpaces[index - 1]];

        setSpaces(newSpaces);

        // Update backend
        try {
            await Promise.all(newSpaces.map((space, idx) =>
                quotationSpaceService.updateQuotationSpace(space.id, { ...space, order: idx })
            ));
        } catch (error) {
            console.error('Error reordering spaces:', error);
        }
    };

    // Move space down
    const handleMoveSpaceDown = async (index) => {
        if (index === spaces.length - 1) return;

        const newSpaces = [...spaces];
        [newSpaces[index], newSpaces[index + 1]] = [newSpaces[index + 1], newSpaces[index]];

        setSpaces(newSpaces);

        // Update backend
        try {
            await Promise.all(newSpaces.map((space, idx) =>
                quotationSpaceService.updateQuotationSpace(space.id, { ...space, order: idx })
            ));
        } catch (error) {
            console.error('Error reordering spaces:', error);
        }
    };

    // Add row
    const handleAddRow = async (spaceId) => {
        try {
            const space = spaces.find(s => s.id === spaceId);
            const newWorkItem = await quotationSpaceService.addWorkItem(spaceId, {
                item: '',
                quantity: 0,
                width: 0,
                length: 0,
                sqft: 0,
                rsPerFt: 0,
                total: 0,
                order: space.items.length
            });

            setSpaces(spaces.map(s =>
                s.id === spaceId
                    ? { ...s, items: [...s.items, newWorkItem] }
                    : s
            ));
        } catch (error) {
            console.error('Error adding work item:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to add row',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    // Delete row
    const handleDeleteRow = async (spaceId, itemId) => {
        try {
            await quotationSpaceService.deleteWorkItem(itemId);
            setSpaces(spaces.map(space =>
                space.id === spaceId
                    ? { ...space, items: space.items.filter(item => item.id !== itemId) }
                    : space
            ));
        } catch (error) {
            console.error('Error deleting work item:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to delete row',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    // Move row up
    const handleMoveRowUp = async (spaceId, rowIndex) => {
        if (rowIndex === 0) return;

        const space = spaces.find(s => s.id === spaceId);
        const newItems = [...space.items];
        [newItems[rowIndex - 1], newItems[rowIndex]] = [newItems[rowIndex], newItems[rowIndex - 1]];

        // Update order in backend
        try {
            await Promise.all(newItems.map((item, index) =>
                quotationSpaceService.updateWorkItem(item.id, { ...item, order: index })
            ));

            setSpaces(spaces.map(s =>
                s.id === spaceId ? { ...s, items: newItems } : s
            ));
        } catch (error) {
            console.error('Error reordering work items:', error);
        }
    };

    // Move row down
    const handleMoveRowDown = async (spaceId, rowIndex) => {
        const space = spaces.find(s => s.id === spaceId);
        if (rowIndex >= space.items.length - 1) return;

        const newItems = [...space.items];
        [newItems[rowIndex], newItems[rowIndex + 1]] = [newItems[rowIndex + 1], newItems[rowIndex]];

        // Update order in backend
        try {
            await Promise.all(newItems.map((item, index) =>
                quotationSpaceService.updateWorkItem(item.id, { ...item, order: index })
            ));

            setSpaces(spaces.map(s =>
                s.id === spaceId ? { ...s, items: newItems } : s
            ));
        } catch (error) {
            console.error('Error reordering work items:', error);
        }
    };

    // Update row data (UI Only)
    const handleRowChange = (spaceId, itemId, field, value) => {
        const space = spaces.find(s => s.id === spaceId);
        const item = space.items.find(item => item.id === itemId);

        const updatedItem = { ...item, [field]: value };

        const getEff = (val) => {
            const num = parseFloat(val);
            return (num === 0 || isNaN(num)) ? 1 : num;
        };

        // Auto-calculate sqft
        if (field === 'width' || field === 'length') {
            const width = parseFloat(field === 'width' ? value : item.width) || 0;
            const length = parseFloat(field === 'length' ? value : item.length) || 0;

            const effWidth = getEff(field === 'width' ? value : item.width);
            const effLength = getEff(field === 'length' ? value : item.length);

            let sqft = effWidth * effLength;

            // If both are 0, show 0
            if (width === 0 && length === 0) sqft = 0;

            updatedItem.sqft = sqft.toFixed(2);
        }

        // Auto-calculate total
        if (field === 'sqft' || field === 'rsPerFt' || field === 'width' || field === 'length' || field === 'quantity') {
            // Use potentially updated sqft
            const quantity = parseFloat(updatedItem.quantity) || 0;
            const sqft = parseFloat(updatedItem.sqft) || 0;
            const rsPerFt = parseFloat(updatedItem.rsPerFt) || 0;

            const effQty = getEff(updatedItem.quantity);
            const effSqft = getEff(updatedItem.sqft);
            const effRate = getEff(updatedItem.rsPerFt);

            let total = effQty * effSqft * effRate;

            // If all are 0, total 0
            if (quantity === 0 && sqft === 0 && rsPerFt === 0) total = 0;

            updatedItem.total = total.toFixed(2);
        }

        // Update UI immediately
        setSpaces(spaces.map(s =>
            s.id === spaceId
                ? {
                    ...s,
                    items: s.items.map(i =>
                        i.id === itemId ? updatedItem : i
                    )
                }
                : s
        ));
    };

    // Save row data (Backend)
    const handleRowBlur = async (spaceId, itemId) => {
        const space = spaces.find(s => s.id === spaceId);
        if (!space) return;
        const item = space.items.find(i => i.id === itemId);
        if (!item) return;

        try {
            await quotationSpaceService.updateWorkItem(itemId, item);
        } catch (error) {
            console.error('Error updating work item:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!quotation) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600">Quotation not found</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-red-50 min-h-screen">
            <div className="max-w mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard/quotations')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Quotations
                </button>

                {/* Header with Quotation Info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 rounded-lg">
                                <FileText size={32} className="text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{quotation.quotationNumber}</h1>
                                <p className="text-sm text-slate-600">{quotation.projectName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(quotation.status)}`}>
                                {quotation.status}
                            </span>
                            <button
                                onClick={() => setIsNotesDrawerOpen(true)}
                                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <FileText size={18} />
                                Notes
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/quotations/edit/${id}`)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={18} />
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <User size={20} className="text-red-600" />
                            <div>
                                <p className="text-xs text-slate-500">Client</p>
                                <p className="text-sm font-semibold text-slate-800">{quotation.client?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Building size={20} className="text-green-600" />
                            <div>
                                <p className="text-xs text-slate-500">Area</p>
                                <p className="text-sm font-semibold text-slate-800">{quotation.area} sq.ft</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Calendar size={20} className="text-purple-600" />
                            <div>
                                <p className="text-xs text-slate-500">Valid Until</p>
                                <p className="text-sm font-semibold text-slate-800">{formatDate(quotation.validTo)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <IndianRupee size={20} className="text-green-600" />
                            <div>
                                <p className="text-xs text-slate-500">Total Cost</p>
                                <p className="text-sm font-bold text-green-600">{formatCurrency(quotation.totalCost)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Space Button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Work Breakdown</h2>
                    <button
                        onClick={handleAddSpaceClick}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Space
                    </button>
                </div>

                {/* Space Cards */}
                <div className="space-y-6">
                    {spaces.map((space, index) => (
                        <div key={space.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Space Header */}
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => handleMoveSpaceUp(index)}
                                            disabled={index === 0}
                                            className={`p-0.5 rounded transition-colors ${index === 0 ? 'text-slate-300' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'}`}
                                            title="Move Space Up"
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleMoveSpaceDown(index)}
                                            disabled={index === spaces.length - 1}
                                            className={`p-0.5 rounded transition-colors ${index === spaces.length - 1 ? 'text-slate-300' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'}`}
                                            title="Move Space Down"
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={space.name}
                                        onChange={(e) => handleSpaceNameChange(space.id, e.target.value)}
                                        onBlur={(e) => handleSpaceNameBlur(space.id, e.target.value)}
                                        className="text-lg font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded px-2 py-1"
                                        placeholder="Space name"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddRow(space.id)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Row
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSpace(space.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Space"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="border border-slate-300 px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase w-16">Sr No</th>
                                            <th className="border border-slate-300 px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase min-w-[200px]">Description</th>
                                            <th className="border border-slate-300 px-3 py-3 text-left text-xs font-bold text-slate-700 uppercase w-32">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {space.items.map((row, index) => (
                                            <tr key={row.id} className="hover:bg-slate-50">
                                                <td className="border border-slate-300 px-3 py-3 text-sm text-slate-700 text-center font-medium">{index + 1}</td>
                                                <td className="border border-slate-300 p-0">
                                                    <input
                                                        type="text"
                                                        value={row.item || ''}
                                                        onChange={(e) => handleRowChange(space.id, row.id, 'item', e.target.value)}
                                                        onBlur={() => handleRowBlur(space.id, row.id)}
                                                        className="w-full h-full px-3 py-2 border-none focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-transparent"
                                                        placeholder="Description"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 px-2 py-1">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => handleMoveRowUp(space.id, index)}
                                                            disabled={index === 0}
                                                            className={`p-1 rounded transition-colors ${index === 0
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-red-600 hover:bg-red-50'
                                                                }`}
                                                            title="Move Up"
                                                        >
                                                            <ArrowUp size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleMoveRowDown(space.id, index)}
                                                            disabled={index === space.items.length - 1}
                                                            className={`p-1 rounded transition-colors ${index === space.items.length - 1
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-red-600 hover:bg-red-50'
                                                                }`}
                                                            title="Move Down"
                                                        >
                                                            <ArrowDown size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteRow(space.id, row.id)}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete Row"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {spaces.length === 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Spaces Added</h3>
                            <p className="text-slate-600 mb-4">Add spaces to break down the work for this quotation</p>
                            <button
                                onClick={handleAddSpaceClick}
                                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-red-500/30 flex items-center gap-2 mx-auto"
                            >
                                <Plus size={18} />
                                Add Your First Space
                            </button>
                        </div>
                    )}
                </div>

                {/* Grand Total Section */}
                {spaces.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex justify-end items-center mb-8">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Grand Total</p>
                            <p className="text-3xl font-bold text-slate-800">
                                {formatCurrency(spaces.reduce((acc, space) => {
                                    return acc + (space.items || []).reduce((sAcc, item) => sAcc + (parseFloat(item.total) || 0), 0);
                                }, 0))}
                            </p>
                        </div>
                    </div>
                )}

                {/* Add Space Modal */}
                {isModalOpen && ReactDOM.createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Plus size={20} className="text-red-600" />
                                        Add New Space
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Enter a name for the new space
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Space Name
                                </label>
                                <input
                                    type="text"
                                    value={newSpaceName}
                                    onChange={(e) => setNewSpaceName(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSpace();
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    placeholder="e.g., Living Room, Kitchen, Bedroom"
                                    autoFocus
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddSpace}
                                    className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    Add Space
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
                {/* Notes Drawer */}
                {isNotesDrawerOpen && ReactDOM.createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsNotesDrawerOpen(false)}
                        />
                        <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                            <div className="h-full flex flex-col p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">Quotation Notes</h2>
                                        <p className="text-slate-500 text-sm">Manage important notes for this quotation</p>
                                    </div>
                                    <button
                                        onClick={() => setIsNotesDrawerOpen(false)}
                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto mb-4">
                                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="bg-slate-50 text-slate-700 font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3 w-16 text-center border-b border-r border-slate-200">Sr.</th>
                                                    <th className="px-4 py-3 border-b border-r border-slate-200">Note</th>
                                                    <th className="px-4 py-3 w-24 text-center border-b border-slate-200">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {notes.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-8 text-center text-slate-400 italic">
                                                            No notes added yet. Click "Add Note" below.
                                                        </td>
                                                    </tr>
                                                )}
                                                {notes.map((note, index) => (
                                                    <tr key={index} className="group hover:bg-red-50/30 transition-colors">
                                                        <td className="px-4 py-2 text-center text-slate-500 font-medium border-r border-slate-100">
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className="px-4 py-2 text-slate-700 break-words border-r border-slate-100 cursor-text"
                                                            onDoubleClick={() => handleStartEditNote(index, note)}
                                                        >
                                                            {editingNoteIndex === index ? (
                                                                <input
                                                                    type="text"
                                                                    value={editingNoteText}
                                                                    onChange={(e) => setEditingNoteText(e.target.value)}
                                                                    className="w-full px-2 py-1.5 border border-red-400 rounded bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
                                                                    autoFocus
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleSaveEditedNote();
                                                                        if (e.key === 'Escape') handleCancelEdit();
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="block py-1">
                                                                    {note}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            {editingNoteIndex === index ? (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button
                                                                        onClick={handleSaveEditedNote}
                                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                                        title="Save"
                                                                    >
                                                                        <Check size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                        title="Cancel"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleStartEditNote(index, note)}
                                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteNote(index)}
                                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handleAddNote}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                                    >
                                        <Plus size={16} />
                                        Add Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>,
                    document.body
                )}
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
        </div>
    );
};

export default QuotationView;
