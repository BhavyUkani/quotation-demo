# Frontend Architecture - Visual Guide

## 🏗️ Component Hierarchy

```
App (with AuthProvider)
│
├── Login Page (Public)
│   └── Login Form
│
└── Dashboard (Protected)
    └── MainLayout
        ├── Sidebar
        │   ├── Logo
        │   ├── Navigation Menu
        │   │   ├── Dashboard
        │   │   ├── Leads
        │   │   ├── Clients
        │   │   ├── Packages
        │   │   ├── Quotations
        │   │   ├── Reports
        │   │   ├── Site
        │   │   ├── Employees
        │   │   ├── Departments
        │   │   ├── Notifications (with badge)
        │   │   └── Settings
        │   └── Footer
        │
        ├── Header
        │   ├── Mobile Menu Button
        │   ├── Page Title (Dynamic)
        │   ├── Page Description (Dynamic)
        │   ├── Notifications Icon
        │   └── User Profile Dropdown
        │       ├── User Info
        │       ├── Settings Link
        │       └── Logout Button
        │
        └── Content Area (Outlet)
            ├── DashboardHome
            ├── Leads
            ├── Clients
            ├── Packages
            ├── Quotations
            ├── Employees
            ├── Departments
            └── Notifications
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     AuthContext                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  State:                                           │  │
│  │  - user                                           │  │
│  │  - isAuthenticated                                │  │
│  │  - loading                                        │  │
│  │                                                    │  │
│  │  Methods:                                         │  │
│  │  - login(email, password)                         │  │
│  │  - logout()                                       │  │
│  │  - checkAuth()                                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
        ┌─────────────────────────────────┐
        │      ProtectedRoute             │
        │  ┌───────────────────────────┐  │
        │  │  if (loading)             │  │
        │  │    → Show Loading         │  │
        │  │  if (!isAuthenticated)    │  │
        │  │    → Redirect to Login    │  │
        │  │  else                     │  │
        │  │    → Render Children      │  │
        │  └───────────────────────────┘  │
        └─────────────────────────────────┘
                          │
                          ↓
        ┌─────────────────────────────────┐
        │         MainLayout              │
        │  ┌───────────────────────────┐  │
        │  │  - Sidebar (navigation)   │  │
        │  │  - Header (user info)     │  │
        │  │  - Content (pages)        │  │
        │  └───────────────────────────┘  │
        └─────────────────────────────────┘
```

## 🎨 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser Window                       │
│  ┌────────────┬──────────────────────────────────────────┐  │
│  │            │  Header                                   │  │
│  │            │  ┌──────────────────────────────────────┐ │  │
│  │            │  │ [☰] Page Title | [🔔] [👤 User ▼]   │ │  │
│  │            │  └──────────────────────────────────────┘ │  │
│  │  Sidebar   │                                           │  │
│  │  ┌──────┐  │  Content Area                            │  │
│  │  │  T   │  │  ┌──────────────────────────────────────┐│  │
│  │  │Tattvix│ │  │                                      ││  │
│  │  └──────┘  │  │  Page Content Here                   ││  │
│  │            │  │  (Leads, Clients, etc.)              ││  │
│  │  [Dashboard]  │                                      ││  │
│  │  [Leads]   │  │                                      ││  │
│  │  [Clients] │  │                                      ││  │
│  │  [Packages]│  │                                      ││  │
│  │  ...       │  │                                      ││  │
│  │            │  │                                      ││  │
│  │  © Tattvix │  └──────────────────────────────────────┘│  │
│  └────────────┴──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
User Opens App
      │
      ↓
  Check Token
      │
      ├─── Token Exists ──→ Verify Token ──┬─── Valid ──→ Load Dashboard
      │                                     │
      │                                     └─── Invalid ──→ Show Login
      │
      └─── No Token ──────────────────────────────────────→ Show Login
                                                                  │
                                                                  ↓
                                                            User Enters Credentials
                                                                  │
                                                                  ↓
                                                            POST /auth/login
                                                                  │
                                                                  ├─── Success ──→ Save Token
                                                                  │                    │
                                                                  │                    ↓
                                                                  │              Set Auth State
                                                                  │                    │
                                                                  │                    ↓
                                                                  │              Navigate to Dashboard
                                                                  │
                                                                  └─── Failure ──→ Show Error Message
```

## 📱 Responsive Behavior

### Desktop (≥1024px)
```
┌─────────────────────────────────────────┐
│  [Sidebar Always Visible] [Content]     │
│  Fixed 256px width        Flexible      │
└─────────────────────────────────────────┘
```

### Mobile (<1024px)
```
┌─────────────────────────────────────────┐
│  [☰] Header                             │
│  ─────────────────────────────────────  │
│  Content (Full Width)                   │
│                                         │
│  Sidebar: Hidden by default             │
│  Opens as overlay when [☰] clicked      │
└─────────────────────────────────────────┘
```

## 🎯 Component Responsibilities

### AuthContext
- ✅ Manage user authentication state
- ✅ Handle login/logout
- ✅ Store and validate tokens
- ✅ Provide auth state to all components

### ProtectedRoute
- ✅ Check if user is authenticated
- ✅ Show loading while checking
- ✅ Redirect to login if not authenticated
- ✅ Render protected content if authenticated

### MainLayout
- ✅ Provide consistent layout structure
- ✅ Manage sidebar open/close state
- ✅ Fetch and display notification count
- ✅ Render child pages in content area

### Sidebar
- ✅ Display navigation menu
- ✅ Highlight active route
- ✅ Show notification badge
- ✅ Handle mobile overlay
- ✅ Close on navigation (mobile)

### Header
- ✅ Show dynamic page title
- ✅ Display user information
- ✅ Provide logout functionality
- ✅ Show mobile menu button
- ✅ Handle user dropdown

## 🔄 State Management

### Global State (AuthContext)
```javascript
{
  user: {
    id: "uuid",
    name: "John Doe",
    email: "john@example.com",
    role: "admin"
  },
  isAuthenticated: true,
  loading: false
}
```

### Local State (MainLayout)
```javascript
{
  isSidebarOpen: true,
  unreadCount: 5
}
```

### Local State (Header)
```javascript
{
  isProfileDropdownOpen: false
}
```

## 📊 File Size Comparison

### Before Restructuring
```
Dashboard.jsx: ~500 lines (everything in one file)
App.jsx: ~100 lines (auth logic mixed in)
```

### After Restructuring
```
MainLayout.jsx: ~50 lines (layout only)
Sidebar.jsx: ~120 lines (navigation only)
Header.jsx: ~150 lines (header only)
AuthContext.jsx: ~80 lines (auth logic)
ProtectedRoute.jsx: ~25 lines (route protection)
App.jsx: ~70 lines (routing only)
```

**Benefits:**
- ✅ Smaller, focused files
- ✅ Easier to understand
- ✅ Easier to test
- ✅ Easier to maintain
- ✅ Better code reusability

## 🎓 Best Practices Applied

1. **Separation of Concerns**: Each component has one responsibility
2. **DRY Principle**: Reusable components (LoadingSpinner, EmptyState)
3. **Single Source of Truth**: Auth state in one place (AuthContext)
4. **Component Composition**: Building complex UIs from simple components
5. **Props Down, Events Up**: Data flows down, events bubble up
6. **Consistent Naming**: Clear, descriptive component names
7. **Folder Organization**: Logical grouping by feature/type
8. **Code Splitting**: Smaller bundles, faster load times
