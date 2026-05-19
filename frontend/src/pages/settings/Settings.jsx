import React, { useState } from 'react';
import {
    User,
    Lock,
    Bell,
    Shield,
    Smartphone,
    Mail,
    Save,
    Moon,
    Sun,
    Monitor,
    Globe,
    Database,
    Download,
    Camera,
    Palette,
    ToggleLeft,
    MonitorSmartphone,
    Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import MessageBox from '../../components/common/MessageBox';

const Settings = () => {
    const { user } = useAuth();
    const currentUser = user?.user || user;
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || '',
        bio: 'Senior Project Manager at Tattvix Construction.'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        projectUpdates: true,
        teamMentions: true
    });

    const [appearance, setAppearance] = useState({
        theme: 'light', // light, dark, system
        density: 'comfortable', // comfortable, compact
        fontSize: 'medium' // small, medium, large
    });

    const [systemSettings, setSystemSettings] = useState({
        language: 'en-US',
        timezone: 'Asia/Kolkata',
        autoSave: true
    });

    const [messageBoxConfig, setMessageBoxConfig] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onOk: null,
        hideCancel: true
    });

    const closeMessageBox = () => {
        setMessageBoxConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/user/profile', profileData);
            setMessageBoxConfig({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: 'Profile updated successfully!',
                onOk: closeMessageBox,
                hideCancel: true
            });
        } catch (error) {
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: error.response?.data?.error || 'Failed to update profile.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'New passwords do not match.',
                onOk: closeMessageBox,
                hideCancel: true
            });
            return;
        }

        try {
            await api.put('/user/password', passwordData);
            setMessageBoxConfig({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: 'Password updated successfully!',
                onOk: closeMessageBox,
                hideCancel: true
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessageBoxConfig({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: error.response?.data?.error || 'Failed to update password.',
                onOk: closeMessageBox,
                hideCancel: true
            });
        }
    };

    const handleSavePreferences = () => {
        setMessageBoxConfig({
            isOpen: true,
            type: 'success',
            title: 'Saved',
            message: 'Preferences saved successfully.',
            onOk: closeMessageBox,
            hideCancel: true
        });
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User, description: 'Manage your personal info' },
        { id: 'security', label: 'Login & Security', icon: Shield, description: 'Password and security settings' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Choose how you communicate' },

    ];

    return (
        <div className="max-w mx-auto pb-10">


            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</h3>
                        </div>
                        <div className="p-2 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${activeTab === tab.id
                                            ? 'bg-red-50 text-red-700 shadow-sm ring-1 ring-red-200'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-white text-red-600 shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'
                                            }`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{tab.label}</div>
                                            <div className={`text-xs ${activeTab === tab.id ? 'text-red-500/80' : 'text-slate-400'}`}>
                                                {tab.description}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="divide-y divide-slate-100">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">Profile Information</h2>
                                            <p className="text-sm text-slate-500 mt-1">Update your photo and personal details.</p>
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 font-medium flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                    </div>

                                    {/* Avatar Section */}


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    readOnly
                                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-slate-700">Job Title</label>
                                            <input
                                                type="text"
                                                defaultValue="Senior Manager"
                                                readOnly
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-1.5">
                                        <label className="block text-sm font-semibold text-slate-700">Bio</label>
                                        <textarea
                                            rows="3"
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-slate-700 resize-none"
                                            placeholder="Tell us a little about yourself..."
                                        ></textarea>
                                        <p className="text-xs text-slate-400 text-right">0/500 characters</p>
                                    </div>

                                    <div className="mt-6 space-y-1.5">
                                        <label className="block text-sm font-semibold text-slate-700">Address</label>
                                        <textarea
                                            rows="2"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all font-medium text-slate-700 resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordUpdate} className="divide-y divide-slate-100">
                                <div className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">Login & Security</h2>
                                        <p className="text-sm text-slate-500 mt-1">Manage your password and security preferences.</p>
                                    </div>

                                    <div className="max-w-2xl space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-slate-800">Change Password</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                        <input
                                                            type="password"
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                            <input
                                                                type="password"
                                                                value={passwordData.newPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                            <input
                                                                type="password"
                                                                value={passwordData.confirmPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-8 py-5 bg-slate-50 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 font-medium flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="divide-y divide-slate-100">
                                <div className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-800">Notification Preferences</h2>
                                        <p className="text-sm text-slate-500 mt-1">Choose what you want to be notified about.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                category: "Communication",
                                                items: [
                                                    { id: 'emailAlerts', label: 'Email Alerts', desc: 'Receive daily summaries and critical alerts via email.' },
                                                    { id: 'pushNotifications', label: 'Push Notifications', desc: 'Get real-time updates on your desktop or mobile.' },
                                                    { id: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive updates about new features and promotions.' },
                                                ]
                                            },
                                        ].map((section, idx) => (
                                            <div key={idx}>
                                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{section.category}</h4>
                                                <div className="space-y-3">
                                                    {section.items.map((item) => (
                                                        <label key={item.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-red-100 hover:shadow-sm transition-all cursor-pointer group">
                                                            <div>
                                                                <h4 className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">{item.label}</h4>
                                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                                            </div>
                                                            <div className="relative inline-flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={notifications[item.id] || false}
                                                                    onChange={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id] })}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-8 py-5 bg-slate-50 flex justify-end">
                                    <button
                                        onClick={handleSavePreferences}
                                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 font-medium flex items-center gap-2"
                                    >
                                        <Save size={18} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}




                    </div>
                </div>
            </div>
            <MessageBox
                isOpen={messageBoxConfig.isOpen}
                type={messageBoxConfig.type}
                title={messageBoxConfig.title}
                message={messageBoxConfig.message}
                onOk={messageBoxConfig.onOk}
                hideCancel={messageBoxConfig.hideCancel}
            />
        </div>
    );
};

export default Settings;
