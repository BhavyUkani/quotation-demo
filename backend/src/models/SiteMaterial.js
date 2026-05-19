const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteMaterial = sequelize.define('SiteMaterial', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    siteId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    materialName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'site_materials',
    timestamps: true,
    paranoid: true,
});

module.exports = SiteMaterial;
