const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "application",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Shortlisted", "InterviewScheduled", "Selected", "Rejected", "Other"],
      default: "Other",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const notificationCollection = model("notification", notificationSchema);

module.exports = notificationCollection;
