const { Schema, model } = require("mongoose");

const companyNotificationSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "student",
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

const companyNotificationCollection = model(
  "companynotification",
  companyNotificationSchema
);

module.exports = companyNotificationCollection;
