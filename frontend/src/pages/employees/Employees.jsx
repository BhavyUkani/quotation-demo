import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    MessageCircle,
    Building,
    MoreVertical,
    X,
    Briefcase
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import MessageBox from '../../components/common/MessageBox';
import StatsCard from '../../components/common/StatsCard';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const currentUser = user?.user || user;
    const canAssignMaster = currentUser?.role === 'Admin' || currentUser?.isMaster;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [openActionId, setOpenActionId] = useState(null);
    const [actionPosition, setActionPosition] = useState({ top: 0, left: 0 });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        whatsapp: '',
        address: '',
        departmentId: '',
        branchId: '',
        isMaster: false,
        permissions: []
    });

    const openEditSidebar = (emp) => {
        setEditingEmployee(emp);
        setFormData({
            name: emp.name,
            email: emp.email,
            password: '',
            phone: emp.phone,
            whatsapp: emp.whatsapp,
            address: emp.address,
            departmentId: emp.departmentId || '',
            branchId: emp.branchId || '',
            isMaster: emp.isMaster || false,
            permissions: Array.isArray(emp.permissions) ? emp.permissions : []
        });
        setIsSidebarOpen(true);
    };

    const openAddSidebar = () => {
        setEditingEmployee(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            whatsapp: '',
            address: '',
            departmentId: '',
            branchId: '',
            isMaster: false,
            permissions: []
        });
        setIsSidebarOpen(true);
    };

    const PERMISSIONS_LIST = [
        'Leads', 'Clients', 'Packages', 'Quotations', 'Reports',
        'Sites', 'Employees', 'Departments', 'Notifications', 'Branches', "Settings"
    ];

    const [branches, setBranches] = useState([]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [employeesRes, departmentsRes, branchesRes] = await Promise.all([
                api.get('/employees'),
                api.get('/departments'),
                api.get('/branches')
            ]);
            // Ensure permissions is parsed if it's a string (though axios usually handles JSON)
            const processedEmployees = employeesRes.data.map(e => ({
                ...e,
                permissions: typeof e.permissions === 'string' ? JSON.parse(e.permissions) : (e.permissions || [])
            }));
            setEmployees(processedEmployees);
            setDepartments(departmentsRes.data);
            setBranches(branchesRes ? branchesRes.data : []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => {
            const currentPermissions = prev.permissions || [];
            if (currentPermissions.includes(permission)) {
                return { ...prev, permissions: currentPermissions.filter(p => p !== permission) };
            } else {
                return { ...prev, permissions: [...currentPermissions, permission] };
            }
        });
    };

    const handleSelectAllPermissions = (e) => {
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, permissions: [...PERMISSIONS_LIST] }));
        } else {
            setFormData(prev => ({ ...prev, permissions: [] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                await api.put(`/employees/${editingEmployee.id}`, payload);
            } else {
                await api.post('/employees', formData);
            }
            fetchData();
            closeSidebar();
        } catch (err) {
            console.error('Error saving employee:', err);
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to save employee.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };



    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setEditingEmployee(null);
    };

    const deleteEmployee = (id) => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'warning',
            title: 'Delete Employee',
            message: 'Are you sure you want to delete this employee?',
            okButtonName: 'Delete',
            cancelButtonName: 'Cancel',
            onOk: async () => {
                try {
                    await api.delete(`/employees/${id}`);
                    setEmployees(employees.filter(e => e.id !== id));
                    closeMessageBox();
                } catch (err) {
                    console.error('Error deleting employee:', err);
                    closeMessageBox();
                    setMessageBoxConfig({
                        isOpen: true,
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to delete employee.',
                        onOk: closeMessageBox,
                        hideCancel: true
                    });
                }
            },
            onCancel: closeMessageBox
        });
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate stats
    const stats = {
        total: employees.length,
        ...departments.reduce((acc, dept) => {
            acc[dept.name.toLowerCase()] = employees.filter(e => e.departmentId === dept.id).length;
            return acc;
        }, {}),
        unassigned: employees.filter(e => !e.departmentId).length
    };

    const [departmentFilter, setDepartmentFilter] = useState('all');

    const filteredByDepartment = departmentFilter === 'all'
        ? filteredEmployees
        : departmentFilter === 'unassigned'
            ? filteredEmployees.filter(e => !e.departmentId)
            : filteredEmployees.filter(e => e.Department && e.Department.name.toLowerCase() === departmentFilter.toLowerCase());

    return (
        <>
            <div>
                {/* Stats Cards - Dynamic based on departments */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <StatsCard
                        title="Total"
                        count={stats.total}
                        icon={<User />}
                        color="bg-slate-500"
                    />
                    {departments.map((dept, idx) => (
                        <StatsCard
                            key={dept.id}
                            title={dept.name}
                            count={stats[dept.name.toLowerCase()] || 0}
                            icon={<Briefcase />}
                            color={
                                idx === 0 ? 'bg-red-500' :
                                    idx === 1 ? 'bg-purple-500' :
                                        idx === 2 ? 'bg-green-500' :
                                            idx === 3 ? 'bg-amber-500' :
                                                'bg-slate-500'
                            }
                        />
                    ))}
                    <StatsCard
                        title="Unassigned"
                        count={stats.unassigned}
                        icon={<User />}
                        color="bg-orange-500"
                    />
                </div>

                {/* Filters - Desktop */}
                < div className="hidden md:flex gap-2 flex-wrap mb-4" >
                    <button
                        onClick={() => setDepartmentFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${departmentFilter === 'all'
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        All ({stats.total})
                    </button>
                    {
                        departments.map((dept, idx) => (
                            <button
                                key={dept.id}
                                onClick={() => setDepartmentFilter(dept.name.toLowerCase())}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${departmentFilter === dept.name.toLowerCase()
                                    ? (idx === 0 ? 'bg-red-600 text-white' :
                                        idx === 1 ? 'bg-purple-600 text-white' :
                                            idx === 2 ? 'bg-green-600 text-white' :
                                                idx === 3 ? 'bg-amber-600 text-white' :
                                                    'bg-slate-600 text-white')
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {dept.name} ({stats[dept.name.toLowerCase()] || 0})
                            </button>
                        ))
                    }
                    <button
                        onClick={() => setDepartmentFilter('unassigned')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${departmentFilter === 'unassigned'
                            ? 'bg-slate-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        Unassigned ({stats.unassigned})
                    </button>
                </div >

                {/* Search Bar & Mobile Filter Trigger */}
                < div className="flex flex-col md:flex-row gap-2" >
                    <div className="relative flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search employees by name, email, or role..."
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
                        onClick={openAddSidebar}
                        className="hidden md:flex px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors items-center gap-2"
                    >
                        <Plus size={20} />
                        New Employee
                    </button>
                </div >

                {/* Mobile FAB */}
                < button
                    onClick={openAddSidebar}
                    className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center z-[90] transition-transform active:scale-95"
                >
                    <Plus size={28} />
                </button >

                {/* Mobile Filter Drawer */}
                {
                    isMobileFilterOpen && (
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
                                        onClick={() => { setDepartmentFilter('all'); setIsMobileFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${departmentFilter === 'all'
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-slate-50 text-slate-600 border border-slate-100'
                                            }`}
                                    >
                                        <span>All Employees</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${departmentFilter === 'all' ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'}`}>{stats.total}</span>
                                    </button>

                                    <div className="border-t border-slate-100 my-2"></div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">By Department</p>

                                    {departments.map((dept, idx) => (
                                        <button
                                            key={dept.id}
                                            onClick={() => { setDepartmentFilter(dept.name.toLowerCase()); setIsMobileFilterOpen(false); }}
                                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${departmentFilter === dept.name.toLowerCase()
                                                ? 'bg-red-50 text-red-700 border border-red-200'
                                                : 'bg-white border border-slate-200 text-slate-600'
                                                }`}
                                        >
                                            <span>{dept.name}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${departmentFilter === dept.name.toLowerCase() ? 'bg-red-200 text-red-800' : 'bg-slate-100 text-slate-500'}`}>{stats[dept.name.toLowerCase()] || 0}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setDepartmentFilter('unassigned'); setIsMobileFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex justify-between items-center ${departmentFilter === 'unassigned'
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-slate-50 text-slate-600 border border-slate-100'
                                            }`}
                                    >
                                        <span>Unassigned</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${departmentFilter === 'unassigned' ? 'bg-red-200 text-red-800' : 'bg-slate-200 text-slate-600'}`}>{stats.unassigned}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 mb-20 mt-6">
                    {filteredByDepartment.map((emp) => (
                        <div key={emp.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                        {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">{emp.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{emp.role || 'Employee'}</p>
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
                                        setOpenActionId(openActionId === emp.id ? null : emp.id);
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${openActionId === emp.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 mb-3 ml-1">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{emp.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-slate-400 shrink-0" />
                                    <span>{emp.phone}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="flex items-center bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                                        <Building size={14} className="mr-1.5 text-slate-400" />
                                        <span className="font-medium text-xs">{(emp.department || emp.Department)?.name || 'Unassigned'}</span>
                                    </div>
                                    {(emp.branch || emp.Branch) && (
                                        <div className="flex items-center bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                                            <Building size={14} className="mr-1.5 text-slate-400" />
                                            <span className="font-medium text-xs">{(emp.branch || emp.Branch).name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredByDepartment.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-slate-400 bg-white p-8 rounded-lg border border-slate-200">
                            <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <User size={24} />
                            </div>
                            <p className="text-lg font-medium text-slate-600">No employees found</p>
                        </div>
                    )}
                </div>

                {/* Employees Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden mt-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dept & Branch</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredByDepartment.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3 text-xs font-bold">
                                                    {emp.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                                                    <p className="text-xs text-slate-500">{emp.role || 'Employee'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {emp.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center bg-slate-50 px-2.5 py-1 rounded border border-slate-100 w-fit">
                                                    <Building size={13} className="mr-2 text-slate-400" />
                                                    <span className="font-medium">{(emp.department || emp.Department)?.name || 'Unassigned'}</span>
                                                </div>
                                                {(emp.branch || emp.Branch) && (
                                                    <div className="flex items-center text-xs text-slate-500 px-1">
                                                        <span className="text-slate-400 mr-1.5">Branch:</span>
                                                        <span className="font-medium text-slate-600">{(emp.branch || emp.Branch).name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 space-y-1">
                                                <div className="flex items-center" title="Phone">
                                                    <Phone size={14} className="mr-2 text-slate-400" />
                                                    {emp.phone}
                                                </div>
                                                {emp.whatsapp && (
                                                    <div className="flex items-center" title="WhatsApp">
                                                        <MessageCircle size={14} className="mr-2 text-green-500" />
                                                        {emp.whatsapp}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start text-sm text-slate-600">
                                                <MapPin size={14} className="mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                                                <span className="line-clamp-2 max-w-xs">{emp.address}</span>
                                            </div>
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
                                                        setOpenActionId(openActionId === emp.id ? null : emp.id);
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors ${openActionId === emp.id ? 'bg-slate-100 text-slate-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredByDepartment.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="bg-slate-50 p-4 rounded-full mb-3">
                                                    <User size={24} />
                                                </div>
                                                <p className="text-lg font-medium text-slate-600">No employees found</p>
                                                <p className="text-sm">Try adjusting your filters or search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >

            {/* Sidebar Overlay */}
            {
                isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={closeSidebar}
                    ></div>
                )
            }

            {/* Sidebar / Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">
                            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <button onClick={closeSidebar} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        placeholder="employee@tattvix.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="password"
                                            name="password"
                                            required={!editingEmployee} // Required only for new employees
                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                            placeholder={editingEmployee ? "Leave blank to keep current" : "Set password"}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select
                                    name="departmentId"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                                    value={formData.departmentId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        placeholder="+1 (555) ..."
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        placeholder="+1 (555) ..."
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                                    placeholder="Enter full address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            {canAssignMaster && (
                                <div>
                                    {(() => {
                                        const totalMasters = employees.filter(e => e.isMaster).length;
                                        const isLastMaster = editingEmployee?.isMaster && totalMasters <= 1;

                                        return (
                                            <label className={`flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-lg border border-slate-200 transition-colors ${isLastMaster ? 'opacity-75 cursor-not-allowed' : 'hover:bg-slate-100'}`}>
                                                <input
                                                    type="checkbox"
                                                    name="isMaster"
                                                    className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500 disabled:opacity-50"
                                                    checked={formData.isMaster}
                                                    onChange={(e) => {
                                                        if (!isLastMaster) {
                                                            setFormData({ ...formData, isMaster: e.target.checked });
                                                        }
                                                    }}
                                                    disabled={isLastMaster}
                                                />
                                                <div>
                                                    <span className="block text-sm font-medium text-slate-800">
                                                        Master Employee
                                                        {isLastMaster && <span className="text-red-500 text-xs ml-2 font-bold">(Cannot remove: System requires at least one master)</span>}
                                                    </span>
                                                    <span className="block text-xs text-slate-500">Grants full access to all branches and features</span>
                                                </div>
                                            </label>
                                        );
                                    })()}
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700">Page Permissions</label>
                                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                                            checked={formData.permissions?.length === PERMISSIONS_LIST.length}
                                            onChange={handleSelectAllPermissions}
                                        />
                                        <span className="text-xs font-semibold text-red-600">Select All Permissions</span>
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    {PERMISSIONS_LIST.map(permission => (
                                        <label key={permission} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors select-none">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                                                checked={formData.permissions?.includes(permission)}
                                                onChange={() => handlePermissionChange(permission)}
                                            />
                                            <span className="text-sm text-slate-700">{permission}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeSidebar}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                                >
                                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
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
                                    const emp = employees.find(e => e.id === openActionId);
                                    if (!emp) return null;
                                    return (
                                        <>
                                            <button
                                                onClick={() => {
                                                    openEditSidebar(emp);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
                                            >
                                                <Edit2 size={16} className="mr-3" />
                                                Edit Employee
                                            </button>
                                            <div className="border-t border-slate-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    deleteEmployee(emp.id);
                                                    setOpenActionId(null);
                                                }}
                                                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 size={16} className="mr-3" />
                                                Delete Employee
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
        </>
    );
};

export default Employees;
