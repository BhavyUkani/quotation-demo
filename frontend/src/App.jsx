import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PermissionGuard from './components/auth/PermissionGuard';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Leads from './pages/Lead/Leads';
import Clients from './pages/clients/Clients';
import Packages from './pages/packages/Packages';
import PackageView from './pages/packages/PackageView';
import Quotations from './pages/quotations/Quotations';
import QuotationView from './pages/quotations/QuotationView';
import QuotationDetails from './pages/quotations/QuotationDetails';
import Employees from './pages/employees/Employees';
import Departments from './pages/departments/Departments';
import Branches from './pages/branches/Branches';
import Notifications from './pages/notifications/Notifications';
import Sites from './pages/sites/Sites';
import SiteView from './pages/sites/SiteView';
import Reports from './pages/Reports/Reports';
import Settings from './pages/settings/Settings';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Dashboard Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Nested Dashboard Routes */}
                        <Route index element={<DashboardHome />} />
                        <Route path="leads" element={
                            <PermissionGuard permission="Leads">
                                <Leads />
                            </PermissionGuard>
                        } />
                        <Route path="clients" element={
                            <PermissionGuard permission="Clients">
                                <Clients />
                            </PermissionGuard>
                        } />
                        <Route path="packages" element={
                            <PermissionGuard permission="Packages">
                                <Packages />
                            </PermissionGuard>
                        } />
                        <Route path="packages/:id" element={
                            <PermissionGuard permission="Packages">
                                <PackageView />
                            </PermissionGuard>
                        } />
                        <Route path="quotations" element={
                            <PermissionGuard permission="Quotations">
                                <Quotations />
                            </PermissionGuard>
                        } />
                        <Route path="quotations/new" element={
                            <PermissionGuard permission="Quotations">
                                <QuotationDetails />
                            </PermissionGuard>
                        } />
                        <Route path="quotations/view/:id" element={
                            <PermissionGuard permission="Quotations">
                                <QuotationView />
                            </PermissionGuard>
                        } />
                        <Route path="quotations/edit/:id" element={
                            <PermissionGuard permission="Quotations">
                                <QuotationDetails />
                            </PermissionGuard>
                        } />
                        <Route path="employees" element={
                            <PermissionGuard permission="Employees">
                                <Employees />
                            </PermissionGuard>
                        } />
                        <Route path="departments" element={
                            <PermissionGuard permission="Departments">
                                <Departments />
                            </PermissionGuard>
                        } />
                        <Route path="branches" element={<Branches />} />
                        <Route path="notifications" element={
                            <PermissionGuard permission="Notifications">
                                <Notifications />
                            </PermissionGuard>
                        } />

                        {/* Placeholder routes */}
                        <Route path="reports" element={
                            <PermissionGuard permission="Reports">
                                <Reports />
                            </PermissionGuard>
                        } />
                        <Route path="sites" element={
                            <PermissionGuard permission="Sites">
                                <Sites />
                            </PermissionGuard>
                        } />
                        <Route path="sites/:id" element={
                            <PermissionGuard permission="Sites">
                                <SiteView />
                            </PermissionGuard>
                        } />
                        <Route path="settings" element={<Settings />} />

                        {/* Catch all for dashboard */}
                        <Route path="*" element={<div className="p-8">Page not found</div>} />
                    </Route>

                    {/* Root redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Catch all redirect to login */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
