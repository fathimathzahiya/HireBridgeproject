const express=require('express');
const interviewrouter=express.Router();
const {createinterview,getinterview, getsingleinterview, updateinterview,deleteinterview}= require("../controllers/interviewcontroller");
interviewrouter.post("/interview",createinterview);
interviewrouter.get("/getinterview",getinterview);
interviewrouter.get("/getsingleinterview/:id",getsingleinterview);
interviewrouter.put("/updateinterview/:id",updateinterview);
interviewrouter.delete("/deleteinterview/:id",deleteinterview);
module.exports=interviewrouter;