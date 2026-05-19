const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequestLog = sequelize.define('RequestLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    headers: {
        type: DataTypes.JSON,
        allowNull: true
    },
    body: {
        type: DataTypes.JSON, // Use JSON for structured data
        allowNull: true
    },
    query: {
        type: DataTypes.JSON,
        allowNull: true
    },
    responseStatus: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    responseBody: {
        type: DataTypes.TEXT('long'), // Use LONGTEXT as responses can be large and not always JSON
        allowNull: true
    },
    durationMs: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'request_logs',
    timestamps: true,
    updatedAt: false // We only need createdAt for logs
});

module.exports = RequestLog;
