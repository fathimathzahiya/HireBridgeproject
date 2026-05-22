const express=require('express');
const applicationrouter=express.Router();
const {createapplication,getapplication, getsingleapplication, updateapplication,deleteapplication}= require("../controllers/applicationcontroller");
applicationrouter.post("/application",createapplication);
applicationrouter.get("/getapplication",getapplication);
applicationrouter.get("/getsingleapplication/:id",getsingleapplication);
applicationrouter.put("/updateapplication/:id",updateapplication);
applicationrouter.delete("/deleteapplication/:id",deleteapplication);
module.exports=applicationrouter;