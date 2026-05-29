const express = require("express");
const authrouter = express.Router();
const companyUpload = require("../config/companyMulter");
const {
  registerStudentAuth,
  loginStudentAuth,
  registerCompanyAuth,
  loginCompanyAuth,
} = require("../controllers/authController");

authrouter.post("/student/auth/register", registerStudentAuth);
authrouter.post("/student/auth/login", loginStudentAuth);
authrouter.post("/company/auth/register", companyUpload.single("profilePhoto"), registerCompanyAuth);
authrouter.post("/company/auth/login", loginCompanyAuth);

module.exports = authrouter;
