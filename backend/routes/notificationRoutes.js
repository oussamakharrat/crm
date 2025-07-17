import express from 'express';
import { getNotifications, markAllNotificationsRead } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

// Get all notifications for the logged-in user
router.get('/notifications', getNotifications);
// Mark all notifications as read
router.patch('/notifications/mark-all-read', markAllNotificationsRead);

export default router; 