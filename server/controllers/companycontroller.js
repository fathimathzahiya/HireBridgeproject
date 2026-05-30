const mongoose = require("mongoose");
const Company = require("../models/companymodel");
const Job = require("../models/jobmodel");
const Application = require("../models/applicationmodel");
const CompanyNotification = require("../models/companynotificationmodel");

// ===== COMPANY PROFILE OPERATIONS =====

// Get company dashboard overview
const getCompanyDashboard = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

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

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

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
    
    // Prepare update data from request body
    const updateData = { ...req.body };
    delete updateData.companySize; // Purge companySize completely

    // Process file uploads if they exist
    if (req.files) {
      if (req.files.companyLogo && req.files.companyLogo[0]) {
        const logoPath = `/uploads/${req.files.companyLogo[0].filename}`;
        updateData.companyLogo = logoPath;
        updateData.profilePhoto = logoPath;
        console.log('Company logo updated:', logoPath);
      }
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        const photoPath = `/uploads/${req.files.profilePhoto[0].filename}`;
        updateData.profilePhoto = photoPath;
        updateData.companyLogo = photoPath;
        console.log('Company profile photo updated:', photoPath);
      }
    }

    const company = await Company.findByIdAndUpdate(
      companyId,
      updateData,
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
    const companies = await Company.find().select("-password");
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch companies" });
  }
};

// Get notifications for recruiter company
const getCompanyNotifications = async (req, res) => {
  try {
    const companyId = req.user.id;
    const notifications = await CompanyNotification.find({ companyId })
      .populate("studentId", "username email department cgpa")
      .populate("jobId", "title")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Get company notifications error:", error);
    res.status(500).json({ error: "Unable to fetch notifications" });
  }
};

// Mark notification as read
const markCompanyNotificationAsRead = async (req, res) => {
  try {
    const notification = await CompanyNotification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ error: "Unable to update notification" });
  }
};

// Delete notification
const deleteCompanyNotification = async (req, res) => {
  try {
    const notification = await CompanyNotification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Unable to delete notification" });
  }
};

// Update company profile photo separately
const updateCompanyProfilePhoto = async (req, res) => {
  try {
    const targetCompanyId = req.params.companyId || req.body.companyId || (req.user && req.user.id);
    
    if (!targetCompanyId) {
      return res.status(400).json({ error: "Company ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const company = await Company.findById(targetCompanyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Delete old profile photo if it's local and not default
    const fs = require("fs");
    const path = require("path");
    if (company.profilePhoto && company.profilePhoto.startsWith("/uploads/company/")) {
      const oldPath = path.join(__dirname, "..", company.profilePhoto);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.error("Failed to delete old company profile photo:", e);
        }
      }
    }

    const photoPath = `/uploads/company/${req.file.filename}`;
    company.profilePhoto = photoPath;
    company.companyLogo = photoPath; // sync logo too
    await company.save();

    res.json({
      message: "Company profile photo updated successfully!",
      profilePhoto: photoPath,
      companyLogo: photoPath,
      company
    });
  } catch (error) {
    console.error("Error updating company profile photo:", error);
    res.status(500).json({ error: "Unable to update company profile photo" });
  }
};

module.exports = {
  getCompanyDashboard,
  getSingleCompany,
  updateCompanyProfile,
  updateCompanyProfilePhoto,
  getAllCompanies,
  getCompanyNotifications,
  markCompanyNotificationAsRead,
  deleteCompanyNotification,
};

