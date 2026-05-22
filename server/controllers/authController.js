const StudentAuth = require("../models/studentAuthModel");
const CompanyAuth = require("../models/companyAuthModel");

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

    const student = await StudentAuth.create({ username, email, password, phoneNumber, college, branch, year });
    res.json({ id: student._id, username: student.username, email: student.email, role: "student" });
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
    if (!student || student.password !== password) {
      return res.status(400).json({ error: "Invalid student email or password." });
    }

    res.json({ id: student._id, username: student.username, email: student.email, role: "student" });
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

    const company = await CompanyAuth.create({ name, email, website, HRName, phoneNumber, location, description, password });
    res.json({ id: company._id, name: company.name, email: company.email, role: "company" });
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

    const company = await CompanyAuth.findOne({ email });
    if (!company || company.password !== password) {
      return res.status(400).json({ error: "Invalid company email or password." });
    }

    res.json({ id: company._id, name: company.name, email: company.email, role: "company" });
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
