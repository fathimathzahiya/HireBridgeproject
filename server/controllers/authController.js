const StudentAuth = require("../models/studentAuthModel");
const CompanyAuth = require("../models/companyAuthModel");
const StudentProfile = require("../models/studentmodel");
const CompanyProfile = require("../models/companymodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "hirebridge_jwt_secret_key_123456";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerStudentAuth = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, phoneNumber, college, branch, year } = req.body;

    if (!username || !email || !password || !confirmPassword || !phoneNumber || !college || !branch || !year) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const existingUser = await StudentAuth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "A student with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create StudentAuth record
    const studentAuth = await StudentAuth.create({ 
      username, 
      email, 
      password: hashedPassword, 
      phoneNumber, 
      college, 
      branch, 
      year 
    });

    // Create StudentProfile record
    const studentProfile = await StudentProfile.create({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      phoneNumber,
      department: college || "",
    });

    const token = generateToken(studentProfile._id, "student");

    res.json({ 
      id: studentProfile._id, 
      authId: studentAuth._id,
      username: studentAuth.username, 
      email: studentAuth.email, 
      role: "student",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to register student." });
  }
};

const loginStudentAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const student = await StudentAuth.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: "Invalid student email or password." });
    }

    // Compare password (support both plain text fallback and bcrypt)
    const isMatch = (student.password === password) || (await bcrypt.compare(password, student.password));
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid student email or password." });
    }

    // Get student profile
    const studentProfile = await StudentProfile.findOne({ email });
    const profileId = studentProfile?._id || student._id;

    const token = generateToken(profileId, "student");

    res.json({ 
      id: profileId, 
      authId: student._id,
      username: student.username, 
      email: student.email, 
      role: "student",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to login student." });
  }
};

const registerCompanyAuth = async (req, res) => {
  try {
    const { name, email, website, HRName, phoneNumber, location, description, password, confirmPassword } = req.body;

    if (!name || !email || !website || !HRName || !phoneNumber || !location || !description || !password || !confirmPassword) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const existingCompany = await CompanyAuth.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: "A company with this email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create CompanyAuth record
    const companyAuth = await CompanyAuth.create({ 
      name, 
      email, 
      website, 
      HRName, 
      phoneNumber, 
      location, 
      description, 
      password: hashedPassword 
    });

    const profilePhotoPath = req.file ? `/uploads/company/${req.file.filename}` : "https://i.pravatar.cc/150";

    // Create CompanyProfile record
    const companyProfile = await CompanyProfile.create({ 
      name, 
      email, 
      website, 
      HRName, 
      phoneNumber, 
      location, 
      description, 
      password: hashedPassword,
      confirmPassword: hashedPassword,
      profilePhoto: profilePhotoPath,
      companyLogo: profilePhotoPath
    });

    const token = generateToken(companyProfile._id, "company");

    res.json({ 
      id: companyProfile._id, 
      authId: companyAuth._id,
      name: companyProfile.name, 
      email: companyProfile.email, 
      role: "company",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to register company." });
  }
};

const loginCompanyAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const companyAuth = await CompanyAuth.findOne({ email });
    if (!companyAuth) {
      return res.status(400).json({ error: "Invalid company email or password." });
    }

    // Compare password (support both plain text fallback and bcrypt)
    const isMatch = (companyAuth.password === password) || (await bcrypt.compare(password, companyAuth.password));
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid company email or password." });
    }

    // Get the company profile (main company record)
    const companyProfile = await CompanyProfile.findOne({ email });
    const profileId = companyProfile?._id || companyAuth._id;

    const token = generateToken(profileId, "company");
    
    res.json({ 
      id: profileId, 
      name: companyAuth.name, 
      email: companyAuth.email, 
      role: "company",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to login company." });
  }
};

module.exports = {
  registerStudentAuth,
  loginStudentAuth,
  registerCompanyAuth,
  loginCompanyAuth,
};

