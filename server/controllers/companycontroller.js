const companycollection= require("../models/companymodel");

const createcompany= async(req,res)=>{
    try{
        const company=await companycollection.create(req.body);
        res.json(company);
    }catch(error){
        console.log("error");
    }

};

const getcompany=async(req,res)=>{
    try{
        const company=await companycollection.find();
        res.json(company);
    }catch(error){
        console.log("error");
    }

};

const getsinglecompany=async(req,res)=>{
    try{
        const company=await companycollection.findById(req.params.id);
        res.json(company);
    }catch(error){
        console.log("error");
    }
    
};

const updatecompany=async(req,res)=>{
    try{
        const company=await companycollection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
     res.json(company);
        
    }catch(error){
        console.log("error");
    }
    
};
const deletecompany=async(req,res)=>{
    try{
        await companycollection.findByIdAndDelete(req.params.id );
        res.json(
            {
                message:("company deleted")
            }
        );

    }catch(error){
        console.log("error");
    }
};

module.exports={
    createcompany,
    getcompany,getsinglecompany
    ,updatecompany,deletecompany
};

