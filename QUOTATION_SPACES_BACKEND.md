# Quotation Spaces Backend Implementation

## Overview
Complete backend implementation for managing spaces and work items within quotations, similar to the package spaces structure.

## Database Models

### 1. QuotationSpace Model
**File:** `backend/src/models/QuotationSpace.js`

**Fields:**
- `id` (UUID, Primary Key)
- `quotationId` (UUID, Foreign Key → quotations)
- `name` (String)
- `order` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

**Relationships:**
- Belongs to `Quotation`
- Has many `QuotationSpaceWorkItem`

### 2. QuotationSpaceWorkItem Model
**File:** `backend/src/models/QuotationSpaceWorkItem.js`

**Fields:**
- `id` (UUID, Primary Key)
- `spaceId` (UUID, Foreign Key → quotation_spaces)
- `item` (String) - Item name/description
- `quantity` (Decimal)
- `width` (Decimal)
- `length` (Decimal)
- `sqft` (Decimal) - Auto-calculated
- `rsPerFt` (Decimal) - Rate per square foot
- `total` (Decimal) - Auto-calculated
- `order` (Integer) - For sorting
- `createdAt`, `updatedAt` (Timestamps)

**Relationships:**
- Belongs to `QuotationSpace`

## API Endpoints

### Quotation Space Endpoints

#### GET `/api/quotations/:quotationId/spaces`
Get all spaces for a quotation (includes work items)

**Response:**
```json
[
  {
    "id": "uuid",
    "quotationId": "uuid",
    "name": "Living Room",
    "order": 0,
    "workItems": [...]
  }
]
```

#### POST `/api/quotations/:quotationId/spaces`
Create a new space

**Request Body:**
```json
{
  "name": "Living Room",
  "order": 0
}
```

#### PUT `/api/quotation-spaces/:spaceId`
Update a space

**Request Body:**
```json
{
  "name": "Updated Name",
  "order": 1
}
```

#### DELETE `/api/quotation-spaces/:spaceId`
Delete a space (cascades to work items)

### Work Item Endpoints

#### POST `/api/quotation-spaces/:spaceId/workitems`
Add a work item to a space

**Request Body:**
```json
{
  "item": "False Ceiling",
  "quantity": 1,
  "width": 12,
  "length": 10,
  "sqft": 120,
  "rsPerFt": 150,
  "total": 18000,
  "order": 0
}
```

#### PUT `/api/quotation-workitems/:workItemId`
Update a work item

**Request Body:**
```json
{
  "item": "Updated Item",
  "quantity": 2,
  "width": 15,
  "length": 12,
  "sqft": 180,
  "rsPerFt": 200,
  "total": 36000,
  "order": 0
}
```

#### DELETE `/api/quotation-workitems/:workItemId`
Delete a work item

#### PUT `/api/quotation-workitems/bulk`
Bulk update work items (for reordering)

**Request Body:**
```json
{
  "workItems": [
    {
      "id": "uuid",
      "item": "Item 1",
      "quantity": 1,
      "width": 10,
      "length": 10,
      "sqft": 100,
      "rsPerFt": 150,
      "total": 15000,
      "order": 0
    }
  ]
}
```

## Frontend Integration

### API Service
**File:** `frontend/src/api/quotationSpaceService.js`

**Functions:**
- `fetchQuotationSpaces(quotationId)` - Get all spaces
- `createQuotationSpace(quotationId, spaceData)` - Create space
- `updateQuotationSpace(spaceId, spaceData)` - Update space
- `deleteQuotationSpace(spaceId)` - Delete space
- `addWorkItem(spaceId, workItemData)` - Add work item
- `updateWorkItem(workItemId, workItemData)` - Update work item
- `deleteWorkItem(workItemId)` - Delete work item
- `bulkUpdateWorkItems(workItems)` - Bulk update

### QuotationView Component
**File:** `frontend/src/pages/quotations/QuotationView.jsx`

**Features:**
- Displays quotation header with status, client info, area, validity, and total cost
- Add/edit/delete spaces
- Add/edit/delete/reorder work items within each space
- Auto-calculation of sqft (width × length) and total (sqft × rsPerFt)
- Real-time updates to backend
- Optimistic UI updates with error handling

## Database Tables Created

### quotation_spaces
```sql
CREATE TABLE quotation_spaces (
  id UUID PRIMARY KEY,
  quotationId UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### quotation_space_workitems
```sql
CREATE TABLE quotation_space_workitems (
  id UUID PRIMARY KEY,
  spaceId UUID NOT NULL REFERENCES quotation_spaces(id) ON DELETE CASCADE,
  item VARCHAR(255),
  quantity DECIMAL(10,2) DEFAULT 0,
  width DECIMAL(10,2) DEFAULT 0,
  length DECIMAL(10,2) DEFAULT 0,
  sqft DECIMAL(10,2) DEFAULT 0,
  rsPerFt DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  order INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## Files Created/Modified

### Backend Files Created:
1. `backend/src/models/QuotationSpace.js`
2. `backend/src/models/QuotationSpaceWorkItem.js`
3. `backend/src/controllers/quotationSpaceController.js`
4. `backend/src/routes/quotationSpaceRoutes.js`

### Backend Files Modified:
1. `backend/src/models/index.js` - Added models and relationships
2. `backend/src/index.js` - Registered routes

### Frontend Files Created:
1. `frontend/src/api/quotationSpaceService.js`

### Frontend Files Modified:
1. `frontend/src/pages/quotations/QuotationView.jsx` - Integrated backend API

## Testing the Implementation

1. **Navigate to a quotation:**
   - Go to `/dashboard/quotations`
   - Click the eye icon on any quotation

2. **Add a space:**
   - Click "Add Space" button
   - Enter space name (e.g., "Living Room")
   - Click "Add Space" in modal

3. **Add work items:**
   - Click "Add Row" in the space card
   - Fill in item details
   - Watch auto-calculations for sqft and total

4. **Edit work items:**
   - Type in any field
   - Changes are saved automatically to backend

5. **Reorder items:**
   - Use up/down arrow buttons
   - Order is persisted to backend

6. **Delete items/spaces:**
   - Click trash icon
   - Confirm deletion

## Auto-Calculations

### Square Feet (sqft)
```javascript
sqft = width × length
```

### Total Cost
```javascript
total = sqft × rsPerFt
```

Both calculations happen automatically when relevant fields are updated.

## Error Handling

All API calls include try-catch blocks with:
- Console error logging
- User-friendly alert messages
- Optimistic UI updates (immediate feedback)
- Backend synchronization

## Database Sync

The backend uses Sequelize with `{ alter: true }` mode, which will:
- Create new tables if they don't exist
- Add new columns to existing tables
- Preserve existing data

Tables will be created automatically when the backend restarts.
