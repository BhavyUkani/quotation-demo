const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuotationSpace = sequelize.define('QuotationSpace', {
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
        },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'quotation_spaces',
    timestamps: true,
    paranoid: true,
});

module.exports = QuotationSpace;
