const express = require("express");
const notificationrouter = express.Router();
const { protect, studentOnly } = require("../middleware/authMiddleware");
const {
  getStudentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationcontroller");

// All notification routes are protected by JWT and student-only
notificationrouter.get("/notifications/student/:studentId", protect, studentOnly, getStudentNotifications);
notificationrouter.put("/notifications/:notificationId/read", protect, studentOnly, markNotificationAsRead);
notificationrouter.put("/notifications/student/:studentId/read-all", protect, studentOnly, markAllNotificationsAsRead);
notificationrouter.delete("/notifications/:notificationId", protect, studentOnly, deleteNotification);

module.exports = notificationrouter;
