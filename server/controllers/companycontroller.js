const Company = require("../models/companymodel");
const Job = require("../models/jobmodel");
const Application = require("../models/applicationmodel");

// ===== COMPANY PROFILE OPERATIONS =====

// Get company dashboard overview
const getCompanyDashboard = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Get total jobs posted
    const totalJobs = await Job.countDocuments({ companyId });

    // Get total applicants
    const totalApplicants = await Application.countDocuments({ companyId });

    // Get shortlisted candidates
    const shortlistedApplicants = await Application.countDocuments({
      companyId,
      status: "Shortlisted",
    });

    // Get scheduled interviews
    const interviewsScheduled = await Application.countDocuments({
      companyId,
      status: "Interview Scheduled",
    });

    // Get open jobs
    const openJobs = await Job.countDocuments({ companyId, status: "Open" });

    res.json({
      company,
      stats: {
        totalJobs,
        totalApplicants,
        shortlistedApplicants,
        interviewsScheduled,
        openJobs,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch company dashboard" });
  }
};

// Get single company profile
const getSingleCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch company" });
  }
};

// Update company profile
const updateCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.params;
    const {
      name,
      website,
      location,
      industry,
      companySize,
      HRName,
      HREmail,
      phoneNumber,
      companyLogo,
      aboutCompany,
    } = req.body;

    const company = await Company.findByIdAndUpdate(
      companyId,
      {
        name,
        website,
        location,
        industry,
        companySize,
        HRName,
        HREmail,
        phoneNumber,
        companyLogo,
        aboutCompany,
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update company profile" });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch companies" });
  }
};

module.exports = {
  getCompanyDashboard,
  getSingleCompany,
  updateCompanyProfile,
  getAllCompanies,
};

