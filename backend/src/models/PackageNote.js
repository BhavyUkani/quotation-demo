const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PackageNote = sequelize.define('PackageNote', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    packageId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'package_notes',
    timestamps: true,
    paranoid: true,
});

module.exports = PackageNote;
