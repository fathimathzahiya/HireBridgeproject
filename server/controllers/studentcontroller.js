const studentcollection= require("../models/studentmodel");

const createstudent= async(req,res)=>{
    try{
        const student=await studentcollection.create(req.body);
        res.json(student);
    }catch(error){
        console.log("error");
    }

};

const getstudent=async(req,res)=>{
    try{
        const student=await studentcollection.find();
        res.json(student);
    }catch(error){
        console.log("error");
    }

};

const getsinglestudent=async(req,res)=>{
    try{
        const student=await studentcollection.findById(req.params.id);
        res.json(student);
    }catch(error){
        console.log("error");
    }
    
};

const updatestudent=async(req,res)=>{
    try{
        const student=await studentcollection.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
     res.json(student);
        
    }catch(error){
        console.log("error");
    }
    
};
const deletestudent=async(req,res)=>{
    try{
        await studentcollection.findByIdAndDelete(req.params.id );
        res.json(
            {
                message:("student deleted")
            }
        );

    }catch(error){
        console.log("error");
    }
};

module.exports={
    createstudent,
    getstudent,getsinglestudent
    ,updatestudent,deletestudent
};

