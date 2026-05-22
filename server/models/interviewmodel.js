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
  },

);

const interviewCollection = model(
  "interview",
  interviewSchema
);

module.exports = interviewCollection;