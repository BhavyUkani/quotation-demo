const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Site = sequelize.define('Site', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supervisorName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    supervisorPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active' // Active, Completed, Inactive
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
    },
    quotationId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'quotations',
            key: 'id'
        }
    }
}, {
    tableName: 'sites',
    timestamps: true,
    paranoid: true,
});

module.exports = Site;
