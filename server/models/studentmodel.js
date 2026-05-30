const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    // ========== SECURITY INFORMATION ==========
    password: {
      type: String,
      required: true,
    },

    confirmPassword: {
      type: String,
      required: false,
    },

    // ========== BASIC INFORMATION ==========
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    // ========== ACADEMIC INFORMATION ==========
    department: {
      type: String,
      required: false,
    },

    cgpa: {
      type: Number,
      required: false,
    },

    // ========== PROFESSIONAL INFORMATION ==========
    skills: {
      type: String,
      required: false,
    },

    project: {
      type: String,
      required: false,
    },

    // ========== LINKS & DOCUMENTS ==========
    github: {
      type: String,
      required: false,
    },

    linkedin: {
      type: String,
      required: false,
    },

    resume: {
      type: String,
      required: false,
    },

    certification: {
      type: String,
      required: false,
    },

    profileImage: {
      type: String,
      default: "https://i.pravatar.cc/150",
    },

    // ========== ACCOUNT CONTROL ==========
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ========== METADATA ==========
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const studentCollection = model("student", studentSchema);

module.exports = studentCollection;