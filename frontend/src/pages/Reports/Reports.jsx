import React, { useState, useEffect } from 'react';
import { Download, Filter, FileText, CheckCircle, XCircle, Clock, IndianRupee, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

const Reports = () => {
    const [quotations, setQuotations] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [projectType, setProjectType] = useState(''); // Assuming this maps to something in quotation or package

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [quotationsRes, clientsRes] = await Promise.all([
                api.get('/quotations'),
                api.get('/clients')
            ]);
            setQuotations(quotationsRes.data);
            setClients(clientsRes.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredQuotations = quotations.filter(q => {
        const matchesClient = selectedClient ? q.clientId === selectedClient : true;
        const matchesStatus = selectedStatus ? q.status === selectedStatus : true;

        let matchesDate = true;
        if (dateRange.start) {
            matchesDate = matchesDate && new Date(q.createdAt) >= new Date(dateRange.start);
        }
        if (dateRange.end) {
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && new Date(q.createdAt) <= endDate;
        }

        // Project Type filtering - partially matching package description or name if stored, 
        // or just project name text match for now as strictly 'Project Type' field doesn't exist on Quotation model directly 
        // but often implied by Package Category or similar. 
        // Let's implement text search on Package Category if available in included data?
        // The getAllQuotations includes 'package' usually? Let's check controller.
        // Controller currently includes 'client' and 'creator'. It does NOT include 'package'. 
        // I might need to fetch packages or just rely on local state if I fetched it, but here I only fetched quotations.
        // I will assume for now Project Type filter acts as a text filter on Project Name or empty.
        const matchesType = projectType ? q.projectName.toLowerCase().includes(projectType.toLowerCase()) : true;

        return matchesClient && matchesStatus && matchesDate && matchesType;
    });

    // Metrics Calculation
    const totalQuotations = filteredQuotations.length;
    const approvedQuotations = filteredQuotations.filter(q => q.status === 'Accepted').length;
    const rejectedQuotations = filteredQuotations.filter(q => q.status === 'Rejected').length;
    const pendingQuotations = filteredQuotations.filter(q => ['Draft', 'Sent'].includes(q.status)).length;

    const totalValue = filteredQuotations.reduce((acc, q) => acc + (parseFloat(q.totalCost) || 0), 0);

    const conversionRate = totalQuotations > 0 ? ((approvedQuotations / totalQuotations) * 100).toFixed(1) : '0.0';

    // Avg Approval Time (using statusHistory for better accuracy)
    const approvalTimes = filteredQuotations
        .filter(q => q.status === 'Accepted')
        .map(q => {
            let acceptedDate;
            const createdDate = new Date(q.createdAt);

            if (q.statusHistory && q.statusHistory.length > 0) {
                // Find first "Accepted" status time
                const acceptedEntry = q.statusHistory
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .find(h => h.newStatus === 'Accepted');

                if (acceptedEntry) {
                    acceptedDate = new Date(acceptedEntry.createdAt);
                }
            }

            // Fallback if no history or history entry not found (legacy data)
            if (!acceptedDate) {
                acceptedDate = new Date(q.updatedAt);
            }

            return acceptedDate - createdDate;
        });

    const avgApprovalTimeDays = approvalTimes.length > 0
        ? (approvalTimes.reduce((a, b) => a + b, 0) / approvalTimes.length / (1000 * 60 * 60 * 24)).toFixed(1)
        : '0.0';

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const [activeTab, setActiveTab] = useState('quotations');

    const downloadClientExcel = () => {
        const clientStats = clients.map(client => {
            const clientQuotations = quotations.filter(q => q.clientId === client.id);
            const approved = clientQuotations.filter(q => q.status === 'Accepted');
            const pending = clientQuotations.filter(q => ['Draft', 'Sent'].includes(q.status));
            const rejected = clientQuotations.filter(q => q.status === 'Rejected');

            const approvedAmount = approved.reduce((sum, q) => sum + (parseFloat(q.totalCost) || 0), 0);
            const pendingAmount = pending.reduce((sum, q) => sum + (parseFloat(q.totalCost) || 0), 0);
            const rejectedAmount = rejected.reduce((sum, q) => sum + (parseFloat(q.totalCost) || 0), 0);
            const totalValue = approvedAmount + pendingAmount + rejectedAmount;

            return {
                name: client.name,
                phone: client.phone || 'N/A',
                email: client.email || 'N/A',
                quotationCount: clientQuotations.length,
                approvedAmount,
                pendingAmount,
                rejectedAmount,
                totalValue
            };
        });

        const headers = ['Client Name', 'Phone', 'Email', 'Number of Quotations', 'Approved Amount', 'Pending Amount', 'Rejected Amount', 'Total Business Value'];
        const rows = clientStats.map(c => [
            c.name,
            c.phone,
            c.email,
            c.quotationCount,
            c.approvedAmount,
            c.pendingAmount,
            c.rejectedAmount,
            c.totalValue
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(item => `"${item}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `client_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const downloadExcel = () => {
        // Prepare CSV Content
        const headers = ['Quotation Number', 'Client Name', 'Project Name', 'Quotation Date', 'Status', 'Total Amount', 'Discount (%)', 'Final Payable Amount'];
        const rows = filteredQuotations.map(q => [
            q.quotationNumber,
            q.client?.name || 'Unknown',
            q.projectName,
            new Date(q.createdAt).toLocaleDateString(),
            q.status,
            q.projectCost || 0, // Base amount before discount? Or just use totalCost? 
            // The requirement says "Total amount", "Discount", "Final payable amount".
            // q.projectCost is likely the base (or close to it), q.totalCost is final.
            q.discountPercentage || 0,
            q.totalCost || 0
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(item => `"${item}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `quotation_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Client Filter Logic
    const [clientCategory, setClientCategory] = useState('');
    const [clientLocation, setClientLocation] = useState('');

    const filteredClients = clients.filter(c => {
        let matchesDate = true;
        if (dateRange.start) {
            matchesDate = matchesDate && new Date(c.createdAt) >= new Date(dateRange.start);
        }
        if (dateRange.end) {
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && new Date(c.createdAt) <= endDate;
        }

        const matchesCategory = clientCategory ? c.propertyType === clientCategory : true;
        const matchesLocation = clientLocation ? (c.address || '').toLowerCase().includes(clientLocation.toLowerCase()) : true;

        return matchesDate && matchesCategory && matchesLocation;
    });

    // Client Metrics
    const totalClients = filteredClients.length;
    // New vs Repeat: New = Created in range (already filtered by date), Repeat = Clients with > 1 quotation (regardless of date, usually)
    // BUT "New" implies recently acquired. The filteredClients ARE the "New" ones if date range is set?
    // Let's refine: 
    // If Date Range is SET: Total Clients = Clients created in that range.
    // If Date Range is NOT SET: Total Clients = All Clients.
    // Repeat Clients = Clients with > 1 Quotation.
    // New Clients = Clients created < 30 days ago (if no date filter) OR Clients created in range.

    // Simpler approach for "New vs Repeat" chart/stat:
    // Repeat Clients:
    const repeatClients = filteredClients.filter(c => {
        const count = quotations.filter(q => q.clientId === c.id).length;
        return count > 1;
    }).length;
    const newClients = filteredClients.length - repeatClients; // Simplification

    // Client Conversion Ratio: Clients with >= 1 Accepted Quote / Total Clients
    const convertedClients = filteredClients.filter(c => {
        return quotations.some(q => q.clientId === c.id && q.status === 'Accepted');
    }).length;
    const clientConversionRate = totalClients > 0 ? ((convertedClients / totalClients) * 100).toFixed(1) : '0.0';

    // Top 10 Clients by Value (Approved Value)
    const topClients = [...clients].map(c => {
        const value = quotations
            .filter(q => q.clientId === c.id && q.status === 'Accepted')
            .reduce((sum, q) => sum + (parseFloat(q.totalCost) || 0), 0);
        return { ...c, value };
    })
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .filter(c => c.value > 0);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
                    <p className="text-slate-500 text-sm">Track performance and analytics</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={activeTab === 'quotations' ? downloadExcel : downloadClientExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Download size={18} />
                        Download {activeTab === 'quotations' ? 'Quotations' : 'Clients'} Excel
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('quotations')}
                    className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'quotations' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Quotation Reports
                    {activeTab === 'quotations' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('clients')}
                    className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'clients' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Client Reports
                    {activeTab === 'clients' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('revenue')}
                    className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${activeTab === 'revenue' ? 'text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Revenue & Business
                    {activeTab === 'revenue' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-t-full"></div>}
                </button>
            </div>

            {/* Quotation Reports Section */}
            {activeTab === 'quotations' && (
                <div className="space-y-6 animate-fade-in-up">

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                            <Filter size={18} />
                            <h2>Report Filters</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Date Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    />
                                    <span className="self-center text-slate-400">-</span>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Client</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                >
                                    <option value="">All Clients</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Sent">Sent</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Project Type (Search)</label>
                                <input
                                    type="text"
                                    placeholder="Search project name..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Quotations */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText size={64} className="text-red-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Total Quotations</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalQuotations}</h3>
                            <div className="mt-4 flex gap-2 text-xs">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">{approvedQuotations} Approved</span>
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full">{pendingQuotations} Pending</span>
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">{rejectedQuotations} Rejected</span>
                            </div>
                        </div>

                        {/* Quotation Value */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <IndianRupee size={64} className="text-emerald-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Total Quotation Value</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(totalValue)}</h3>
                            <p className="text-emerald-600 text-xs mt-4 font-medium flex items-center gap-1">
                                <TrendingUp size={12} />
                                Net potential revenue
                            </p>
                        </div>

                        {/* Conversion Rate */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle size={64} className="text-purple-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Approval Conversion Rate</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{conversionRate}%</h3>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${conversionRate}%` }}></div>
                            </div>
                        </div>

                        {/* Avg Time */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock size={64} className="text-orange-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Avg. Approval Time</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{avgApprovalTimeDays} <span className="text-lg font-normal text-slate-500">Days</span></h3>
                            <p className="text-slate-400 text-xs mt-4">Average time from creation to acceptance</p>
                        </div>
                    </div>

                </div>
            )}

            {/* Client Reports Section */}
            {activeTab === 'clients' && (
                <div className="space-y-6 animate-fade-in-up">

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                            <Filter size={18} />
                            <h2>Report Filters</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Date Range (Created At)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    />
                                    <span className="self-center text-slate-400">-</span>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Category</label>
                                <select
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                    value={clientCategory}
                                    onChange={(e) => setClientCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Location (Search)</label>
                                <input
                                    type="text"
                                    placeholder="Search location/address..."
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                    value={clientLocation}
                                    onChange={(e) => setClientLocation(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Clients */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText size={64} className="text-red-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Total Clients</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{totalClients}</h3>
                        </div>

                        {/* New vs Repeat */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle size={64} className="text-teal-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Client Mix</p>
                            <div className="flex gap-4 mt-2">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{newClients}</h3>
                                    <p className="text-xs text-slate-500">New</p>
                                </div>
                                <div className="h-10 w-px bg-slate-200"></div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{repeatClients}</h3>
                                    <p className="text-xs text-slate-500">Repeat</p>
                                </div>
                            </div>
                        </div>

                        {/* Conversion Ratio */}
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={64} className="text-indigo-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Client Conversion Ratio</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-2">{clientConversionRate}%</h3>
                            <p className="text-slate-400 text-xs mt-1">Clients with accepted deals</p>
                        </div>
                    </div>

                    {/* Top 10 Clients */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-700">Top 10 Clients by Value</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Rank</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client Name</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Company</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Total Approved Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {topClients.map((client, index) => (
                                        <tr key={client.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-500">#{index + 1}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{client.name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{client.company || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(client.value)}</td>
                                        </tr>
                                    ))}
                                    {topClients.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No data available for top clients</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            )}

            {/* Revenue Reports Section */}
            {activeTab === 'revenue' && (
                <div className="space-y-6 animate-fade-in-up">
                    <RevenueReportContent quotations={quotations} formatCurrency={formatCurrency} />
                </div>
            )}
        </div >
    );
};

// Sub-component for Revenue Report to keep main component cleaner
const RevenueReportContent = ({ quotations, formatCurrency }) => {
    // Process Data
    const processRevenueData = () => {
        const monthlyData = {};

        quotations.forEach(q => {
            const date = new Date(q.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    totalQuotations: 0,
                    quotedValue: 0,
                    approvedValue: 0,
                    rejectedValue: 0,
                    netRevenue: 0, // Assuming Net Revenue = Approved Value
                };
            }

            const cost = parseFloat(q.totalCost) || 0;
            monthlyData[monthKey].totalQuotations += 1;
            monthlyData[monthKey].quotedValue += cost;

            if (q.status === 'Accepted') {
                // Find acceptance month if possible, else use creation month for simplicity in "Net Revenue" vs "Creation" alignment
                // For proper accounting, revenue should be recognized in approval month.
                // But for this graph "Month-wise revenue graph", aligning everything to creation month lets us see "How much of Jan's quotes converted?"
                // aligning to approval month lets us see "income in Jan".
                // Let's use Approval Month for Approved Value, Creation Month for Quoted Value.
                // This makes the graph slightly complex as X-axis is time.
                // Let's iterate again properly.
            }
        });

        // Re-do with proper month buckets for independent timelines
        const timeline = {}; // Key: YYYY-MM

        quotations.forEach(q => {
            // Quoted Value (Creation Date)
            const createdDate = new Date(q.createdAt);
            const createdMonth = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}`;
            if (!timeline[createdMonth]) timeline[createdMonth] = { quoted: 0, approved: 0, rejected: 0, count: 0 };

            const cost = parseFloat(q.totalCost) || 0;
            timeline[createdMonth].quoted += cost;
            timeline[createdMonth].count += 1;

            // Approved Value (Approval Date)
            if (q.status === 'Accepted') {
                let approvalDate = new Date(q.updatedAt);
                if (q.statusHistory && q.statusHistory.length > 0) {
                    const acceptedEntry = q.statusHistory
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .find(h => h.newStatus === 'Accepted');
                    if (acceptedEntry) approvalDate = new Date(acceptedEntry.createdAt);
                }
                const approvedMonth = `${approvalDate.getFullYear()}-${String(approvalDate.getMonth() + 1).padStart(2, '0')}`;
                if (!timeline[approvedMonth]) timeline[approvedMonth] = { quoted: 0, approved: 0, rejected: 0, count: 0 };
                timeline[approvedMonth].approved += cost;
            }

            // Rejected Value (Rejection Date)
            if (q.status === 'Rejected') {
                let rejectDate = new Date(q.updatedAt); // Simplification: use updatedAt for simplicity if history check is too heavy or similar to above
                if (q.statusHistory && q.statusHistory.length > 0) {
                    const rejectedEntry = q.statusHistory
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .find(h => h.newStatus === 'Rejected');
                    if (rejectedEntry) rejectDate = new Date(rejectedEntry.createdAt);
                }
                const rejectedMonth = `${rejectDate.getFullYear()}-${String(rejectDate.getMonth() + 1).padStart(2, '0')}`;
                if (!timeline[rejectedMonth]) timeline[rejectedMonth] = { quoted: 0, approved: 0, rejected: 0, count: 0 };
                timeline[rejectedMonth].rejected += cost;
            }
        });

        // Convert to array and sort
        const sortedMonths = Object.keys(timeline).sort();
        const data = sortedMonths.map(month => {
            const prevMonthIndex = sortedMonths.indexOf(month) - 1;
            const prevMonthData = prevMonthIndex >= 0 ? timeline[sortedMonths[prevMonthIndex]] : null;
            const growth = prevMonthData && prevMonthData.approved > 0
                ? ((timeline[month].approved - prevMonthData.approved) / prevMonthData.approved * 100).toFixed(1)
                : '0.0';

            return {
                month,
                ...timeline[month],
                netRevenue: timeline[month].approved,
                growth: `${growth}%`
            };
        });

        return data;
    };

    const revenueData = processRevenueData();

    // Overall Metrics
    const totalQuotedValue = quotations.reduce((sum, q) => sum + (parseFloat(q.totalCost) || 0), 0);
    const totalApprovedValue = quotations
        .filter(q => q.status === 'Accepted')
        .reduce((sum, q) => sum + (parseFloat(q.totalCost) || 0), 0);
    const approvedCount = quotations.filter(q => q.status === 'Accepted').length;
    const avgProjectValue = approvedCount > 0 ? totalApprovedValue / approvedCount : 0;

    // MoM Calculation (Last 2 months)
    const lastMonthIdx = revenueData.length - 1;
    const currentMonthRev = lastMonthIdx >= 0 ? revenueData[lastMonthIdx].approved : 0;
    const prevMonthRev = lastMonthIdx >= 1 ? revenueData[lastMonthIdx - 1].approved : 0;
    const momGrowth = prevMonthRev > 0
        ? ((currentMonthRev - prevMonthRev) / prevMonthRev * 100).toFixed(1)
        : '0.0';


    const downloadRevenueExcel = () => {
        const headers = ['Month', 'Total Quotations (Created)', 'Quoted Value', 'Approved Revenue', 'Rejected Value', 'Net Revenue', 'Growth %'];
        const rows = revenueData.map(d => [
            d.month,
            d.count,
            d.quoted,
            d.approved,
            d.rejected,
            d.netRevenue,
            d.growth
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(item => `"${item}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={downloadRevenueExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Download size={18} />
                    Download Revenue Report
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Quoted */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">Total Quoted Value</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(totalQuotedValue)}</h3>
                    <p className="text-xs text-slate-400 mt-1">All time</p>
                </div>

                {/* Total Approved */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">Total Approved Value</p>
                    <h3 className="text-3xl font-bold text-emerald-600 mt-2">{formatCurrency(totalApprovedValue)}</h3>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} /> Actual Revenue
                    </p>
                </div>

                {/* Avg Project Value */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">Avg. Project Value</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(avgProjectValue)}</h3>
                    <p className="text-xs text-slate-400 mt-1">Per approved quotation</p>
                </div>

                {/* MoM Growth */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-sm font-medium">Revenue Trend (MoM)</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className={`text-3xl font-bold ${parseFloat(momGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {parseFloat(momGrowth) > 0 ? '+' : ''}{momGrowth}%
                        </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">vs Previous Month</p>
                </div>
            </div>

            {/* Revenue Graph (Simple Bar Chart) */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Month-wise Revenue (Approved)</h3>

                {revenueData.length > 0 ? (
                    <div className="relative h-64 flex items-end justify-between gap-2 border-b border-slate-200 pb-4">
                        {revenueData.slice(-12).map((data, index) => { // Show last 12 months max
                            const maxVal = Math.max(...revenueData.map(d => d.approved));
                            const heightPercentage = maxVal > 0 ? (data.approved / maxVal) * 100 : 0;

                            return (
                                <div key={data.month} className="flex flex-col items-center flex-1 group">
                                    <div className="relative w-full flex justify-center items-end h-full">
                                        <div
                                            className="w-full max-w-[40px] bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-all relative group-hover:shadow-lg"
                                            style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                <div className="font-semibold">{data.month}</div>
                                                <div>Approved: {formatCurrency(data.approved)}</div>
                                                <div>Quoted: {formatCurrency(data.quoted)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 mt-2 rotate-45 origin-left translate-y-2 md:rotate-0 md:translate-y-0">{data.month}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400">
                        No revenue data available
                    </div>
                )}
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-700">Financial Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Month</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Total Quotations</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Quoted Value</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Approved Revenue</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Rejected Value</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Net Revenue</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Growth %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[...revenueData].reverse().map((row) => (
                                <tr key={row.month} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{row.month}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.count}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(row.quoted)}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(row.approved)}</td>
                                    <td className="px-6 py-4 text-sm text-red-500">{formatCurrency(row.rejected)}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatCurrency(row.netRevenue)}</td>
                                    <td className={`px-6 py-4 text-sm font-medium ${parseFloat(row.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {row.growth}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
