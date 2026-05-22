const applicationcollection= require("../models/applicationmodel");

const createapplication= async(req,res)=>{
    try{
        const application=await applicationcollection.create(req.body);
        res.json(application);
    }catch(error){
        console.log("error");
    }

};

const getapplication=async(req,res)=>{
    try{
        const application=await applicationcollection.find();
        res.json(application);
    }catch(error){
        console.log("error");
    }

};

const getsingleapplication=async(req,res)=>{
    try{
        const application=await applicationcollection.findById(req.params.id);
        res.json(application);
    }catch(error){
        console.log("error");
    }
    
};

const updateapplication=async(req,res)=>{
    try{
        const application=await applicationcollection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
     res.json(application);
        
    }catch(error){
        console.log("error");
    }
    
};
const deleteapplication=async(req,res)=>{
    try{
        await applicationcollection.findByIdAndDelete(req.params.id );
        res.json(
            {
                message:("application deleted")
            }
        );

    }catch(error){
        console.log("error");
    }
};

module.exports={
    createapplication,
    getapplication,getsingleapplication
    ,updateapplication,deleteapplication
};

