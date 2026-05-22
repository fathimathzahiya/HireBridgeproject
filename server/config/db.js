const mongoose = require("mongoose");
const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/project");
        console.log("mongoDB connected");
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
};
module.exports=connectDB;