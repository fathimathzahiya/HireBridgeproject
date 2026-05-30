const Application = require("../models/applicationmodel");
const Job = require("../models/jobmodel");
const Student = require("../models/studentmodel");
const CompanyNotification = require("../models/companynotificationmodel");

// ===== STUDENT APPLICATION OPERATIONS =====

// Apply for a job (create application)
const applyForJob = async (req, res) => {
  try {
    const { studentId, jobId, companyId, phone, coverLetter, resume } = req.body;

    // Fetch the Job and Student to validate CGPA eligibility
    const job = await Job.findById(jobId);
    const student = await Student.findById(studentId);

    if (!job) {
      return res.status(404).json({ error: "Job posting not found" });
    }
    if (!student) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    if (student.cgpa !== undefined && student.cgpa !== null && student.cgpa < job.minimumCGPA) {
      return res.status(400).json({
        error: `You are not eligible for this job based on CGPA requirements. Required: ${job.minimumCGPA}, Your CGPA: ${student.cgpa}`
      });
    }

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

    // Create real-time Company Notification
    try {
      await CompanyNotification.create({
        companyId,
        studentId,
        jobId,
        message: `New application received for ${job.title} role.`,
      });
    } catch (notifErr) {
      console.error("Failed to create company notification:", notifErr);
    }

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
          status: "Scheduled",
        },
        { upsert: true, new: true }
      );
    }

    // Automatically create a notification for the student
    const notificationStatuses = ["Shortlisted", "Interview Scheduled", "Selected", "Rejected"];
    if (notificationStatuses.includes(status)) {
      const Notification = require("../models/notificationmodel");
      let message = "";
      let type = "Other";

      if (status === "Shortlisted") {
        message = `Good news! Your application for the ${application.jobId?.title} role at ${application.companyId?.name} has been Shortlisted.`;
        type = "Shortlisted";
      } else if (status === "Interview Scheduled") {
        const dateStr = interviewDate || application.interviewDate || "";
        const timeStr = interviewTime || application.interviewTime || "";
        message = `Your interview for the ${application.jobId?.title} role at ${application.companyId?.name} has been scheduled for ${dateStr} at ${timeStr}.`;
        type = "InterviewScheduled";
      } else if (status === "Selected") {
        message = `Congratulations! You have been Selected for the ${application.jobId?.title} role at ${application.companyId?.name}. Check your dashboard!`;
        type = "Selected";
      } else if (status === "Rejected") {
        message = `Thank you for applying. We regret to inform you that your application for ${application.jobId?.title} at ${application.companyId?.name} has been rejected.`;
        type = "Rejected";
      }

      await Notification.create({
        studentId: application.studentId._id || application.studentId,
        applicationId: application._id,
        companyId: application.companyId._id || application.companyId,
        jobId: application.jobId._id || application.jobId,
        message,
        type,
      });
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

const fs = require("fs");
const path = require("path");

const viewResume = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.resolve(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/pdf");
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "Resume file not found" });
    }
  } catch (error) {
    console.error("Error viewing resume:", error);
    res.status(500).json({ error: "Unable to load resume file" });
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
  viewResume,
};

          


