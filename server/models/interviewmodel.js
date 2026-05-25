const { Schema, model } = require("mongoose");

const interviewSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "application",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "student",
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

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    googleMeetLink: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    instructions: {
      type: String,
      required: false,
    },

    result: {
      type: String,
      enum: ["Pending", "Selected", "Rejected", "On Hold"],
      default: "Pending",
    },

    feedback: {
      type: String,
      required: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const interviewCollection = model(
  "interview",
  interviewSchema
);

module.exports = interviewCollection;