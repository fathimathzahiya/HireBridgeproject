require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = async()=>{
    try{
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/project";
        await mongoose.connect(mongoURI);
        console.log("mongoDB connected");
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
};
module.exports=connectDB;