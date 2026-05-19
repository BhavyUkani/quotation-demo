const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique_name"
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    manager: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    }
    // We would link employee count via relation in real scenario, 
    // but keeping it simple as per frontend mock for now or computing it.
    // However, relation is better. Let's start with basic fields.
}, {
    tableName: 'departments',
    timestamps: true,
    paranoid: true,
});

module.exports = Department;
