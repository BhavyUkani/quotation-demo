import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Calculator, User, Building, Package, Calendar, DollarSign, Phone, FileText, IndianRupee, X } from 'lucide-react';
import api from '../../api/axios';
import * as siteService from '../../api/siteService';
import MessageBox from '../../components/common/MessageBox';
import Constants from '../../constents/constants';

const QuotationDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get quotation ID from URL if editing
    const isEditMode = Boolean(id);

    const [clients, setClients] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [originalPackageId, setOriginalPackageId] = useState('');

    const [formData, setFormData] = useState({
        clientId: '',
        packageId: '',
        projectName: '',
        area: '',
        validFrom: new Date().toISOString().split('T')[0],
        validTo: '',
        projectCost: '',
        discountPercentage: '',
        salesPersonName: '',
        salesPersonMobile: '',
        status: Constants.QUOTATION_STATUS.DRAFT,
        remarks: '',
        costType: Constants.COST_TYPE.CALCULATED,
        fixedCost: 0
    });

    const [selectedClient, setSelectedClient] = useState(null);
    const [calculatedTotal, setCalculatedTotal] = useState(0);
    const [validityDays, setValidityDays] = useState('');

    // Supervisor Modal State
    const [employees, setEmployees] = useState([]);
    const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState('');

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
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [clientsRes, packagesRes, employeesRes] = await Promise.all([
                api.get('/clients?limit=1000'),
                api.get('/packages?limit=1000'),
                api.get('/employees?limit=1000')
            ]);

            // Handle both paginated ({ items: [], ... }) and non-paginated ([]) responses
            setClients(Array.isArray(clientsRes.data) ? clientsRes.data : (clientsRes.data.clients || []));
            setPackages(Array.isArray(packagesRes.data) ? packagesRes.data : (packagesRes.data.packages || []));
            setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : (employeesRes.data.employees || []));

            // If editing, fetch the quotation data
            if (isEditMode) {
                const quotationRes = await api.get(`/quotations/${id}`);
                const quotation = quotationRes.data;

                // Format dates for input fields
                const formatDateForInput = (date) => {
                    if (!date) return '';
                    return new Date(date).toISOString().split('T')[0];
                };

                setFormData({
                    clientId: quotation.clientId || '',
                    packageId: quotation.packageId || '',
                    projectName: quotation.projectName || '',
                    area: quotation.area || '',
                    validFrom: formatDateForInput(quotation.validFrom),
                    validTo: formatDateForInput(quotation.validTo),
                    projectCost: quotation.itemsTotal || '',
                    discountPercentage: quotation.discountPercentage || '',
                    salesPersonName: quotation.salesPersonName || '',
                    salesPersonMobile: quotation.salesPersonMobile || '',
                    status: quotation.status || Constants.QUOTATION_STATUS.DRAFT,
                    remarks: quotation.remarks || '',
                    costType: quotation.costType || Constants.COST_TYPE.CALCULATED,
                    fixedCost: quotation.fixedCost || 0
                });

                setOriginalPackageId(quotation.packageId || '');

                // Set selected client if exists
                if (quotation.clientId) {
                    const client = clientsRes.data.find(c => c.id === quotation.clientId);
                    if (client) {
                        setSelectedClient(client);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to load data. Please try again.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate total cost when project cost or discount changes
    // Calculate total cost when project cost, fixed cost, cost type or discount changes
    useEffect(() => {
        let baseCost = 0;
        if (formData.costType === Constants.COST_TYPE.FIXED) {
            baseCost = parseFloat(formData.fixedCost) || 0;
        } else {
            baseCost = parseFloat(formData.projectCost) || 0;
        }

        const discount = parseFloat(formData.discountPercentage) || 0;
        const total = baseCost - (baseCost * discount / 100);
        setCalculatedTotal(total);
    }, [formData.projectCost, formData.fixedCost, formData.costType, formData.discountPercentage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Recalculate Valid To if Valid From changes and duration is selected
            if (name === 'validFrom' && validityDays && value) {
                const startDate = new Date(value);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + parseInt(validityDays));
                newData.validTo = endDate.toISOString().split('T')[0];
            }

            return newData;
        });
    };

    const handleDurationChange = (e) => {
        const days = e.target.value;
        setValidityDays(days);

        if (days && formData.validFrom) {
            const startDate = new Date(formData.validFrom);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + parseInt(days));
            setFormData(prev => ({
                ...prev,
                validTo: endDate.toISOString().split('T')[0]
            }));
        }
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        const client = clients.find(c => c.id === clientId);

        setSelectedClient(client || null);

        setFormData(prev => {
            const updates = { ...prev, clientId };
            if (client && client.totalArea) {
                updates.area = client.totalArea;
            }
            return updates;
        });
    };

    const handlePackageChange = (e) => {
        const pkgId = e.target.value;
        const currentPkgId = formData.packageId;

        // If in edit mode and changing to a different package
        if (isEditMode && pkgId !== currentPkgId) {
            // If we are changing BACK to the original package, don't warn
            if (pkgId === originalPackageId) {
                updatePackageData(pkgId);
                return;
            }

            setMessageBoxConfig({
                isOpen: true,
                type: 'warning',
                title: 'Change Package?',
                message: 'Changing the package will overwrite all existing quotation spaces and work items with the new package data. This action cannot be undone. Do you want to proceed?',
                onOk: () => {
                    updatePackageData(pkgId);
                    closeMessageBox();
                },
                onCancel: () => {
                    // Revert selection effectively by not updating state
                    closeMessageBox();
                },
                okButtonName: 'Yes, Overwrite',
                cancelButtonName: 'Cancel',
                hideCancel: false
            });
        } else {
            updatePackageData(pkgId);
        }
    };

    const updatePackageData = (pkgId) => {
        const pkg = packages.find(p => p.id === pkgId);

        let itemsSum = 0;
        if (pkg && pkg.spaces) {
            pkg.spaces.forEach(space => {
                if (space.workItems) {
                    space.workItems.forEach(item => {
                        itemsSum += parseFloat(item.total) || 0;
                    });
                }
            });
        }

        setFormData(prev => ({
            ...prev,
            packageId: pkgId,
            projectCost: itemsSum,
            costType: pkg?.costType || Constants.COST_TYPE.CALCULATED,
            fixedCost: pkg?.fixedCost || 0
        }));
    };



    const saveQuotation = async (supervisorData = null) => {
        try {
            const quotationData = {
                ...formData,
                totalCost: calculatedTotal
            };

            let successMessage = '';

            if (isEditMode) {
                // Update existing quotation
                await api.put(`/quotations/${id}`, quotationData);

                // Create Site if status is Accepted
                if (formData.status === Constants.QUOTATION_STATUS.ACCEPTED) {
                    const supervisorName = supervisorData ? supervisorData.name : formData.salesPersonName;
                    const supervisorPhone = supervisorData ? supervisorData.phone : formData.salesPersonMobile;

                    const siteData = {
                        clientName: selectedClient ? (selectedClient.companyName || selectedClient.name) : 'Unknown Client',
                        projectName: formData.projectName,
                        supervisorName: supervisorName,
                        supervisorPhone: supervisorPhone,
                        address: selectedClient?.address || '',
                        status: 'Draft'
                    };
                    await siteService.createSite(siteData);
                    successMessage = 'Quotation updated and Site created in Draft status!';
                } else {
                    successMessage = 'Quotation updated successfully!';
                }
            } else {
                // Create new quotation
                await api.post('/quotations', quotationData);

                if (formData.status === Constants.QUOTATION_STATUS.ACCEPTED) {
                    const supervisorName = supervisorData ? supervisorData.name : formData.salesPersonName;
                    const supervisorPhone = supervisorData ? supervisorData.phone : formData.salesPersonMobile;

                    const siteData = {
                        clientName: selectedClient ? (selectedClient.companyName || selectedClient.name) : 'Unknown Client',
                        projectName: formData.projectName,
                        supervisorName: supervisorName,
                        supervisorPhone: supervisorPhone,
                        address: selectedClient?.address || '',
                        status: 'Draft'
                    };
                    await siteService.createSite(siteData);
                    successMessage = 'Quotation created and Site created in Draft status!';
                } else {
                    successMessage = 'Quotation created successfully!';
                }
            }

            setMessageBoxConfig({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: successMessage,
                onOk: () => {
                    closeMessageBox();
                    navigate('/dashboard/quotations');
                },
                hideCancel: true
            });

        } catch (error) {
            console.error('Error saving quotation:', error);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: `Failed to ${isEditMode ? 'update' : 'create'} quotation. Please try again.`,
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.status === Constants.QUOTATION_STATUS.ACCEPTED) {
            setIsSupervisorModalOpen(true);
        } else {
            saveQuotation();
        }
    };

    const handleConfirmSupervisor = () => {
        if (!selectedSupervisorId) {
            setMessageBoxConfig({
                isOpen: true,
                type: 'warning',
                title: 'Validation',
                message: 'Please select a supervisor',
                onOk: closeMessageBox,
                hideCancel: true
            });
            return;
        }

        const supervisor = employees.find(e => e.id === selectedSupervisorId);
        saveQuotation({
            name: supervisor ? supervisor.name : formData.salesPersonName,
            phone: supervisor ? (supervisor.phone || supervisor.mobile || '') : formData.salesPersonMobile
        });
        setIsSupervisorModalOpen(false);
    };

    const statuses = Object.values(Constants.QUOTATION_STATUS);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* back to quotations button */}
            <div className='flex items-center gap-3 mb-6'>
                <button
                    onClick={() => navigate('/dashboard/quotations')}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-600" /> Back to Quotations
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Single Card with All Fields */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Client */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Client <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    name="clientId"
                                    required
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700 appearance-none cursor-pointer"
                                    value={formData.clientId}
                                    onChange={handleClientChange}
                                >
                                    <option value="">Select Client</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} {client.companyName ? `(${client.companyName})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Package */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Package <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Package className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    name="packageId"
                                    required
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700 appearance-none cursor-pointer"
                                    value={formData.packageId}
                                    onChange={handlePackageChange}
                                >
                                    <option value="">Select Package</option>
                                    {packages.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.type} - {pkg.category} ({pkg.price})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Project Name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="projectName"
                                required
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                placeholder="Enter project name"
                                value={formData.projectName}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Area */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Area (sq.ft) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="area"
                                required
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                placeholder="Enter area in sq.ft"
                                value={formData.area}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Valid From */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Valid From <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="validFrom"
                                required
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                value={formData.validFrom}
                                onChange={handleInputChange}

                            />
                        </div>

                        {/* Validity Duration */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Validity Duration
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700 appearance-none cursor-pointer"
                                    value={validityDays}
                                    onChange={handleDurationChange}
                                >
                                    <option value="">Select Duration</option>
                                    <option value="15">15 Days</option>
                                    <option value="30">30 Days</option>
                                    <option value="45">45 Days</option>
                                    <option value="60">60 Days</option>
                                </select>
                            </div>
                        </div>

                        {/* Valid To */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Valid To <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="validTo"
                                required
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                value={formData.validTo}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Project Cost Section with Toggle */}
                        <div className="md:col-span-1">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Project Cost
                                </label>
                                <div className="flex bg-slate-100 rounded-lg p-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, costType: Constants.COST_TYPE.CALCULATED }))}
                                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${formData.costType === Constants.COST_TYPE.CALCULATED
                                            ? 'bg-white text-red-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        As Per Quotation
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, costType: Constants.COST_TYPE.FIXED }))}
                                        className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-all ${formData.costType === Constants.COST_TYPE.FIXED
                                            ? 'bg-white text-red-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Fixed Cost
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <IndianRupee className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                {formData.costType === Constants.COST_TYPE.FIXED ? (
                                    <input
                                        type="number"
                                        name="fixedCost"
                                        required
                                        step="1"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                        placeholder="Enter fixed amount"
                                        value={formData.fixedCost}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        name="projectCost"
                                        readOnly
                                        step="0.01"
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none cursor-not-allowed font-medium text-slate-500"
                                        placeholder="Calculated from items"
                                        value={formData.projectCost}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Discount (%)
                            </label>
                            <div className="relative">
                                <Calculator className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                    placeholder="0"
                                    value={formData.discountPercentage}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Sales Person Name */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Project Cordinator Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="salesPersonName"
                                required
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                placeholder="Enter sales person name"
                                value={formData.salesPersonName}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Sales Person Mobile */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Project Cordinator Mobile <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="tel"
                                    name="salesPersonMobile"
                                    required
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700"
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.salesPersonMobile}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                required
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700 appearance-none cursor-pointer"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                {Constants.QUOTATION_STATUS_ARRAY.map(statusItem => (
                                    <option key={statusItem.value} value={statusItem.value}>{statusItem.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Remarks - Full Width */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Remarks
                            </label>
                            <textarea
                                name="remarks"
                                rows="3"
                                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700 resize-none"
                                placeholder="Add any additional notes or remarks..."
                                value={formData.remarks}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Total Cost - Full Width */}
                        <div className="md:col-span-2">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mt-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-green-700">Total Cost (After Discount)</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-700">
                                            ₹{calculatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        {formData.discountPercentage > 0 && (
                                            <p className="text-[10px] text-green-600 mt-0.5">
                                                Saved: ₹{((formData.costType === Constants.COST_TYPE.FIXED ? parseFloat(formData.fixedCost) : parseFloat(formData.projectCost) || 0) - calculatedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/quotations')}
                            className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <Save size={16} />
                            {isEditMode ? 'Update Quotation' : 'Create Quotation'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Supervisor Selection Modal */}
            {isSupervisorModalOpen && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up"
                    onClick={() => setIsSupervisorModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <User size={20} className="text-red-600" />
                                    Assign Supervisor
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Select a supervisor for this project
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSupervisorModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Supervisor
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                <select
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium text-slate-700 cursor-pointer"
                                    value={selectedSupervisorId}
                                    onChange={(e) => setSelectedSupervisorId(e.target.value)}
                                >
                                    <option value="">Select Supervisor</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name} ({emp.mobile || 'No Mobile'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                The site will be created and this supervisor will be assigned.
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex gap-3">
                            <button
                                onClick={() => setIsSupervisorModalOpen(false)}
                                className="flex-1 px-5 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-white font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmSupervisor}
                                className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95"
                            >
                                Assign & Create Site
                            </button>
                        </div>
                    </div>
                </div>,
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
    );
};

export default QuotationDetails;
