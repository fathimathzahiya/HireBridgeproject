const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: false,
    },

    department: {
      type: String,
      required: false,
    },

    cgpa: {
      type: Number,
      required: false,
    },

    project: {
      type: String,
      required: false,
    },

    skills: {
      type: String,
      required: false,
    },

    certification: {
      type: String,
      required: false,
    },

    resume: {
      type: String,
      required: false,
    },

    profileImage: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    github: {
      type: String,
      required: false,
    },

    linkedin: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const studentCollection = model("student", studentSchema);

module.exports = studentCollection;