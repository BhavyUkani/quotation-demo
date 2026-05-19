import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, User, Users, Briefcase, UserPlus, Filter, X, MoreVertical, Clock } from 'lucide-react';
import ReactDOM from 'react-dom';
import api from '../../api/axios';
import StatsCard from '../../components/common/StatsCard';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, lead, client, employee
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'lead_created':
            case 'lead_updated':
            case 'lead_converted':
                return <User className="text-red-600" size={20} />;
            case 'client_created':
            case 'client_updated':
                return <Briefcase className="text-green-600" size={20} />;
            case 'employee_created':
            case 'employee_updated':
            case 'employee_password_changed':
                return <UserPlus className="text-purple-600" size={20} />;
            default:
                return <Bell className="text-gray-600" size={20} />;
        }
    };

    const getTypeColor = (type) => {
        if (type.startsWith('lead')) return 'bg-red-100 text-red-800';
        if (type.startsWith('client')) return 'bg-green-100 text-green-800';
        if (type.startsWith('employee')) return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type) => {
        const labels = {
            'lead_created': 'Lead',
            'lead_updated': 'Lead',
            'lead_converted': 'Lead',
            'client_created': 'Client',
            'client_updated': 'Client',
            'employee_created': 'Employee',
            'employee_updated': 'Employee',
            'employee_password_changed': 'Employee'
        };
        return labels[type] || 'System';
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.relatedType === filter);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Calculate stats
    const stats = {
        total: notifications.length,
        unread: unreadCount,
        leads: notifications.filter(n => n.relatedType === 'lead').length,
        clients: notifications.filter(n => n.relatedType === 'client').length,
        employees: notifications.filter(n => n.relatedType === 'employee').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <StatsCard
                    title="Total"
                    count={stats.total}
                    icon={<Bell />}
                    color="bg-slate-500"
                />
                <StatsCard
                    title="Unread"
                    count={stats.unread}
                    icon={<Bell />}
                    color="bg-red-500"
                />
                <StatsCard
                    title="Leads"
                    count={stats.leads}
                    icon={<User />}
                    color="bg-red-500"
                />
                <StatsCard
                    title="Clients"
                    count={stats.clients}
                    icon={<Briefcase />}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Employees"
                    count={stats.employees}
                    icon={<UserPlus />}
                    color="bg-purple-500"
                />
            </div>

            {/* Filters and Actions - Desktop */}
            <div className="hidden md:flex gap-2 flex-wrap mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('lead')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'lead'
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    Leads ({stats.leads})
                </button>
                <button
                    onClick={() => setFilter('client')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'client'
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    Clients ({stats.clients})
                </button>
                <button
                    onClick={() => setFilter('employee')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'employee'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                >
                    Employees ({stats.employees})
                </button>
                <div className="flex-1"></div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <CheckCheck size={18} />
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Mobile Header Actions */}
            <div className="md:hidden flex gap-2 mb-6">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <Filter size={18} />
                    Filters
                </button>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCheck size={18} />
                        Mark Read
                    </button>
                )}
            </div>

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
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">By Type</p>
                            <button
                                onClick={() => { setFilter('all'); setIsMobileFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${filter === 'all'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-slate-50 text-slate-600 border border-slate-100'
                                    }`}
                            >
                                <span>All Notifications</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'all' ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'}`}>{stats.total}</span>
                            </button>
                            <button
                                onClick={() => { setFilter('lead'); setIsMobileFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${filter === 'lead'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-white border border-slate-200 text-slate-600'
                                    }`}
                            >
                                <span>Leads</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'lead' ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-500'}`}>{stats.leads}</span>
                            </button>
                            <button
                                onClick={() => { setFilter('client'); setIsMobileFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${filter === 'client'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-white border border-slate-200 text-slate-600'
                                    }`}
                            >
                                <span>Clients</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'client' ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-500'}`}>{stats.clients}</span>
                            </button>
                            <button
                                onClick={() => { setFilter('employee'); setIsMobileFilterOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${filter === 'employee'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-white border border-slate-200 text-slate-600'
                                    }`}
                            >
                                <span>Employees</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'employee' ? 'bg-purple-200 text-purple-800' : 'bg-slate-100 text-slate-500'}`}>{stats.employees}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 mb-20 mt-6">
                {filteredNotifications.map((notification) => (
                    <div key={notification.id} className={`bg-white p-4 rounded-lg border shadow-sm relative ${!notification.isRead ? 'border-red-200 bg-red-50/10' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getTypeColor(notification.type)}`}>
                                    {getTypeLabel(notification.type)}
                                </span>
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
                                    setOpenActionId(openActionId === notification.id ? null : notification.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${openActionId === notification.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <h3 className={`text-sm font-bold mb-1.5 ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notification.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                            {notification.message}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
                            <Clock size={12} />
                            <span>
                                {new Date(notification.createdAt).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                {filteredNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Bell size={24} />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No Notifications</p>
                    </div>
                )}
            </div>

            {/* Notifications Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notification</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredNotifications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                <Bell size={32} />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No Notifications</p>
                                            <p className="text-sm">You're all caught up!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredNotifications.map((notification) => (
                                    <tr
                                        key={notification.id}
                                        className={`hover:bg-slate-50/80 transition-colors ${!notification.isRead ? 'bg-red-50/30' : ''}`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-slate-100' : 'bg-white border border-red-200'}`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                                    {getTypeLabel(notification.type)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xl">
                                                <h3 className={`text-sm font-semibold mb-0.5 ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-snug">
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-500">
                                                {new Date(notification.createdAt).toLocaleString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Mark as Read"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Action Menu Portal */}
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
                                    const notification = notifications.find(n => n.id === openActionId);
                                    if (!notification) return null;
                                    return (
                                        <>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => {
                                                        markAsRead(notification.id);
                                                        setOpenActionId(null);
                                                    }}
                                                    className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-green-600 transition-colors"
                                                >
                                                    <Check size={16} className="mr-3" />
                                                    Mark as Read
                                                </button>
                                            )}
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deleteNotification(notification.id);
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
        </div>
    );
};

export default Notifications;
