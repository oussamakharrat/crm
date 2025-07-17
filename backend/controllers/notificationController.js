import { Notification } from '../models/Notification.js';

// GET /notifications
export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const notifications = await Notification.findByUserId(user_id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /notifications/mark-all-read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    await Notification.markAllAsRead(user_id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 