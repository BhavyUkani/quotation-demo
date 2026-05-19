import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    FileText, CheckCircle, Clock, XCircle, DollarSign, TrendingUp,
    Users, Activity, AlertTriangle, Plus, Copy, BarChart2, Briefcase, UserPlus, Repeat, HardDrive,
    IndianRupee, Building, Percent, Construction, WifiOff, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';


const COLORS = ['#94a3b8', '#3b82f6', '#10b981', '#ef4444'];

const DashboardHome = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(null);
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Overview Cards Shimmer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 h-32">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 w-1/2">
                                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                                    <div className="h-8 bg-slate-200 rounded w-full"></div>
                                </div>
                                <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Financial Overview Shimmer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 h-48">
                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                            </div>
                        ))}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-24"></div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 h-24"></div>
                    </div>
                    {/* Pie Chart Shimmer */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 h-full min-h-[300px] flex flex-col items-center justify-center">
                        <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
                        <div className="h-40 w-40 rounded-full bg-slate-200 border-4 border-white"></div>
                    </div>
                </div>

                {/* Monthly Trend Chart Shimmer */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 h-96">
                    <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
                    <div className="h-64 bg-slate-200 rounded w-full"></div>
                </div>

                {/* Bottom Section Shimmer */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 h-96">
                        <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-16 bg-slate-50 rounded-lg w-full"></div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-slate-200 h-96">
                        <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-slate-50 rounded-lg w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] p-6">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <WifiOff size={64} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Connection Lost</h3>
                <p className="text-slate-500 mb-8 max-w-sm text-center">
                    We couldn't connect to the server. Please check your internet connection and try again.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-slate-200"
                >
                    <RefreshCw size={20} />
                    Try Again
                </button>
            </div>
        );
    }

    if (!stats) {
        return <div className="text-center p-8 text-slate-500">Failed to load dashboard data.</div>;
    }

    const { quotations, financials, charts, clients, activity, actionCenter, overview } = stats;

    const pieData = [
        { name: 'Draft', value: quotations.draft },
        { name: 'Sent', value: quotations.sent },
        { name: 'Accepted', value: quotations.approved },
        { name: 'Rejected', value: quotations.rejected },
    ];

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="space-y-6">

            {/* Overview Cards */}
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatusCard
                    title="Total Quotations"
                    value={overview.totalQuotations}
                    icon={FileText}
                    bgColor="bg-blue-50"
                    textColor="text-blue-600"
                />
                <StatusCard
                    title="Total Leads"
                    value={overview.totalLeads}
                    icon={Users}
                    bgColor="bg-orange-50"
                    textColor="text-orange-600"
                />
                <StatusCard
                    title="Total Clients"
                    value={overview.totalClients}
                    icon={Briefcase}
                    bgColor="bg-green-50"
                    textColor="text-green-600"
                />
                <StatusCard
                    title="Running Sites"
                    value={overview.runningSitesCount}
                    icon={Construction}
                    bgColor="bg-purple-50"
                    textColor="text-purple-600"
                />
                <StatusCard
                    title="Site Expenses"
                    value={formatCurrency(overview.runningSitesExpense)}
                    icon={IndianRupee}
                    bgColor="bg-rose-50"
                    textColor="text-rose-600"
                />
                <StatusCard
                    title="Lead Conv. Ratio"
                    value={`${overview.leadConversionRatio || 0}%`}
                    icon={Percent}
                    bgColor="bg-teal-50"
                    textColor="text-teal-600"
                />
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Financial Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <IndianRupee size={80} />
                        </div>
                        <h3 className="text-slate-500 font-medium mb-2">Total Quotation Value</h3>
                        <p className="text-3xl font-bold text-slate-800">{formatCurrency(financials.totalValue)}</p>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <TrendingUp size={16} className="mr-1" />
                            <span>All time</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Activity size={80} />
                        </div>
                        <h3 className="text-slate-500 font-medium mb-2">This Month's Revenue</h3>
                        <p className="text-3xl font-bold text-slate-800">{formatCurrency(financials.thisMonthRevenue)}</p>
                        <div className="mt-4 flex items-center text-sm text-slate-500">
                            <span>From approved quotations</span>
                        </div>
                    </div>

                    {/* Additional Financial Metrics */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Total Estimated Cost</h4>
                        <p className="text-xl font-bold text-slate-700">{formatCurrency(financials.totalEstimatedCost)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Expected Profit (Approx)</h4>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(financials.expectedProfit)}</p>
                    </div>
                </div>

                {/* Pie Chart: Approval Ratio */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-slate-700 font-bold mb-4 w-full text-left">Quotation Status</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Quotation Trend</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={charts.monthlyTrend}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client Insights */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <Users className="mr-2 text-red-600" size={20} />
                            Client Insights
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded text-red-600 mr-3">
                                        <Briefcase size={16} />
                                    </div>
                                    <span className="text-slate-600 font-medium">Total Clients</span>
                                </div>
                                <span className="text-lg font-bold text-slate-800">{clients.total}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded text-green-600 mr-3">
                                        <UserPlus size={16} />
                                    </div>
                                    <span className="text-slate-600 font-medium">New This Month</span>
                                </div>
                                <span className="text-lg font-bold text-slate-800">{clients.newThisMonth}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded text-purple-600 mr-3">
                                        <Repeat size={16} />
                                    </div>
                                    <span className="text-slate-600 font-medium">Repeat Clients</span>
                                </div>
                                <span className="text-lg font-bold text-slate-800">{clients.repeat}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Top Clients by Value</h3>
                        <div className="overflow-y-auto max-h-60 space-y-3">
                            {clients.top5.length > 0 ? (
                                clients.top5.map((client, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">{client.client?.name || 'Unknown'}</span>
                                            <span className="text-xs text-slate-500">Rank #{idx + 1}</span>
                                        </div>
                                        <span className="font-bold text-slate-800 text-sm">{formatCurrency(client.totalValue)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">No data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Action Center */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                        <AlertTriangle className="mr-2 text-orange-500" size={20} />
                        Pending Action Center
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 border border-orange-100 bg-orange-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-orange-800 font-medium">Pending Approvals</span>
                                <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-bold">
                                    {actionCenter.pendingApprovals}
                                </span>
                            </div>
                            <p className="text-xs text-orange-600">Quotations sent but not accepted.</p>
                        </div>

                        <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-red-800 font-medium">Expiring Soon</span>
                                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                                    {actionCenter.expiring}
                                </span>
                            </div>
                            <p className="text-xs text-red-600">Quotations expiring in next 7 days.</p>
                        </div>

                        <div className="p-4 border border-red-100 bg-red-50 rounded-lg h-24 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-red-800 font-medium">High Value Deals</span>
                                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                                    {actionCenter.highValueDetails}
                                </span>
                            </div>
                            <p className="text-xs text-red-600">Pending deals over ₹1,00,000</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                    <Clock className="mr-2 text-slate-400" size={20} />
                    Recent Activity
                </h3>
                <div className="space-y-6">
                    {activity.length > 0 ? (
                        activity.map((item, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full ${item.type === 'created' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="text-sm font-medium text-slate-800">{item.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500">No recent activity.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, value, icon: Icon, bgColor, textColor }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${bgColor} ${textColor}`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

export default DashboardHome;
