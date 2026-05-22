const express=require('express');
const jobrouter=express.Router();
const {createjob,getjob, getsinglejob, updatejob,deletejob}= require("../controllers/jobcontroller");
jobrouter.post("/job",createjob);
jobrouter.get("/getjob",getjob);
jobrouter.get("/getsinglejob/:id",getsinglejob);
jobrouter.put("/updatejob/:id",updatejob);
jobrouter.delete("/deletejob/:id",deletejob);
module.exports=jobrouter;