const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientNote = sequelize.define('ClientNote', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    addedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    }
}, {
    tableName: 'client_notes',
    timestamps: true,
    paranoid: true,
});

module.exports = ClientNote;
