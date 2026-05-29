const { Schema, model } = require("mongoose");

const applicationSchema = new Schema(
  {
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

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"],
      default: "Applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },


    interviewDate: {
      type: String,
      required: false,
    },

    interviewTime: {
      type: String,
      required: false,
    },

    notes: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    coverLetter: {
      type: String,
      required: false,
    },

    resume: {
      type: String,
      required: false,
    },
  },
);

const applicationCollection = model(
  "application",
  applicationSchema
);

module.exports = applicationCollection;