import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import api from '../../api/axios';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop state
    const [unreadCount, setUnreadCount] = useState(0);


    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                unreadCount={unreadCount}
            />

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
                {/* Header */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                <div className="flex-1 p-2 lg:p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
