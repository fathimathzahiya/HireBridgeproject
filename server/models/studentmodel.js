const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    cgpa: {
      type: Number,
      required: true,
    },

    project: {
       type: String,
       required: true,
    },

    skills: {
       type:String,
       required: true,
    },

    certification: {
       type:String,
       required: true,

    },

    resume: {
      type:String,
      required: true,
    },

    profileImage: {
      type:String,
      required: true,
    },

    github: {
      type:String,
      required: true,
    },

    linkedin: {
     type:String,
     required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
);

const studentCollection = model("student", studentSchema);

module.exports = studentCollection;