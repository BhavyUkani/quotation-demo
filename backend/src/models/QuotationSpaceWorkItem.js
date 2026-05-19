const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuotationSpaceWorkItem = sequelize.define('QuotationSpaceWorkItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    spaceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'quotation_spaces',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    item: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    width: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    length: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    sqft: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    rsPerFt: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'quotation_space_workitems',
    timestamps: true,
    paranoid: true,
});

module.exports = QuotationSpaceWorkItem;
