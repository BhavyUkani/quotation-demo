const sequelize = require('../config/database');

// Import all models
const Branch = require('./Branch');
const Department = require('./Department');
const Employee = require('./Employee');
const Lead = require('./Lead');
const LeadStatusHistory = require('./LeadStatusHistory');
const Client = require('./Client');
const ClientNote = require('./ClientNote');
const Package = require('./Package');
const PackageSpace = require('./PackageSpace');
const PackageSpaceWorkItem = require('./PackageSpaceWorkItem');
const PackageNote = require('./PackageNote');
const Notification = require('./Notification');
const Quotation = require('./Quotation');
const QuotationNote = require('./QuotationNote');
const QuotationStatusHistory = require('./QuotationStatusHistory');
const QuotationSpace = require('./QuotationSpace');
const QuotationSpaceWorkItem = require('./QuotationSpaceWorkItem');
const Site = require('./Site');
const SiteMaterial = require('./SiteMaterial');
const RequestLog = require('./RequestLog');

// ============================================
// Define all associations here
// ============================================

// 1. Branch ↔ Department (One-to-Many)
Branch.hasMany(Department, {
    foreignKey: 'branchId',
    as: 'departments',
    onDelete: 'CASCADE'
});

Department.belongsTo(Branch, {
    foreignKey: 'branchId',
    as: 'branch'
});

// 2. Department ↔ Employee (One-to-Many)
Department.hasMany(Employee, {
    foreignKey: 'departmentId',
    as: 'employees',
    onDelete: 'SET NULL'
});

Employee.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'department'
});

// 3. Employee ↔ Lead (One-to-Many)
// Added by
Employee.hasMany(Lead, {
    foreignKey: 'addedByEmployeeId',
    as: 'addedLeads'
});

Lead.belongsTo(Employee, {
    foreignKey: 'addedByEmployeeId',
    as: 'addedBy'
});

// Assigned to
Employee.hasMany(Lead, {
    foreignKey: 'assignedToEmployeeId',
    as: 'assignedLeads'
});

Lead.belongsTo(Employee, {
    foreignKey: 'assignedToEmployeeId',
    as: 'assignedTo'
});

// 4. Lead ↔ Client (One-to-One)
Lead.hasOne(Client, {
    foreignKey: 'leadId',
    as: 'client'
});

Client.belongsTo(Lead, {
    foreignKey: 'leadId',
    as: 'lead'
});

// Added by
Employee.hasMany(Client, {
    foreignKey: 'addedByEmployeeId',
    as: 'addedClients'
});

Client.belongsTo(Employee, {
    foreignKey: 'addedByEmployeeId',
    as: 'addedBy'
});

// Assigned to
Employee.hasMany(Client, {
    foreignKey: 'assignedToEmployeeId',
    as: 'assignedClients'
});

Client.belongsTo(Employee, {
    foreignKey: 'assignedToEmployeeId',
    as: 'assignedTo'
});

// 5. Branch ↔ Other Models (Direct association for multi-branch filtering)
const branchModels = [Employee, Lead, Client, Quotation, Site];
branchModels.forEach(model => {
    Branch.hasMany(model, { foreignKey: 'branchId', as: model.name.toLowerCase() + 's' });
    model.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });
});

// 6. Employee ↔ Quotation (One-to-Many)
Employee.hasMany(Quotation, {
    foreignKey: 'createdBy',
    as: 'quotations'
});

Quotation.belongsTo(Employee, {
    foreignKey: 'createdBy',
    as: 'creator'
});

// 7. Lead ↔ LeadStatusHistory (One-to-Many)
Lead.hasMany(LeadStatusHistory, {
    foreignKey: 'leadId',
    as: 'statusHistory',
    onDelete: 'CASCADE'
});

LeadStatusHistory.belongsTo(Lead, {
    foreignKey: 'leadId',
    as: 'lead'
});

// 8. Client Associations
Client.hasMany(ClientNote, {
    foreignKey: 'clientId',
    as: 'notes',
    onDelete: 'CASCADE'
});

ClientNote.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client'
});

// Employee ↔ ClientNote (Creator)
Employee.hasMany(ClientNote, {
    foreignKey: 'addedBy',
    as: 'createdNotes'
});

ClientNote.belongsTo(Employee, {
    foreignKey: 'addedBy',
    as: 'creator'
});

// Employee ↔ ClientNote (Updater)
Employee.hasMany(ClientNote, {
    foreignKey: 'updatedBy',
    as: 'noteUpdates'
});

ClientNote.belongsTo(Employee, {
    foreignKey: 'updatedBy',
    as: 'updater'
});

// Employee ↔ LeadStatusHistory (Updater)
Employee.hasMany(LeadStatusHistory, {
    foreignKey: 'addedBy',
    as: 'statusUpdates'
});

LeadStatusHistory.belongsTo(Employee, {
    foreignKey: 'addedBy',
    as: 'updater'
});

Client.hasMany(Quotation, {
    foreignKey: 'clientId',
    as: 'quotations'
});

Quotation.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client'
});

// 9. Package Associations
Package.hasMany(PackageSpace, {
    foreignKey: 'packageId',
    as: 'spaces',
    onDelete: 'CASCADE'
});

PackageSpace.belongsTo(Package, {
    foreignKey: 'packageId',
    as: 'package'
});

Package.hasMany(PackageNote, {
    foreignKey: 'packageId',
    as: 'packageNotes',
    onDelete: 'CASCADE'
});

PackageNote.belongsTo(Package, {
    foreignKey: 'packageId',
    as: 'package'
});

PackageSpace.hasMany(PackageSpaceWorkItem, {
    foreignKey: 'spaceId',
    as: 'workItems',
    onDelete: 'CASCADE'
});

PackageSpaceWorkItem.belongsTo(PackageSpace, {
    foreignKey: 'spaceId',
    as: 'space'
});

// 10. Quotation Associations
Quotation.hasMany(QuotationNote, {
    foreignKey: 'quotationId',
    as: 'quotationNotes',
    onDelete: 'CASCADE'
});

QuotationNote.belongsTo(Quotation, {
    foreignKey: 'quotationId',
    as: 'quotation'
});

Quotation.belongsTo(Package, {
    foreignKey: 'packageId',
    as: 'package'
});

Package.hasMany(Quotation, {
    foreignKey: 'packageId',
    as: 'quotations'
});

Quotation.hasMany(QuotationSpace, {
    foreignKey: 'quotationId',
    as: 'spaces',
    onDelete: 'CASCADE'
});

QuotationSpace.belongsTo(Quotation, {
    foreignKey: 'quotationId',
    as: 'quotation'
});

Quotation.hasMany(QuotationStatusHistory, {
    foreignKey: 'quotationId',
    as: 'statusHistory',
    onDelete: 'CASCADE'
});

QuotationStatusHistory.belongsTo(Quotation, {
    foreignKey: 'quotationId',
    as: 'quotation'
});

QuotationStatusHistory.belongsTo(Employee, {
    foreignKey: 'changedBy',
    as: 'changedByUser'
});

QuotationSpace.hasMany(QuotationSpaceWorkItem, {
    foreignKey: 'spaceId',
    as: 'workItems',
    onDelete: 'CASCADE'
});

QuotationSpaceWorkItem.belongsTo(QuotationSpace, {
    foreignKey: 'spaceId',
    as: 'space'
});

// 11. Site Associations
Site.hasMany(SiteMaterial, {
    foreignKey: 'siteId',
    as: 'materials',
    onDelete: 'CASCADE'
});

SiteMaterial.belongsTo(Site, {
    foreignKey: 'siteId',
    as: 'site'
});

// Export all models and sequelize instance
module.exports = {
    sequelize,
    Branch,
    Department,
    Employee,
    Lead,
    LeadStatusHistory,
    Client,
    ClientNote,
    Package,
    PackageNote,
    PackageSpace,
    PackageSpaceWorkItem,
    Notification,
    Quotation,
    QuotationNote,
    QuotationSpace,
    QuotationSpaceWorkItem,
    QuotationStatusHistory,
    Site,
    SiteMaterial,
    RequestLog
};
