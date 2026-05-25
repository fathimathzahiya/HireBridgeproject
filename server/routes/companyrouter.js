const express = require("express");
const companyrouter = express.Router();
const {
  getCompanyDashboard,
  getSingleCompany,
  updateCompanyProfile,
  getAllCompanies,
} = require("../controllers/companycontroller");

// ===== COMPANY PROFILE ROUTES =====
companyrouter.get("/companies", getAllCompanies);
companyrouter.get("/company/:companyId", getSingleCompany);
companyrouter.get("/company/:companyId/dashboard", getCompanyDashboard);
companyrouter.put("/company/:companyId", updateCompanyProfile);

module.exports = companyrouter;