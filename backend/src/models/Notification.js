const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('lead_created', 'lead_updated', 'lead_converted', 'client_created', 'client_updated', 'employee_created', 'employee_updated', 'employee_password_changed'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    relatedId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'ID of the related entity (lead, client, employee)'
    },
    relatedType: {
        type: DataTypes.ENUM('lead', 'client', 'employee'),
        allowNull: true
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Employee who triggered the notification'
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    paranoid: true,
});

module.exports = Notification;
