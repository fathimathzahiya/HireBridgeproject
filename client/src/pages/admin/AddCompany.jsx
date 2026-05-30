import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  Building2, 
  Mail, 
  Lock, 
  MapPin,
  Globe,
  Users,
  Phone,
  FileText,
  ArrowLeft,
  Briefcase
} from "lucide-react";

export const AddCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    HRName: "",
    phoneNumber: "",
    location: "",
    description: "",
    password: "",
    confirmPassword: ""
  });
  
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.warning("Please select an image file only.");
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.warning("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    try {
      setLoading(true);
      
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      
      if (profilePhoto) {
        payload.append("profilePhoto", profilePhoto);
      }

      const res = await adminService.addCompany(payload);
      toast.success(res.message || "Company account successfully created!");
      navigate("/admin/companies");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create company account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => navigate("/admin/companies")}
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
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>Manually Add Company</h2>
          <p style={{ margin: "3px 0 0 0", color: "#64748b", fontSize: "13px" }}>Register a new corporate recruiter on the placement platform.</p>
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
          
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              1. Corporate Credentials
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Company Name *</label>
                <div style={{ position: "relative" }}>
                  <Building2 size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="text" name="name" placeholder="e.g. Google India" value={formData.name} onChange={handleChange} required style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>HR Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="email" name="email" placeholder="hr@company.com" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
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

          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              2. Corporate Details
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>HR Manager Name</label>
                <div style={{ position: "relative" }}>
                  <Users size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="text" name="HRName" placeholder="e.g. Jane Doe" value={formData.HRName} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Contact Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="text" name="phoneNumber" placeholder="e.g. +91 9876543210" value={formData.phoneNumber} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Corporate Website</label>
                <div style={{ position: "relative" }}>
                  <Globe size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input type="url" name="website" placeholder="https://company.com" value={formData.website} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Headquarters Location</label>
              <div style={{ position: "relative" }}>
                <MapPin size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <input type="text" name="location" placeholder="City, State, Country" value={formData.location} onChange={handleChange} style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
              </div>
            </div>
            
            <div style={{ marginTop: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Company Description & About</label>
              <div style={{ position: "relative" }}>
                <FileText size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <textarea name="description" placeholder="Provide a brief overview of the company operations..." value={formData.description} onChange={handleChange} rows="3" style={{ width: "100%", padding: "10px 15px 10px 38px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)", color: "white", outline: "none", fontSize: "14px" }} />
              </div>
            </div>

            <div style={{ marginTop: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Company Profile Photo / Logo (JPG/PNG)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <input type="file" name="profilePhoto" accept="image/*" onChange={handlePhotoChange} style={{ color: "#94a3b8", fontSize: "13px" }} />
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                )}
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
              <span>Creating Recruiter Account...</span>
            ) : (
              <>
                <Briefcase size={16} />
                <span>Add Corporate Profile</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
