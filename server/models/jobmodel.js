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
  },
);

const jobCollection = model("job", jobSchema);

module.exports = jobCollection;