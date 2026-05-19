import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PermissionGuard = ({ permission, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // or a loading spinner
    }

    // Default to empty array if permissions not found
    // Also handle nested user object issue if present (user.user)
    const currentUser = user?.user || user;
    const userPermissions = currentUser?.permissions || [];
    const userRole = currentUser?.role;

    // Admin has access to everything
    // If no permission specified, allow access
    // If user has the specific permission, allow access
    if (!permission || userRole === 'Admin' || userPermissions.includes(permission)) {
        return children;
    }

    // Redirect to dashboard (or a dedicated unauth page if desired)
    // If ensuring dashboard access is always allowed or handled separately
    return <Navigate to="/dashboard" replace />;
};

export default PermissionGuard;
