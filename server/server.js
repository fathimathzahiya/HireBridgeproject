const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/db');
const app = express();

connectDB();
app.use(cors());

// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const studentroute = require("./routes/studentrouter");
app.use("/api", studentroute);
const companyroute = require("./routes/companyrouter");
app.use("/api", companyroute);
const authroute = require("./routes/authrouter");
app.use(authroute);
const jobroute = require("./routes/jobrouter");
app.use("/api", jobroute);
const applicationroute = require("./routes/applicationrouter");
app.use("/api", applicationroute);
const interviewroute = require("./routes/interviewrouter");
app.use("/api", interviewroute);
const notificationroute = require("./routes/notificationrouter");
app.use("/api", notificationroute);
const adminroute = require("./routes/adminroutes");
app.use("/api/admin", adminroute);

// Automatic Admin account seeding routine
const seedAdmin = async () => {
  try {
    const Admin = require("./models/adminmodel");
    const bcrypt = require("bcryptjs");
    
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("adminpassword123", 10);
      await Admin.create({
        name: "Placement Admin",
        email: "admin@hirebridge.com",
        password: hashedPassword,
        profileImage: "https://i.pravatar.cc/150?img=60",
        role: "admin",
      });
      console.log("Admin account successfully seeded: admin@hirebridge.com / adminpassword123");
    }
  } catch (error) {
    console.error("Admin account seeding failure:", error);
  }
};

app.listen(5000, () => {
  console.log("server running");
  console.log("mongoDB connected");
  seedAdmin();
});

module.exports = connectDB;