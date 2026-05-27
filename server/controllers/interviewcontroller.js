const Interview = require("../models/interviewmodel");
const Application = require("../models/applicationmodel");

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

// Update interview status
const updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status, result, feedback } = req.body;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      { status, result, feedback },
      { new: true }
    )
      .populate("applicationId")
      .populate("studentId")
      .populate("jobId");

    if (!interview) {
      return res.status(404).json({ error: "Interview not found" });
    }

    // If interview result is Selected, update application status
    if (result === "Selected") {
      await Application.findByIdAndUpdate(interview.applicationId, {
        status: "Selected",
      });
    } else if (result === "Rejected") {
      await Application.findByIdAndUpdate(interview.applicationId, {
        status: "Rejected",
      });
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
    const today = new Date();

    const interviews = await Interview.find({
      studentId,
      status: "Scheduled",
      date: { $gte: today.toISOString().split("T")[0] },
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
       



