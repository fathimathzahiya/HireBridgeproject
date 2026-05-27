const express=require('express');
const studentrouter=express.Router();
const upload = require('../config/multer');
const { protect, studentOnly } = require("../middleware/authMiddleware");
const {createstudent,getstudent, getsinglestudent, updatestudent,deletestudent}= require("../controllers/studentcontroller");

studentrouter.post("/student",createstudent);
studentrouter.get("/student/getstudent", protect, getstudent);
studentrouter.get("/student/getsinglestudent/:id", protect, getsinglestudent);
studentrouter.put("/student/updatestudent/:id", protect, studentOnly, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'certification', maxCount: 1 }
]), updatestudent);
studentrouter.delete("/student/deletestudent/:id", protect, studentOnly, deletestudent);

module.exports=studentrouter;