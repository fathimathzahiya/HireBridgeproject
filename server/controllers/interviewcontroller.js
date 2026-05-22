const interviewcollection= require("../models/interviewmodel");

const createinterview= async(req,res)=>{
    try{
        const interview=await interviewcollection.create(req.body);
        res.json(interview);
    }catch(error){
        console.log("error");
    }

};

const getinterview=async(req,res)=>{
    try{
        const interview=await interviewcollection.find();
        res.json(interview);
    }catch(error){
        console.log("error");
    }

};

const getsingleinterview=async(req,res)=>{
    try{
        const interview=await interviewcollection.findById(req.params.id);
        res.json(interview);
    }catch(error){
        console.log("error");
    }
    
};

const updateinterview=async(req,res)=>{
    try{
        const interview=await interviewcollection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
     res.json(interview);
        
    }catch(error){
        console.log("error");
    }
    
};
const deleteinterview=async(req,res)=>{
    try{
        await interviewcollection.findByIdAndDelete(req.params.id );
        res.json(
            {
                message:("interview deleted")
            }
        );

    }catch(error){
        console.log("error");
    }
};

module.exports={
    createinterview,
    getinterview,getsingleinterview
    ,updateinterview,deleteinterview
};

