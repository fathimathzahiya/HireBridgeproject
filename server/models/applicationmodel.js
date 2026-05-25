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

    notes: {
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