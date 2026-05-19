const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuotationStatusHistory = sequelize.define('QuotationStatusHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quotationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'quotations',
            key: 'id'
        }
    },
    previousStatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    newStatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    changedBy: {
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
    }
}, {
    tableName: 'quotation_status_histories',
    timestamps: true,
    paranoid: true,
});

module.exports = QuotationStatusHistory;
