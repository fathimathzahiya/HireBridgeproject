const Admin = require("../models/adminmodel");
const Student = require("../models/studentmodel");
const Company = require("../models/companymodel");
const Job = require("../models/jobmodel");
const Application = require("../models/applicationmodel");
const Interview = require("../models/interviewmodel");
const Notification = require("../models/notificationmodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "hirebridge_jwt_secret_key_123456";

// ===== ADMIN AUTHENTICATION =====

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Invalid admin email or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid admin email or password." });
    }

    // Sign JWT Token
    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        profileImage: admin.profileImage,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server authentication error." });
  }
};

// Retrieve Admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin profile not found." });
    }
    res.json(admin);
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ error: "Server retrieval error." });
  }
};

// Update Admin settings and password
const updateAdminSettings = async (req, res) => {
  try {
    const { name, email, oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin profile not found." });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect old password." });
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();
    res.json({
      message: "Admin account credentials successfully updated.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        profileImage: admin.profileImage,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    res.status(500).json({ error: "Unable to update admin credentials." });
  }
};

// ===== STUDENT MANAGEMENT =====

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve student profiles." });
  }
};

// Get single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch student profile details." });
  }
};

// Update student details
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update student details." });
  }
};

// Add a student manually
const addStudent = async (req, res) => {
  try {
    const { username, email, password, phone, address, department, cgpa, skills, linkedin, github, projects, certifications } = req.body;
    
    // Check if email already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Student email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = await Student.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber: phone,
      address,
      department,
      cgpa: Number(cgpa),
      skills,
      linkedin,
      github,
      project: projects,
      certification: certifications,
      confirmPassword: password,
    });

    res.status(201).json({ message: "Student account successfully created.", student: newStudent });
  } catch (error) {
    console.error("Add student error:", error);
    res.status(500).json({ error: "Unable to manually create student profile." });
  }
};

// Block/Unblock student
const blockStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    student.isBlocked = !student.isBlocked;
    await student.save();
    res.json({ message: `Student status successfully toggled to isBlocked: ${student.isBlocked}`, isBlocked: student.isBlocked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to block/unblock student." });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student record successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete student record." });
  }
};

// ===== COMPANY MANAGEMENT =====

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("-password");
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve company listings." });
  }
};

// Approve recruiter company
const approveCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Recruiter profile not found." });
    }
    company.isApproved = true;
    await company.save();
    res.json({ message: "Company profile approved successfully.", isApproved: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to approve company." });
  }
};

// Block/Unblock company recruiter
const blockCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company profile not found." });
    }
    company.isBlocked = !company.isBlocked;
    await company.save();
    res.json({ message: `Company status successfully toggled to isBlocked: ${company.isBlocked}`, isBlocked: company.isBlocked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to block/unblock company recruiter." });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company record successfully deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete company profile." });
  }
};

// Add a company manually
const addCompany = async (req, res) => {
  try {
    const { companyName, hrName, hrEmail, password, about, logo } = req.body;

    const existing = await Company.findOne({ email: hrEmail });
    if (existing) {
      return res.status(400).json({ error: "HR Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const logoUrl = logo || "https://i.pravatar.cc/150";

    const newCompany = await Company.create({
      name: companyName,
      email: hrEmail,
      HRName: hrName,
      HREmail: hrEmail,
      password: hashedPassword,
      confirmPassword: password,
      aboutCompany: about,
      companyLogo: logoUrl,
      profilePhoto: logoUrl,
      website: "http://not-specified.com",
      phoneNumber: "0000000000",
      isApproved: true,
    });

    res.status(201).json({ message: "Company account successfully created.", company: newCompany });
  } catch (error) {
    console.error("Add company error:", error);
    res.status(500).json({ error: "Unable to manually create recruiter company." });
  }
};

// ===== JOB MANAGEMENT =====

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId", "name location");
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve job postings." });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update job posting." });
  }
};

// Close job opening
const closeJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "Closed" },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to close job opening." });
  }
};

// Delete job posting
const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job posting deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete job posting." });
  }
};

// ===== APPLICATION MANAGEMENT =====

// Get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "username email department cgpa isBlocked")
      .populate("jobId", "title minimumCGPA location salary")
      .populate("companyId", "name location")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to retrieve applications." });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application successfully removed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to remove application." });
  }
};

// ===== INTERVIEW MANAGEMENT =====

// Get all interviews
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("applicationId")
      .populate("studentId", "username email cgpa")
      .populate("companyId", "name HRName HREmail")
      .populate("jobId", "title")
      .sort({ date: 1, time: 1 });
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch platform interviews." });
  }
};

// Manually complete interview
const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to complete interview." });
  }
};

// ===== SYSTEM BULLETIN NOTIFICATIONS =====

// Get all platform notifications for Admin log
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("studentId", "username email department")
      .populate("companyId", "name")
      .populate("jobId", "title")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Get all notifications error:", error);
    res.status(500).json({ error: "Unable to retrieve platform notifications." });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete notification." });
  }
};

// ===== REPORTS & PLATFORM STATS ANALYTICS =====

// Fetch statistics
const getAnalyticsStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();

    // Selected / Rejected Counts
    const selectedCount = await Application.countDocuments({ status: "Selected" });
    const rejectedCount = await Application.countDocuments({ status: "Rejected" });
    const activeRecruiters = await Company.countDocuments({ isBlocked: false, isApproved: true });

    // Success Ratio: Selected / Total Applications
    const successRatio = totalApplications > 0 ? ((selectedCount / totalApplications) * 100).toFixed(1) : "0.0";

    // 1. Department Placement Trends
    // Gather all students and group by department, and see how many are selected
    const students = await Student.find();
    const deptStats = {};
    students.forEach((student) => {
      const dept = student.department || "Unknown";
      if (!deptStats[dept]) {
        deptStats[dept] = { total: 0, placed: 0 };
      }
      deptStats[dept].total += 1;
    });

    // Cross-check placed status by finding selected applications
    const selectedApps = await Application.find({ status: "Selected" }).populate("studentId");
    selectedApps.forEach((app) => {
      if (app.studentId && app.studentId.department) {
        const dept = app.studentId.department;
        if (deptStats[dept]) {
          deptStats[dept].placed += 1;
        }
      }
    });

    const departmentPlacements = Object.keys(deptStats).map((dept) => ({
      department: dept,
      total: deptStats[dept].total,
      placed: deptStats[dept].placed,
      percentage: deptStats[dept].total > 0 ? Math.round((deptStats[dept].placed / deptStats[dept].total) * 100) : 0,
    }));

    // 2. Monthly Placement Trends (Mock timeline for smooth SVG visualizer)
    const monthlyTrends = [
      { month: "Jan", applications: 12, placements: 2 },
      { month: "Feb", applications: 25, placements: 4 },
      { month: "Mar", applications: 45, placements: 9 },
      { month: "Apr", applications: 80, placements: 18 },
      { month: "May", applications: totalApplications || 120, placements: selectedCount || 26 },
    ];

    // 3. Corporate Hiring Shares (Group applications by top recruiters)
    const companySharesRaw = await Application.find().populate("companyId", "name");
    const companySharesMap = {};
    companySharesRaw.forEach((app) => {
      const name = app.companyId?.name || "Other";
      companySharesMap[name] = (companySharesMap[name] || 0) + 1;
    });

    const companyHiringStats = Object.keys(companySharesMap)
      .map((name) => ({
        company: name,
        applications: companySharesMap[name],
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5); // Take top 5 recruiters

    // 4. Activity Logs
    const recentActivity = [];
    const latestStudents = await Student.find().sort({ createdAt: -1 }).limit(3);
    latestStudents.forEach((s) => {
      recentActivity.push({
        id: s._id,
        type: "student",
        text: `New student ${s.username} registered in ${s.department || "General"}`,
        time: s.createdAt,
      });
    });

    const latestCompanies = await Company.find().sort({ createdAt: -1 }).limit(3);
    latestCompanies.forEach((c) => {
      recentActivity.push({
        id: c._id,
        type: "company",
        text: `New recruiter company ${c.name} registered`,
        time: c.createdAt,
      });
    });

    const latestJobs = await Job.find().sort({ createdAt: -1 }).limit(3);
    latestJobs.forEach((j) => {
      recentActivity.push({
        id: j._id,
        type: "job",
        text: `Job role ${j.title} was posted`,
        time: j.createdAt,
      });
    });

    // Sort combined activities by date
    recentActivity.sort((a, b) => b.time - a.time);

    res.json({
      stats: {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalInterviews,
        selectedStudents: selectedCount,
        rejectedApplications: rejectedCount,
        activeRecruiters,
        successRatio,
      },
      charts: {
        departmentPlacements,
        monthlyTrends,
        companyHiringStats,
      },
      recentActivity: recentActivity.slice(0, 8),
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ error: "Unable to retrieve dashboard analytics." });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminSettings,
  getAllStudents,
  addStudent,
  getStudentById,
  updateStudent,
  blockStudent,
  deleteStudent,
  getAllCompanies,
  addCompany,
  approveCompany,
  blockCompany,
  deleteCompany,
  getAllJobs,
  updateJob,
  closeJob,
  deleteJob,
  getAllApplications,
  deleteApplication,
  getAllInterviews,
  completeInterview,
  getAllNotifications,
  deleteNotification,
  getAnalyticsStats,
};
