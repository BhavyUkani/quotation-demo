const { Notification, Employee } = require('../models');
const jwt = require('jsonwebtoken');

// Helper to get branch context from token
const getBranchFilter = async (req) => {
    const whereClause = {};
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const decodedToken = jwt.verify(token, "your-secret-key-change-this-in-production");
                const employee = await Employee.findByPk(decodedToken.id);
                if (employee) {
                    if (employee.isMaster) {
                        if (employee.lastSelectedBranchId) {
                            whereClause.branchId = employee.lastSelectedBranchId;
                        }
                    } else {
                        whereClause.branchId = employee.branchId;
                    }
                }
            } catch (err) {
                console.error('Token verification failed:', err);
            }
        }
    }
    return whereClause;
};

// Create a notification
exports.createNotification = async (type, title, message, relatedId = null, relatedType = null, createdBy = null) => {
    try {
        let branchId = null;
        if (createdBy) {
            const employee = await Employee.findByPk(createdBy);
            if (employee) {
                if (employee.isMaster) {
                    branchId = employee.lastSelectedBranchId;
                } else {
                    branchId = employee.branchId;
                }
            }
        }

        const notification = await Notification.create({
            type,
            title,
            message,
            relatedId,
            relatedType,
            createdBy,
            branchId
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        // const whereClause = await getBranchFilter(req);
        const notifications = await Notification.findAll({
            // where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
    try {
        // const branchFilter = await getBranchFilter(req);
        const count = await Notification.count({
            where: {
                isRead: false,
                // ...branchFilter
            }
        });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.update({ isRead: true });
        res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
    try {
        // const branchFilter = await getBranchFilter(req);
        await Notification.update(
            { isRead: true },
            {
                where: {
                    isRead: false,
                    // ...branchFilter
                }
            }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByPk(id);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await notification.destroy();
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: error.message });
    }
};
