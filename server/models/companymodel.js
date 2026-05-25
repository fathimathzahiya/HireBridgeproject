const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
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
      required: false,
    },

    industry: {
      type: String,
      required: false,
    },

    companySize: {
      type: String,
      required: false,
      enum: ["Startup", "Small", "Medium", "Large", "Enterprise"],
    },

    HRName: {
      type: String,
      required: true,
    },

    HREmail: {
      type: String,
      required: false,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    companyLogo: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    aboutCompany: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: true,
    },

    confirmPassword: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const companyCollection = model("company", companySchema);

module.exports = companyCollection;