const Interview = require("../models/interviewmodel");
const Application = require("../models/applicationmodel");
const Job = require("../models/jobmodel");
const Company = require("../models/companymodel");
const Notification = require("../models/notificationmodel");

// Helper function to scan and automatically complete past interviews
const autoUpdatePastInterviews = async () => {
  try {
    const now = new Date();
    const scheduledInterviews = await Interview.find({ status: "Scheduled" });

    for (let interview of scheduledInterviews) {
      try {
        // interview.date is format 'YYYY-MM-DD', interview.time is 'HH:MM'
        const [year, month, day] = interview.date.split("-").map(Number);
        const [hours, minutes] = interview.time.split(":").map(Number);
        
        // Month in Date constructor is 0-indexed
        const interviewDate = new Date(year, month - 1, day, hours, minutes);

        // Auto-complete if now is past the interview start time
        if (now > interviewDate) {
          interview.status = "Completed";
          await interview.save();
        }
      } catch (err) {
        console.error(`Error auto-completing interview ${interview._id}:`, err);
      }
    }
  } catch (error) {
    console.error("Error in autoUpdatePastInterviews:", error);
  }
};

// ===== COMPANY INTERVIEW OPERATIONS =====

// Schedule an interview
const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      studentId,
      companyId,
      jobId,
      date,
      time,
      googleMeetLink,
      instructions,
    } = req.body;

    // Create interview
    const interview = await Interview.create({
      applicationId,
      studentId,
      companyId,
      jobId,
      date,
      time,
      googleMeetLink,
      instructions,
      status: "Scheduled",
    });

    // Update application status and store details
    await Application.findByIdAndUpdate(applicationId, {
      status: "Interview Scheduled",
      interviewDate: date,
      interviewTime: time,
      interviewLink: googleMeetLink,
    });

    // Send notification to student
    try {
      const job = await Job.findById(jobId);
      const company = await Company.findById(companyId);
      await Notification.create({
        studentId,
        applicationId,
        companyId,
        jobId,
        message: `Your interview for the ${job?.title || "Job"} role at ${company?.name || "Company"} has been scheduled on ${date} at ${time}.`,
        type: "InterviewScheduled",
      });
    } catch (notifError) {
      console.error("Failed to create interview schedule notification:", notifError);
    }

    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to schedule interview" });
  }
};

// Get company interviews
const getCompanyInterviews = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Run auto-complete check first
    await autoUpdatePastInterviews();

    const interviews = await Interview.find({ companyId })
      .populate("applicationId")
      .populate("studentId")
      .populate("jobId")
      .sort({ date: 1, time: 1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch interviews" });
  }
};

// Get interviews by status
const getInterviewsByStatus = async (req, res) => {
  try {
    const { companyId, status } = req.params;

    // Run auto-complete check first
    await autoUpdatePastInterviews();

    const interviews = await Interview.find({ companyId, status })
      .populate("applicationId")
      .populate("studentId")
      .populate("jobId")
      .sort({ date: 1, time: 1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch interviews" });
  }
};

// Update interview status (complete / select / reject)
const updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status, result, feedback } = req.body;

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (result !== undefined) updateFields.result = result;
    if (feedback !== undefined) updateFields.feedback = feedback;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      updateFields,
      { new: true }
    )
      .populate("applicationId")
      .populate("studentId")
      .populate("jobId")
      .populate("companyId");

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Handle Selection or Rejection outcomes
    if (result === "Selected") {
      await Application.findByIdAndUpdate(interview.applicationId._id, {
        status: "Selected",
      });

      // Send selection notification
      try {
        await Notification.create({
          studentId: interview.studentId._id,
          applicationId: interview.applicationId._id,
          companyId: interview.companyId._id,
          jobId: interview.jobId._id,
          message: `Congratulations! You have been Selected for the ${interview.jobId?.title} role at ${interview.companyId?.name}. Check your email/dashboard!`,
          type: "Selected",
        });
      } catch (notifErr) {
        console.error("Failed to create selection notification:", notifErr);
      }
    } else if (result === "Rejected") {
      await Application.findByIdAndUpdate(interview.applicationId._id, {
        status: "Rejected",
      });

      // Send rejection notification
      try {
        await Notification.create({
          studentId: interview.studentId._id,
          applicationId: interview.applicationId._id,
          companyId: interview.companyId._id,
          jobId: interview.jobId._id,
          message: `Thank you for your interest. Your application for the ${interview.jobId?.title} role at ${interview.companyId?.name} was unsuccessful.`,
          type: "Rejected",
        });
      } catch (notifErr) {
        console.error("Failed to create rejection notification:", notifErr);
      }
    }

    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update interview" });
  }
};

// ===== STUDENT INTERVIEW OPERATIONS =====

// Get student interviews
const getStudentInterviews = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Run auto-complete check first
    await autoUpdatePastInterviews();

    const interviews = await Interview.find({ studentId })
      .populate("applicationId")
      .populate("companyId")
      .populate("jobId")
      .sort({ date: 1, time: 1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch interviews" });
  }
};

// Get upcoming interviews for student
const getStudentUpcomingInterviews = async (req, res) => {
  try {
    const { studentId } = req.params;
    const todayStr = new Date().toISOString().split("T")[0];

    // Run auto-complete check first
    await autoUpdatePastInterviews();

    const interviews = await Interview.find({
      studentId,
      status: "Scheduled",
      date: { $gte: todayStr },
    })
      .populate("applicationId")
      .populate("companyId")
      .populate("jobId")
      .sort({ date: 1, time: 1 });

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch upcoming interviews" });
  }
};

// Cancel interview (by student or company)
const cancelInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      { status: "Cancelled" },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // Update application status back to shortlisted and clear interview details
    await Application.findByIdAndUpdate(interview.applicationId, {
      status: "Shortlisted",
      interviewDate: null,
      interviewTime: null,
      interviewLink: null,
    });

    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to cancel interview" });
  }
};

module.exports = {
  scheduleInterview,
  getCompanyInterviews,
  getInterviewsByStatus,
  updateInterviewStatus,
  getStudentInterviews,
  getStudentUpcomingInterviews,
  cancelInterview,
};
