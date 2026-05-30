import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Code, 
  Globe, 
  FolderGit2, 
  Award,
  ArrowLeft,
  UserPlus
} from "lucide-react";

export const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    department: "",
    cgpa: "",
    skills: "",
    linkedin: "",
    github: "",
    project: "",
  });
  
  const [files, setFiles] = useState({
    profileImage: null,
    resume: null,
    certification: null,
  });

  const [filePreview, setFilePreview] = useState({
    profileImage: null,
    resume: null,
    certification: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      
      setFiles(prev => ({ ...prev, [name]: file }));
      
      if (name === 'profileImage') {
        if (!file.type.startsWith("image/")) {
          toast.warning("Please upload a valid image file.");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(prev => ({ ...prev, profileImage: event.target.result }));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(prev => ({ ...prev, [name]: file.name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.warning("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    try {
      setLoading(true);
      
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      
      if (files.profileImage) payload.append('profileImage', files.profileImage);
      if (files.resume) payload.append('resume', files.resume);
      if (files.certification) payload.append('certification', files.certification);

      const res = await adminService.addStudent(payload);
      toast.success(res.message || "Student profile successfully created!");
      navigate("/admin/students");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create student account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => navigate("/admin/students")}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "8px 12px",
            borderRadius: "8px",
            color: "#94a3b8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to List</span>
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>Manually Add Student</h2>
          <p style={{ margin: "3px 0 0 0", color: "#64748b", fontSize: "13px" }}>Create a vetted candidate profile with complete academic and coding credentials.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)"
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Section 1: Security & Credentials */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              1. Basic Credentials
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Full Name *</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="text" name="username" placeholder="e.g. Fathima Zahiya" value={formData.username} onChange={handleChange} required style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="email" name="email" placeholder="student@hirebridge.com" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Login Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Confirm Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Academics */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              2. Academic & Personal Details
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="text" name="phoneNumber" placeholder="e.g. +91 9876543210" value={formData.phoneNumber} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Academic Department</label>
                <div style={{ position: "relative" }}>
                  <GraduationCap size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="text" name="department" placeholder="e.g. MCA, BCA, CSE" value={formData.department} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Cumulative CGPA Scale</label>
                <div style={{ position: "relative" }}>
                  <Award size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="number" step="0.01" min="0" max="10" name="cgpa" placeholder="e.g. 8.75" value={formData.cgpa} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Residential Address</label>
              <div style={{ position: "relative" }}>
                <MapPin size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <input type="text" name="address" placeholder="Street, City, State, Country" value={formData.address} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
              </div>
            </div>
          </div>

          {/* Section 3: Professional Portfolio Links & Files */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              3. Skills, Portfolios & Documents
            </h4>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Technical Skills (Comma separated)</label>
              <div style={{ position: "relative" }}>
                <Code size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <input type="text" name="skills" placeholder="React.js, Node.js, Express, MongoDB, Java, Python" value={formData.skills} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>LinkedIn Profile Url</label>
                <div style={{ position: "relative" }}>
                  <Globe size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="url" name="linkedin" placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>GitHub Profile Url</label>
                <div style={{ position: "relative" }}>
                  <Globe size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="url" name="github" placeholder="https://github.com/username" value={formData.github} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Major Projects Description</label>
              <div style={{ position: "relative" }}>
                <FolderGit2 size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <input type="text" name="project" placeholder="HireBridge, E-Commerce Platform" value={formData.project} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
              </div>
            </div>

            {/* File Uploads */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Resume (PDF)</label>
                <input type="file" name="resume" accept=".pdf" onChange={handleFileChange} style={{ color: "#94a3b8", fontSize: "13px" }} />
                {filePreview.resume && <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#10b981" }}>✓ {filePreview.resume}</p>}
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Profile Image (JPG/PNG)</label>
                <input type="file" name="profileImage" accept=".jpg,.jpeg,.png" onChange={handleFileChange} style={{ color: "#94a3b8", fontSize: "13px" }} />
                {filePreview.profileImage && (
                  <img src={filePreview.profileImage} alt="Preview" style={{ display: "block", marginTop: "10px", width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Certification (PDF/Image)</label>
                <input type="file" name="certification" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} style={{ color: "#94a3b8", fontSize: "13px" }} />
                {filePreview.certification && <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#10b981" }}>✓ {filePreview.certification}</p>}
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              color: "white",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              transition: "transform 0.1s"
            }}
          >
            {loading ? (
              <span>Creating Student Account...</span>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Add Student Profile</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
