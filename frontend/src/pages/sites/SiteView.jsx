import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { ArrowLeft, MapPin, User, Building, Phone, Mail, Edit2, Trash2, Plus, X } from 'lucide-react';
import * as siteService from '../../api/siteService';
import MessageBox from '../../components/common/MessageBox';

const SiteView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [site, setSite] = useState(null);
    const [loading, setLoading] = useState(true);

    // Materials State
    const [materials, setMaterials] = useState([]);
    const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
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

    const [newMaterial, setNewMaterial] = useState({
        date: new Date().toISOString().split('T')[0],
        materialName: '',
        quantity: '',
        unit: '',
        cost: ''
    });

    const fetchMaterials = async () => {
        try {
            if (id) {
                const data = await siteService.fetchSiteMaterials(id);
                setMaterials(data);
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    useEffect(() => {
        const fetchSite = async () => {
            try {
                setLoading(true);
                const data = await siteService.fetchSiteById(id);
                setSite(data);
            } catch (error) {
                console.error('Error fetching site:', error);
                setMessageBoxConfig({
                    isOpen: true,
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to load site details',
                    onOk: closeMessageBox,
                    hideCancel: true
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSite();
            fetchMaterials();
        }
    }, [id]);

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-100 text-green-800 border-green-200',
            'Completed': 'bg-red-100 text-red-800 border-red-200',
            'Inactive': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (!site) {
        return (
            <div className="text-center">
                <p className="text-slate-600">Site not found</p>
                <button
                    onClick={() => navigate('/dashboard/sites')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                    Back to Sites
                </button>
            </div>
        );
    }




    const handleAddMaterial = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newMaterial,
                quantity: parseFloat(newMaterial.quantity),
                cost: parseFloat(newMaterial.cost)
            };
            await siteService.addSiteMaterial(id, payload);
            setNewMaterial({
                date: new Date().toISOString().split('T')[0],
                materialName: '',
                quantity: '',
                unit: '',
                cost: ''
            });
            setIsAddMaterialOpen(false);
            fetchMaterials();
        } catch (error) {
            console.error('Error adding material:', error);
            const errMsg = error.response?.data?.message || error.message;
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: `Failed to add material: ${errMsg}`,
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const handleDeleteMaterial = (materialId) => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'warning',
            title: 'Delete Material',
            message: 'Are you sure you want to delete this material entry?',
            okButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            onOk: async () => {
                try {
                    await siteService.deleteSiteMaterial(materialId);
                    fetchMaterials();
                    closeMessageBox();
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'success',
                        title: 'Success',
                        message: 'Material deleted successfully',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                } catch (error) {
                    console.error('Error deleting material:', error);
                    closeMessageBox();
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete material',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const totalCost = materials.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);

    return (
        <div className="bg-gradient-to-br from-slate-50 to-red-50 min-h-screen">
            <div className="max-w mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate('/dashboard/sites')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Sites
                    </button>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    {/* Site Header */}
                    <div className="p-4 md:p-8 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <Building size={32} className="text-red-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800 mb-1">{site.projectName}</h1>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <User size={16} />
                                        <span>{site.clientName}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(site.status)}`}>
                                {site.status}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Location Details</h3>
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                                <MapPin className="text-slate-400 mt-1" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{site.address || 'No address provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Supervisor */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Supervisor Information</h3>
                            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="text-slate-400" size={18} />
                                    <span className="text-sm font-medium text-slate-700">{site.supervisorName || 'Not assigned'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="text-slate-400" size={18} />
                                    <span className="text-sm font-medium text-slate-700">{site.supervisorPhone || 'No phone number'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Materials Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800">Site Expenses / Materials</h2>
                        <button
                            onClick={() => setIsAddMaterialOpen(true)}
                            className="hidden md:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Material
                        </button>
                    </div>

                    {/* Add Material Modal */}
                    {isAddMaterialOpen && ReactDOM.createPortal(
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="text-lg font-bold text-slate-800">Add Material Entry</h3>
                                    <button
                                        onClick={() => setIsAddMaterialOpen(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddMaterial} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                value={newMaterial.date}
                                                onChange={e => setNewMaterial({ ...newMaterial, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Material Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Cement"
                                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                value={newMaterial.materialName}
                                                onChange={e => setNewMaterial({ ...newMaterial, materialName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                value={newMaterial.quantity}
                                                onChange={e => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unit</label>
                                            <select
                                                required
                                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all appearance-none bg-white"
                                                value={newMaterial.unit}
                                                onChange={e => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                <option value="kg">kg</option>
                                                <option value="bags">bags</option>
                                                <option value="tons">tons</option>
                                                <option value="sq.ft">sq.ft</option>
                                                <option value="meter">meter</option>
                                                <option value="pcs">pcs</option>
                                                <option value="liters">liters</option>
                                                <option value="box">box</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cost (₹)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                                                value={newMaterial.cost}
                                                onChange={e => setNewMaterial({ ...newMaterial, cost: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddMaterialOpen(false)}
                                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Add Entry
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Mobile Card View for Materials */}
                    <div className="md:hidden space-y-4 p-4">
                        {materials.length > 0 ? (
                            materials.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{item.materialName}</h4>
                                            <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">₹{parseFloat(item.cost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-slate-600 mt-2">
                                        <span>{item.quantity} {item.unit}</span>
                                        <button
                                            onClick={() => handleDeleteMaterial(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                No materials added yet.
                            </div>
                        )}
                        {materials.length > 0 && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-200">
                                <span className="text-sm font-bold text-slate-700">Total Cost:</span>
                                <span className="text-lg font-bold text-red-700">₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Material Name</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Unit</th>
                                    <th className="px-6 py-4 text-right">Cost</th>
                                    <th className="px-6 py-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {materials.length > 0 ? (
                                    materials.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-sm text-slate-600">{new Date(item.date).toLocaleDateString('en-IN')}</td>
                                            <td className="px-6 py-3 text-sm font-medium text-slate-800">{item.materialName}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600">{item.quantity}</td>
                                            <td className="px-6 py-3 text-sm text-slate-600">{item.unit}</td>
                                            <td className="px-6 py-3 text-sm font-bold text-slate-800 text-right">₹{parseFloat(item.cost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteMaterial(item.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            No materials added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Total Cost:</td>
                                    <td className="px-6 py-4 text-lg font-bold text-red-700 text-right">₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Mobile FAB for Add Material */}
                <button
                    onClick={() => setIsAddMaterialOpen(true)}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center z-[90] transition-transform active:scale-95"
                >
                    <Plus size={28} />
                </button>

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

export default SiteView;
