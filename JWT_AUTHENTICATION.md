# JWT Token-Based Authentication Implementation

## Overview
Implemented secure JWT token-based authentication. Only the token is stored in localStorage, and sensitive user data is fetched from the backend using the token.

## Security Improvements

### Before (Insecure):
- ❌ Full user data stored in localStorage
- ❌ Sensitive information (email, phone, address, department) exposed
- ❌ No token expiration
- ❌ No middleware protection

### After (Secure):
- ✅ Only JWT token stored in localStorage
- ✅ User data fetched from backend using token
- ✅ Token expires in 24 hours
- ✅ Middleware protects routes
- ✅ Automatic token validation

## Backend Changes

### 1. JWT Package Installed
```bash
npm install jsonwebtoken
```

### 2. Updated Auth Controller
**File:** `backend/src/controllers/authController.js`

**Changes:**
- Generates JWT token on login
- Token contains only: `{ id, email }`
- Token expires in 24 hours
- Returns only token (no user data)

**Login Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Created Auth Middleware
**File:** `backend/src/middleware/authMiddleware.js`

**Features:**
- Verifies JWT token from `Authorization` header
- Fetches user from database
- Attaches user to `req.user`
- Handles token expiration
- Excludes password from user data

**Usage:**
```javascript
router.get('/protected', authMiddleware, (req, res) => {
    // req.user contains full user data
});
```

### 4. Added /me Endpoint
**File:** `backend/src/routes/authRoutes.js`

**New Route:**
```javascript
GET /api/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Employee",
    "phone": "1234567890",
    "whatsapp": "1234567890",
    "address": "123 Main St",
    "department": {
      "id": "dept-uuid",
      "name": "Sales"
    }
  }
}
```

## Frontend Changes

### 1. Updated Axios Configuration
**File:** `frontend/src/api/axios.js`

**Added Interceptors:**

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header
- Reads token from localStorage
- Applied to all API requests

**Response Interceptor:**
- Handles 401 (Unauthorized) errors
- Clears token and redirects to login
- Handles token expiration gracefully

### 2. Updated Login Component
**File:** `frontend/src/pages/Login.jsx`

**Changes:**
- Stores only token in localStorage
- Removed user data storage
- Calls `onLogin()` without parameters

**Before:**
```javascript
localStorage.setItem('user', JSON.stringify(response.data.user));
onLogin(response.data.user);
```

**After:**
```javascript
localStorage.setItem('token', response.data.token);
onLogin();
```

### 3. Updated App.jsx
**File:** `frontend/src/App.jsx`

**Changes:**
- Fetches user from `/me` endpoint on mount
- Uses token for authentication
- Shows loading spinner while fetching user
- Fetches user after login

**Flow:**
```
App Mount
  ↓
Check for token
  ↓
Call GET /api/me
  ↓
Set user state
  ↓
Render Dashboard
```

## Authentication Flow

### Login Flow:
```
1. User enters email/password
   ↓
2. POST /api/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend calls GET /api/me
   ↓
7. Backend verifies token
   ↓
8. Backend returns user data
   ↓
9. Frontend sets user state
   ↓
10. Navigate to dashboard
```

### Protected Route Access:
```
1. User navigates to protected route
   ↓
2. Axios interceptor adds token to request
   ↓
3. Backend middleware verifies token
   ↓
4. Backend fetches user from database
   ↓
5. Request proceeds with req.user
   ↓
6. Response sent to frontend
```

### Token Expiration:
```
1. Token expires (24 hours)
   ↓
2. Next API request returns 401
   ↓
3. Axios response interceptor catches error
   ↓
4. Clear token from localStorage
   ↓
5. Redirect to login page
```

## LocalStorage Contents

### Before:
```javascript
{
  "isAuthenticated": "true",
  "user": "{\"id\":\"...\",\"name\":\"...\",\"email\":\"...\",\"phone\":\"...\",\"address\":\"...\"}"
}
```

### After:
```javascript
{
  "isAuthenticated": "true",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Benefits

1. **No Sensitive Data in LocalStorage**
   - Token is opaque, doesn't reveal user info
   - Can't be decoded to get sensitive data without secret key

2. **Token Expiration**
   - Tokens expire after 24 hours
   - Reduces risk of stolen tokens

3. **Centralized User Data**
   - User data always fetched from database
   - Changes reflect immediately
   - No stale data in localStorage

4. **Middleware Protection**
   - Easy to protect any route
   - Consistent authentication across all endpoints
   - User data always available in `req.user`

5. **Automatic Token Handling**
   - Axios interceptors handle token automatically
   - No manual header management
   - Automatic logout on token expiration

## Environment Variables

### Backend (.env):
```env
JWT_SECRET=your-super-secret-key-change-this-in-production
```

**Important:** Change the JWT_SECRET in production!

## Testing

### Test Login:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@example.com","password":"password123"}'
```

### Test Protected Route:
```bash
curl -X GET http://localhost:5000/api/me \
  -H "Authorization: Bearer <your-token>"
```

## Future Enhancements

1. **Refresh Tokens**
   - Implement refresh token mechanism
   - Extend session without re-login

2. **Password Hashing**
   - Use bcrypt to hash passwords
   - Never store plain text passwords

3. **Rate Limiting**
   - Limit login attempts
   - Prevent brute force attacks

4. **Token Blacklist**
   - Invalidate tokens on logout
   - Prevent reuse of old tokens

5. **Role-Based Access Control**
   - Use middleware to check user roles
   - Protect admin-only routes

## Migration Notes

- Old localStorage data (`user`) is no longer used
- Users will need to log in again after deployment
- All existing sessions will be invalidated

## Files Modified

### Backend:
- ✅ `controllers/authController.js` - JWT token generation
- ✅ `middleware/authMiddleware.js` - Token verification (new)
- ✅ `routes/authRoutes.js` - Added /me endpoint
- ✅ `package.json` - Added jsonwebtoken dependency

### Frontend:
- ✅ `api/axios.js` - Token interceptors
- ✅ `pages/Login.jsx` - Store token only
- ✅ `App.jsx` - Fetch user from API

## Success Criteria

✅ Token stored in localStorage (not user data)
✅ User data fetched from /me endpoint
✅ Token automatically included in requests
✅ Token expiration handled gracefully
✅ Middleware protects backend routes
✅ No sensitive data exposed in localStorage
