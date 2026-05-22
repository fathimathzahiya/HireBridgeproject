const express = require("express");
const authrouter = express.Router();
const {
  registerStudentAuth,
  loginStudentAuth,
  registerCompanyAuth,
  loginCompanyAuth,
} = require("../controllers/authController");

authrouter.post("/student/auth/register", registerStudentAuth);
authrouter.post("/student/auth/login", loginStudentAuth);
authrouter.post("/company/auth/register", registerCompanyAuth);
authrouter.post("/company/auth/login", loginCompanyAuth);

module.exports = authrouter;
