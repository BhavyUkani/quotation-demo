const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get unread count
router.get('/unread/count', notificationController.getUnreadCount);

// Mark as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
