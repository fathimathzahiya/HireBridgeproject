const { Schema, model } = require("mongoose");

const jobSchema = new Schema(
  {
    companyId: {
       type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skillRequired: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      required: true,
    },

    minimumCGPA: {
      type: Number,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    vaccancy: {
      type: Number,
      required: true,
    },

    applicationDeadline: {
      type: Date,
      required: false,
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open",
    },

    experience: {
      type: String,
      required: false,
    },

    eligibility: {
      type: String,
      required: false,
    },

    additionalFields: {
      type: String,
      required: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const jobCollection = model("job", jobSchema);

module.exports = jobCollection;