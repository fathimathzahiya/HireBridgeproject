const Job = require("../models/jobmodel");
const Application = require("../models/applicationmodel");

// ===== STUDENT JOB OPERATIONS =====

// Get all open jobs (for students)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" })
      .populate("companyId")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch jobs" });
  }
};

// Get single job detail
const getSingleJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("companyId");

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch job" });
  }
};

// Search and filter jobs
const searchJobs = async (req, res) => {
  try {
    const { title, location, department, minSalary, maxSalary } = req.query;

    const filter = { status: "Open" };

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (department) {
      filter.department = { $regex: department, $options: "i" };
    }

    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) {
        filter.salary.$gte = minSalary;
      }
      if (maxSalary) {
        filter.salary.$lte = maxSalary;
      }
    }

    const jobs = await Job.find(filter)
      .populate("companyId")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to search jobs" });
  }
};

// ===== COMPANY JOB OPERATIONS =====

// Create a new job posting
const createJob = async (req, res) => {
  try {
    const {
      companyId,
      title,
      description,
      skillRequired,
      salary,
      location,
      jobType,
      minimumCGPA,
      department,
      vaccancy,
      applicationDeadline,
    } = req.body;

    if (
      !companyId ||
      !title ||
      !description ||
      !skillRequired ||
      !salary ||
      !location ||
      !jobType ||
      !minimumCGPA ||
      !department ||
      !vaccancy
    ) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const job = await Job.create({
      companyId,
      title,
      description,
      skillRequired,
      salary,
      location,
      jobType,
      minimumCGPA,
      department,
      vaccancy,
      applicationDeadline,
      status: "Open",
    });

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create job" });
  }
};

// Get company jobs
const getCompanyJobs = async (req, res) => {
  try {
    const { companyId } = req.params;

    const jobs = await Job.find({ companyId }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch company jobs" });
  }
};

// Update job posting
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      title,
      description,
      skillRequired,
      salary,
      location,
      jobType,
      minimumCGPA,
      department,
      vaccancy,
      applicationDeadline,
      status,
    } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        skillRequired,
        salary,
        location,
        jobType,
        minimumCGPA,
        department,
        vaccancy,
        applicationDeadline,
        status,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update job" });
  }
};

// Close job posting
const closeJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status: "Closed", updatedAt: new Date() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to close job" });
  }
};

// Delete job posting
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete job" });
  }
};

// Get job applicant count
const getJobApplicantCount = async (req, res) => {
  try {
    const { jobId } = req.params;

    const count = await Application.countDocuments({ jobId });

    res.json({ jobId, applicantCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch applicant count" });
  }
};

module.exports = {
  getAllJobs,
  getSingleJob,
  searchJobs,
  createJob,
  getCompanyJobs,
  updateJob,
  closeJob,
  deleteJob,
  getJobApplicantCount,
};

