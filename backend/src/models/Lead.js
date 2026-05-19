const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
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
        defaultValue: 'New'
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true
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
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    }
}, {
    tableName: 'leads',
    timestamps: true,
    paranoid: true,
});

module.exports = Lead;
