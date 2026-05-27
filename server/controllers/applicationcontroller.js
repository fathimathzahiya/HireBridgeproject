const Application = require("../models/applicationmodel");
const Job = require("../models/jobmodel");
const Student = require("../models/studentmodel");

// ===== STUDENT APPLICATION OPERATIONS =====

// Apply for a job (create application)
const applyForJob = async (req, res) => {
  try {
    const { studentId, jobId, companyId, phone, coverLetter, resume } = req.body;

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
      phone,
      coverLetter,
      resume,
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
    const { status, notes, interviewLink, interviewDate, interviewTime } = req.body;

    const updateFields = { status };
    if (notes !== undefined) updateFields.notes = notes;
    if (interviewLink !== undefined) updateFields.interviewLink = interviewLink;
    if (interviewDate !== undefined) updateFields.interviewDate = interviewDate;
    if (interviewTime !== undefined) updateFields.interviewTime = interviewTime;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      updateFields,
      { new: true }
    )
      .populate("studentId")
      .populate("jobId")
      .populate("companyId");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // If status is Interview Scheduled, automatically create or update an Interview entry
    if (status === "Interview Scheduled" && interviewLink && interviewDate && interviewTime) {
      const Interview = require("../models/interviewmodel");
      await Interview.findOneAndUpdate(
        { applicationId },
        {
          studentId: application.studentId._id || application.studentId,
          companyId: application.companyId._id || application.companyId,
          jobId: application.jobId._id || application.jobId,
          date: interviewDate,
          time: interviewTime,
          googleMeetLink: interviewLink,
          status: "Scheduled",
        },
        { upsert: true, new: true }
      );
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

};

          


