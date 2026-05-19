const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    propertyType: {
        type: DataTypes.ENUM('Residential', 'Commercial'),
        allowNull: true,
        defaultValue: 'Residential'
    },
    totalArea: {
        type: DataTypes.STRING,
        allowNull: true
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
    },
    leadId: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: {
            model: 'leads',
            key: 'id'
        }
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    },
    addedByEmployeeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    assignedToEmployeeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    }
}, {
    tableName: 'clients',
    timestamps: true,
    paranoid: true,
});

module.exports = Client;
