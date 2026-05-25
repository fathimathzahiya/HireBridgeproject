const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const app = express();

connectDB();
app.use(cors());

// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const studentroute = require("./routes/studentrouter");
app.use(studentroute);
const companyroute = require("./routes/companyrouter");
app.use(companyroute);
const authroute = require("./routes/authrouter");
app.use(authroute);
const jobroute = require("./routes/jobrouter");
app.use(jobroute);
const applicationroute = require("./routes/applicationrouter");
app.use(applicationroute);
const interviewroute = require("./routes/interviewrouter");
app.use(interviewroute);

app.listen(5000, () => {
  console.log("server running");
});

module.exports = connectDB;