const Application = require("../models/applicationmodel");
const Job = require("../models/jobmodel");
const Student = require("../models/studentmodel");

// ===== STUDENT APPLICATION OPERATIONS =====

// Apply for a job (create application)
const applyForJob = async (req, res) => {
  try {
    const { studentId, jobId, companyId } = req.body;

    // Check if student already applied
    const existingApplication = await Application.findOne({
      studentId,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        error: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      studentId,
      jobId,
      companyId,
      status: "Applied",
    });

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to apply for job" });
  }
};

// Get student applications
const getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await Application.find({ studentId })
      .populate("jobId")
      .populate("companyId")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch applications" });
  }
};

// Get student applications by status
const getStudentApplicationsByStatus = async (req, res) => {
  try {
    const { studentId, status } = req.params;

    const applications = await Application.find({
      studentId,
      status,
    })
      .populate("jobId")
      .populate("companyId")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch applications" });
  }
};

// ===== COMPANY APPLICATION OPERATIONS =====

// Get all applicants for company
const getCompanyApplicants = async (req, res) => {
  try {
    const { companyId } = req.params;

    const applicants = await Application.find({ companyId })
      .populate("studentId")
      .populate("jobId")
      .sort({ appliedAt: -1 });

    res.json(applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch applicants" });
  }
};

// Get applicants for specific job
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applicants = await Application.find({ jobId })
      .populate("studentId")
      .populate("companyId")
      .sort({ appliedAt: -1 });

    res.json(applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch job applicants" });
  }
};

// Get applicants by status for company
const getCompanyApplicantsByStatus = async (req, res) => {
  try {
    const { companyId, status } = req.params;

    const applicants = await Application.find({
      companyId,
      status,
    })
      .populate("studentId")
      .populate("jobId")
      .sort({ appliedAt: -1 });

    res.json(applicants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch applicants" });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, notes },
      { new: true }
    )
      .populate("studentId")
      .populate("jobId")
      .populate("companyId");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update application status" });
  }
};

// Add notes to application
const addApplicationNotes = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { notes },
      { new: true }
    );

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to add notes" });
  }
};

module.exports = {
  applyForJob,
  getStudentApplications,
  getStudentApplicationsByStatus,
  getCompanyApplicants,
  getJobApplicants,
  getCompanyApplicantsByStatus,
  updateApplicationStatus,
  addApplicationNotes,
  createapplication,
    getapplication,getsingleapplication
    ,updateapplication,deleteapplication
};
          


