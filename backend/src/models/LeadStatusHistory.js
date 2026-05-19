const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadStatusHistory = sequelize.define('LeadStatusHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    leadId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'leads',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    fromStatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    addedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    toStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    changedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    addedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    }
}, {
    tableName: 'lead_status_history',
    timestamps: true,
    paranoid: true,
});

module.exports = LeadStatusHistory;
