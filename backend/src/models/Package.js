const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define('Package', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Gold'
    },
    costType: {
        type: DataTypes.ENUM('Fixed', 'Calculated'),
        allowNull: false,
        defaultValue: 'Calculated'
    },
    fixedCost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT, // Store notes as JSON string
        allowNull: true
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    },
    employeeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    }
}, {
    tableName: 'packages',
    timestamps: true,
    paranoid: true,
});

module.exports = Package;
