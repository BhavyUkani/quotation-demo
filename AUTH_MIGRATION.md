# Authentication Migration: User → Employee

## Overview
Migrated authentication system from separate User model to use Employee model directly. Employees can now log in using their credentials.

## Changes Made

### 1. Updated Authentication Controller
**File:** `backend/src/controllers/authController.js`

**Changes:**
- Replaced `User` model with `Employee` model
- Added Department association to login query
- Enhanced login response to include employee details:
  - id
  - name
  - email
  - role
  - phone
  - whatsapp
  - address
  - department (full object)

**Before:**
```javascript
const User = require('../models/User');
const user = await User.findOne({ where: { email } });
```

**After:**
```javascript
const { Employee, Department } = require('../models');
const employee = await Employee.findOne({ 
    where: { email },
    include: [{ model: Department, as: 'department' }]
});
```

### 2. Removed User Model
**File:** `backend/src/models/index.js`

**Changes:**
- Removed `User` model import
- Removed `User` from exports
- User table will be dropped on next sync

### 3. Database Sync Update
**File:** `backend/src/index.js`

**Changes:**
- Temporarily changed from `sync({ alter: true })` to `sync({ force: true })`
- This will drop and recreate all tables to fix foreign key constraints
- ⚠️ **WARNING:** This will delete all existing data

**Important:** After the first successful sync, change back to:
```javascript
sequelize.sync({ alter: true })
```

## Employee Login Flow

### Login Request
```javascript
POST /api/login
{
    "email": "employee@example.com",
    "password": "password123"
}
```

### Login Response
```javascript
{
    "message": "Login successful",
    "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "employee@example.com",
        "role": "Employee",
        "phone": "1234567890",
        "whatsapp": "1234567890",
        "address": "123 Main St",
        "department": {
            "id": "dept-uuid",
            "name": "Sales",
            "description": "Sales Department"
        }
    }
}
```

## Employee Model Fields

The Employee model already has all necessary fields for authentication:
- `email` (unique, required) - Used for login
- `password` (required) - Plain text (should be hashed in production)
- `role` (default: 'Employee') - Can be used for authorization
- `name` (required)
- `phone` (required)
- `whatsapp` (optional)
- `address` (optional)
- `departmentId` (optional, FK to Department)

## Database Tables Affected

### Dropped:
- `users` table (no longer needed)

### Modified:
- All tables will be recreated due to `force: true` sync
- Foreign key constraints will be properly set up

## Migration Steps

1. ✅ Updated authController to use Employee
2. ✅ Removed User from models/index.js
3. ✅ Set sync to force:true
4. ⏳ Restart backend server
5. ⏳ Database will be recreated
6. ⏳ Change sync back to alter:true
7. ⏳ Create test employee accounts

## Creating Employee Accounts

Employees can be created through the existing Employee API:

```javascript
POST /api/employees
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "whatsapp": "1234567890",
    "address": "123 Main St",
    "role": "Employee",
    "departmentId": "dept-uuid"
}
```

## Frontend Changes Needed

The frontend login should work without changes, but the response now includes more employee information:

### Before:
```javascript
{
    user: {
        id: "uuid",
        email: "user@example.com"
    }
}
```

### After:
```javascript
{
    user: {
        id: "uuid",
        name: "John Doe",
        email: "john@example.com",
        role: "Employee",
        phone: "1234567890",
        whatsapp: "1234567890",
        address: "123 Main St",
        department: { ... }
    }
}
```

## Security Notes

⚠️ **Important for Production:**
1. Passwords are currently stored in plain text
2. Should implement password hashing (bcrypt)
3. Should implement JWT tokens for session management
4. Should add password validation rules
5. Should implement rate limiting on login endpoint

## Role-Based Access

The Employee model has a `role` field that can be used for authorization:
- "Employee" - Regular employee
- "Admin" - Administrator
- Custom roles can be added as needed

## Next Steps

1. Restart the backend server
2. Verify database tables are created correctly
3. Create test employee accounts
4. Test login with employee credentials
5. Change sync back to `alter: true`
6. Update frontend to use new user object structure (if needed)
7. Consider implementing password hashing
8. Consider implementing JWT authentication
