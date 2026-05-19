const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PackageSpace = sequelize.define('PackageSpace', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    packageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'packages',
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
    tableName: 'package_spaces',
    timestamps: true,
    paranoid: true,
});

module.exports = PackageSpace;
