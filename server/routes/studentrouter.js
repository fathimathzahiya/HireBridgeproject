const express=require('express');
const studentrouter=express.Router();
const {createstudent,getstudent, getsinglestudent, updatestudent,deletestudent}= require("../controllers/studentcontroller");
studentrouter.post("/student",createstudent);
studentrouter.get("/getstudent",getstudent);
studentrouter.get("/getsinglestudent/:id",getsinglestudent);
studentrouter.put("/updatestudent/:id",updatestudent);
studentrouter.delete("/deletestudent/:id",deletestudent);
module.exports=studentrouter;