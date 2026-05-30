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

const updatestudent = async(req, res) => {
    try{
        console.log('Update request received for ID:', req.params.id);
        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files ? Object.keys(req.files) : 'None');

        // Prepare update data from request body
        const updateData = {};
        
        // Copy text fields from req.body (only valid fields)
        const allowedFields = ['username', 'email', 'phoneNumber', 'department', 'cgpa', 'project', 'skills', 'github', 'linkedin', 'address', 'password', 'confirmPassword'];
        
        for (let field of allowedFields) {
            if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
                // Convert cgpa to number if it exists
                if (field === 'cgpa') {
                    updateData[field] = parseFloat(req.body[field]);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        }

        console.log('Fields to update (before files):', updateData);

        // Process file uploads if they exist
        if (req.files) {
            if (req.files.profileImage && req.files.profileImage[0]) {
                updateData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
                console.log('Profile image uploaded:', updateData.profileImage);
            }
            if (req.files.resume && req.files.resume[0]) {
                updateData.resume = `/uploads/${req.files.resume[0].filename}`;
                console.log('Resume uploaded:', updateData.resume);
            }
            if (req.files.certification && req.files.certification[0]) {
                const certFile = req.files.certification[0];
                if (certFile.mimetype !== 'application/pdf') {
                    const fs = require('fs');
                    try {
                        fs.unlinkSync(certFile.path);
                    } catch (e) {
                        console.error('Failed to unlink invalid cert file:', e);
                    }
                    return res.status(400).json({ error: "Certificate must be in PDF format only." });
                }
                updateData.certification = `/uploads/${certFile.filename}`;
                console.log('Certification uploaded:', updateData.certification);
            }
        }

        console.log('Final update data:', updateData);

        const student = await studentcollection.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        );
        
        if (!student) {
            console.error('Student not found with ID:', req.params.id);
            return res.status(404).json({ error: 'Student not found.' });
        }
        
        console.log('Student updated successfully:', student);
        res.json(student);
        
    } catch(error) {
        console.error('Update student error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: error.message || 'Unable to update student.' });
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

