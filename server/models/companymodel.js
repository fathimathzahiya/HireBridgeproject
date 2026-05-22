const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    website: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    HRName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
    },
     password: {
      type: String,
      required: true,
    },
     confirmPassword: {
      type: String,
      required: true,
    },
  },
);

const companyCollection = model("company", companySchema);

module.exports = companyCollection;