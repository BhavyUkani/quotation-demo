const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique_email",
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
        // In real app, this should be hashed.
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Employee'
    },
    departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'departments', // This is a reference to another model
            key: 'id',
        }
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    },
    isMaster: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    lastSelectedBranchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    }
}, {
    tableName: 'employees',
    timestamps: true,
    paranoid: true,
});

module.exports = Employee;
