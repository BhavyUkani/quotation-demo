const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuotationNote = sequelize.define('QuotationNote', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quotationId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'quotation_notes',
    timestamps: true,
    paranoid: true,
});

module.exports = QuotationNote;
