const jobcollection= require("../models/jobmodel");

const createjob= async(req,res)=>{
    try{
        const job=await jobcollection.create(req.body);
        res.json(job);
    }catch(error){
        console.log("error");
    }

};

const getjob=async(req,res)=>{
    try{
        const job=await jobcollection.find();
        res.json(job);
    }catch(error){
        console.log("error");
    }

};

const getsinglejob=async(req,res)=>{
    try{
        const job=await jobcollection.findById(req.params.id);
        res.json(job);
    }catch(error){
        console.log("error");
    }
    
};

const updatejob=async(req,res)=>{
    try{
        const job=await jobcollection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
     res.json(job);
        
    }catch(error){
        console.log("error");
    }
    
};
const deletejob=async(req,res)=>{
    try{
        await jobcollection.findByIdAndDelete(req.params.id );
        res.json(
            {
                message:("job deleted")
            }
        );

    }catch(error){
        console.log("error");
    }
};

module.exports={
    createjob,
    getjob,getsinglejob
    ,updatejob,deletejob
};

