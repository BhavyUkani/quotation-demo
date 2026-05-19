# Centralized Model Associations

## Overview
All model associations are now defined in a single file: `backend/src/models/index.js`

## Benefits
1. **Single Source of Truth** - All relationships defined in one place
2. **Avoid Circular Dependencies** - No more circular require issues
3. **Better Organization** - Easy to see all model relationships at a glance
4. **Easier Maintenance** - Update associations in one location

## All Model Associations

### 1. Department ↔ Employee (One-to-Many)
- **Department** has many **Employee** (as 'employees')
- **Employee** belongs to **Department** (as 'department')
- Foreign Key: `departmentId` in Employee table

**Use Case:** Each employee belongs to one department, departments can have multiple employees.

### 2. Lead ↔ LeadStatusHistory (One-to-Many)
- **Lead** has many **LeadStatusHistory** (as 'statusHistory')
- **LeadStatusHistory** belongs to **Lead** (as 'lead')
- Foreign Key: `leadId` in LeadStatusHistory table
- Cascade delete: Deleting a lead deletes all its status history

**Use Case:** Track all status changes for each lead over time.

### 3. Lead ↔ Client (One-to-One)
- **Lead** has one **Client** (as 'client')
- **Client** belongs to **Lead** (as 'originalLead')
- Foreign Key: `convertedFromLeadId` in Client table

**Use Case:** When a lead is converted to a client, maintain the relationship to the original lead.

### 4. Package ↔ PackageSpace (One-to-Many)
- **Package** has many **PackageSpace** (as 'spaces')
- **PackageSpace** belongs to **Package** (as 'package')
- Foreign Key: `packageId` in PackageSpace table
- Cascade delete: Deleting a package deletes all its spaces

**Use Case:** Each package can have multiple spaces (e.g., Living Room, Kitchen, Bedroom).

### 5. PackageSpace ↔ PackageSpaceWorkItem (One-to-Many)
- **PackageSpace** has many **PackageSpaceWorkItem** (as 'workItems')
- **PackageSpaceWorkItem** belongs to **PackageSpace** (as 'space')
- Foreign Key: `spaceId` in PackageSpaceWorkItem table
- Cascade delete: Deleting a space deletes all its work items

**Use Case:** Each space contains multiple work items/rows with measurements and costs.

## Database Relationships Diagram

```
Department (1) ──→ (Many) Employee

Lead (1) ──→ (Many) LeadStatusHistory
Lead (1) ──→ (One) Client

Package (1) ──→ (Many) PackageSpace
PackageSpace (1) ──→ (Many) PackageSpaceWorkItem
```

## Cascade Delete Behavior

The following associations have cascade delete enabled:

1. **Lead → LeadStatusHistory**: Deleting a lead removes all its status history
2. **Package → PackageSpace**: Deleting a package removes all its spaces
3. **PackageSpace → PackageSpaceWorkItem**: Deleting a space removes all its work items

**Chain Effect:**
- Deleting a Package → Deletes all PackageSpaces → Deletes all PackageSpaceWorkItems

## Usage in Controllers

### Before:
```javascript
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const Lead = require('../models/Lead');
```

### After:
```javascript
const { Department, Employee, Lead } = require('../models');
```

## Example Queries with Associations

### Get Department with all Employees
```javascript
const { Department, Employee } = require('../models');

const department = await Department.findByPk(id, {
    include: [{
        model: Employee,
        as: 'employees'
    }]
});
```

### Get Lead with Status History
```javascript
const { Lead, LeadStatusHistory } = require('../models');

const lead = await Lead.findByPk(id, {
    include: [{
        model: LeadStatusHistory,
        as: 'statusHistory',
        order: [['changedAt', 'DESC']]
    }]
});
```

### Get Client with Original Lead
```javascript
const { Client, Lead } = require('../models');

const client = await Client.findByPk(id, {
    include: [{
        model: Lead,
        as: 'originalLead'
    }]
});
```

### Get Package with Spaces and Work Items
```javascript
const { Package, PackageSpace, PackageSpaceWorkItem } = require('../models');

const package = await Package.findByPk(id, {
    include: [{
        model: PackageSpace,
        as: 'spaces',
        include: [{
            model: PackageSpaceWorkItem,
            as: 'workItems',
            order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']]
    }]
});
```

## Files Modified

✅ **Created:**
- `models/index.js` - Central hub for all models and associations

✅ **Updated:**
- `models/Employee.js` - Removed Department-Employee associations
- `models/LeadStatusHistory.js` - Removed Lead-LeadStatusHistory associations, added leadId field
- `models/PackageSpace.js` - Removed Package-PackageSpace associations
- `models/PackageSpaceWorkItem.js` - Removed PackageSpace-WorkItem associations
- `controllers/packageSpaceController.js` - Updated to use centralized imports
- `backend/src/index.js` - Updated to import sequelize from models/index.js

## Adding New Models

When creating a new model:

1. Create the model file in `models/` directory
2. Import it in `models/index.js`
3. Define its associations in `models/index.js`
4. Export it from `models/index.js`

Example:
```javascript
// In models/index.js
const NewModel = require('./NewModel');

// Define associations
NewModel.belongsTo(OtherModel, {
    foreignKey: 'otherModelId',
    as: 'otherModel'
});

OtherModel.hasMany(NewModel, {
    foreignKey: 'otherModelId',
    as: 'newModels'
});

// Export
module.exports = {
    sequelize,
    // ... other models
    NewModel
};
```

## Important Notes

1. **Always import from models/index.js** when you need models with associations
2. **Individual model files** should NOT define associations anymore
3. **The server** must import sequelize from models/index.js to ensure associations are loaded
4. **Foreign key fields** should still be defined in individual model files
5. **Cascade delete** is only enabled where it makes sense (parent-child relationships)
