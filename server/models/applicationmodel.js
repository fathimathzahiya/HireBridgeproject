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
  },
);

const applicationCollection = model(
  "application",
  applicationSchema
);

module.exports = applicationCollection;