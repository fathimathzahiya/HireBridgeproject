const Notification = require("../models/notificationmodel");

// Fetch all notifications for a student
const getStudentNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;
    // Check if the student is querying their own notifications
    if (req.user.id !== studentId) {
      return res.status(403).json({ error: "Access denied. Unauthorized request." });
    }

    const notifications = await Notification.find({ studentId })
      .populate("companyId", "name companyLogo")
      .populate("jobId", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Unable to fetch notifications." });
  }
};

// Mark a single notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    // Check ownership
    if (req.user.id !== notification.studentId.toString()) {
      return res.status(403).json({ error: "Access denied. Unauthorized request." });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Unable to mark notification as read." });
  }
};

// Mark all notifications for a student as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { studentId } = req.params;
    // Check ownership
    if (req.user.id !== studentId) {
      return res.status(403).json({ error: "Access denied. Unauthorized request." });
    }

    await Notification.updateMany({ studentId, isRead: false }, { isRead: true });

    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Unable to update all notifications." });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    // Check ownership
    if (req.user.id !== notification.studentId.toString()) {
      return res.status(403).json({ error: "Access denied. Unauthorized request." });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Unable to delete notification." });
  }
};

module.exports = {
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
