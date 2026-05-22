const express=require('express');
const companyrouter=express.Router();
const {createcompany,getcompany, getsinglecompany, updatecompany,deletecompany}= require("../controllers/companycontroller");
companyrouter.post("/company",createcompany);
companyrouter.get("/getcompany",getcompany);
companyrouter.get("/getsinglecompany/:id",getsinglecompany);
companyrouter.put("/updatecompany/:id",updatecompany);
companyrouter.delete("/deletecompany/:id",deletecompany);
module.exports=companyrouter;