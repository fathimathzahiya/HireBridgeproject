const express=require('express');
const studentrouter=express.Router();
const upload = require('../config/multer');
const {createstudent,getstudent, getsinglestudent, updatestudent,deletestudent}= require("../controllers/studentcontroller");

studentrouter.post("/student",createstudent);
studentrouter.get("/student/getstudent",getstudent);
studentrouter.get("/student/getsinglestudent/:id",getsinglestudent);
studentrouter.put("/student/updatestudent/:id", upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'certification', maxCount: 1 }
]), updatestudent);
studentrouter.delete("/student/deletestudent/:id",deletestudent);

module.exports=studentrouter;