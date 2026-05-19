# Frontend Restructuring Plan

## New Folder Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx ✅
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── MainLayout.jsx
│   ├── common/
│   │   ├── LoadingSpinner.jsx
│   │   └── EmptyState.jsx
│   └── quotations/
│       └── QuotationForm.jsx
├── contexts/
│   └── AuthContext.jsx ✅
├── pages/
│   ├── auth/
│   │   └── Login.jsx
│   ├── dashboard/
│   │   └── DashboardHome.jsx
│   ├── leads/
│   │   └── Leads.jsx
│   ├── clients/
│   │   └── Clients.jsx
│   ├── packages/
│   │   ├── Packages.jsx
│   │   └── PackageView.jsx
│   ├── quotations/
│   │   ├── Quotations.jsx
│   │   └── QuotationDetails.jsx
│   ├── employees/
│   │   └── Employees.jsx
│   ├── departments/
│   │   └── Departments.jsx
│   └── notifications/
│       └── Notifications.jsx
├── api/
│   └── axios.js
├── App.jsx
└── main.jsx
```

## Components to Create

### 1. Layout Components

#### Sidebar.jsx
- Extract sidebar from Dashboard.jsx
- Props: menuItems, unreadCount, onClose (for mobile)
- Handles navigation links
- Shows logo and menu items

#### Header.jsx
- Extract header from Dashboard.jsx
- Props: user, onLogout, pageTitle, pageDescription
- Shows mobile menu button
- Shows user profile dropdown
- Dynamic page title based on route

#### MainLayout.jsx
- Combines Sidebar + Header + Content area
- Wraps all dashboard pages
- Handles sidebar state (open/close)
- Provides consistent layout

### 2. Auth Components

#### ProtectedRoute.jsx ✅
- Already created
- Checks authentication
- Shows loading state
- Redirects to login if not authenticated

### 3. Common Components

#### LoadingSpinner.jsx
- Reusable loading spinner
- Used across the app

#### EmptyState.jsx
- Reusable empty state component
- Props: icon, title, description

### 4. Context

#### AuthContext.jsx ✅
- Already created
- Manages user state
- Provides login/logout functions
- Checks authentication status

## Migration Steps

### Phase 1: Create Core Components ✅
1. ✅ Create AuthContext
2. ✅ Create ProtectedRoute
3. Create Sidebar component
4. Create Header component
5. Create MainLayout component

### Phase 2: Create Common Components
1. Create LoadingSpinner
2. Create EmptyState

### Phase 3: Move Pages to Folders
1. Move Login to pages/auth/
2. Create DashboardHome (extract from Dashboard.jsx)
3. Move Leads to pages/leads/
4. Move Clients to pages/clients/
5. Move Packages to pages/packages/
6. Move Quotations to pages/quotations/
7. Move Employees to pages/employees/
8. Move Departments to pages/departments/
9. Move Notifications to pages/notifications/

### Phase 4: Update App.jsx
1. Wrap with AuthProvider
2. Update imports
3. Use MainLayout for dashboard routes
4. Update route structure

### Phase 5: Testing
1. Test login flow
2. Test protected routes
3. Test navigation
4. Test all pages

## Benefits

1. **Better Organization**: Clear separation of concerns
2. **Reusability**: Components can be reused
3. **Maintainability**: Easier to find and update code
4. **Security**: Centralized auth logic
5. **Scalability**: Easy to add new features
6. **Type Safety**: Better for future TypeScript migration

## Current Status

- ✅ AuthContext created
- ✅ ProtectedRoute created
- ⏳ Layout components (next)
- ⏳ Common components
- ⏳ Page reorganization
- ⏳ App.jsx update
