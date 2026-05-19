# Package Spaces Backend Implementation

## Overview
Created a complete backend system for managing package spaces and work items with full CRUD operations.

## Database Models

### 1. PackageSpace Model
**File:** `backend/src/models/PackageSpace.js`

**Fields:**
- `id` (UUID) - Primary key
- `packageId` (UUID) - Foreign key to Package
- `name` (STRING) - Space name (e.g., "Living Room", "Kitchen")
- `order` (INTEGER) - Display order
- `createdAt`, `updatedAt` - Timestamps

**Relationships:**
- Belongs to Package
- Has many PackageSpaceWorkItems

### 2. PackageSpaceWorkItem Model
**File:** `backend/src/models/PackageSpaceWorkItem.js`

**Fields:**
- `id` (UUID) - Primary key
- `spaceId` (UUID) - Foreign key to PackageSpace
- `item` (STRING) - Item name
- `quantity` (DECIMAL) - Quantity
- `width` (DECIMAL) - Width measurement
- `length` (DECIMAL) - Length measurement
- `sqft` (DECIMAL) - Square feet (calculated)
- `rsPerFt` (DECIMAL) - Rate per square foot
- `total` (DECIMAL) - Total cost (calculated)
- `order` (INTEGER) - Display order
- `createdAt`, `updatedAt` - Timestamps

**Relationships:**
- Belongs to PackageSpace

## API Endpoints

### Package Space Endpoints

#### Get all spaces for a package
```
GET /api/packages/:packageId/spaces
```
Returns all spaces with their work items for a specific package.

#### Create a new space
```
POST /api/packages/:packageId/spaces
Body: { name, order }
```

#### Update a space
```
PUT /api/spaces/:spaceId
Body: { name, order }
```

#### Delete a space
```
DELETE /api/spaces/:spaceId
```
Cascades to delete all work items in the space.

### Work Item Endpoints

#### Add work item to a space
```
POST /api/spaces/:spaceId/workitems
Body: { item, quantity, width, length, sqft, rsPerFt, total, order }
```

#### Update a work item
```
PUT /api/workitems/:workItemId
Body: { item, quantity, width, length, sqft, rsPerFt, total, order }
```

#### Delete a work item
```
DELETE /api/workitems/:workItemId
```

#### Bulk update work items
```
PUT /api/workitems/bulk
Body: { workItems: [...] }
```
Used for reordering or batch updates.

## Frontend Service

**File:** `frontend/src/api/packageSpaceService.js`

Provides the following functions:
- `fetchPackageSpaces(packageId)` - Get all spaces
- `createPackageSpace(packageId, spaceData)` - Create space
- `updatePackageSpace(spaceId, spaceData)` - Update space
- `deletePackageSpace(spaceId)` - Delete space
- `addWorkItem(spaceId, workItemData)` - Add work item
- `updateWorkItem(workItemId, workItemData)` - Update work item
- `deleteWorkItem(workItemId)` - Delete work item
- `bulkUpdateWorkItems(workItems)` - Bulk update

## Database Tables

The following tables will be created automatically:

### package_spaces
- id (UUID, PK)
- packageId (UUID, FK -> packages.id)
- name (VARCHAR)
- order (INT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### package_space_workitems
- id (UUID, PK)
- spaceId (UUID, FK -> package_spaces.id)
- item (VARCHAR)
- quantity (DECIMAL)
- width (DECIMAL)
- length (DECIMAL)
- sqft (DECIMAL)
- rsPerFt (DECIMAL)
- total (DECIMAL)
- order (INT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

## Usage Flow

1. **Create a Space:**
   - User clicks "Add Space" in PackageView
   - Frontend calls `createPackageSpace(packageId, { name, order })`
   - Backend creates space record in database
   - Returns space with ID

2. **Add Work Items:**
   - User clicks "Add Row" in a space
   - Frontend calls `addWorkItem(spaceId, workItemData)`
   - Backend creates work item record
   - Returns work item with ID

3. **Update Work Items:**
   - User edits cells in the table
   - Frontend calls `updateWorkItem(workItemId, updatedData)`
   - Backend updates the record

4. **Reorder Rows:**
   - User clicks move up/down
   - Frontend updates order values
   - Calls `bulkUpdateWorkItems(allWorkItems)` to save new order

5. **Delete:**
   - Space deletion cascades to all work items
   - Work item deletion is individual

## Next Steps

To integrate with the frontend:

1. Import the service in PackageView.jsx:
   ```javascript
   import * as packageSpaceService from '../api/packageSpaceService';
   ```

2. Replace local state management with API calls
3. Load spaces on component mount
4. Save changes to backend on user actions
5. Handle loading and error states

## Notes

- All IDs use UUID for better security and distribution
- Cascade delete ensures data integrity
- Order field allows custom sorting
- DECIMAL type used for precise calculations
- Timestamps track creation and modification
