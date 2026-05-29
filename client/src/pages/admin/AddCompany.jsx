import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Layers, 
  FileText, 
  Image,
  ArrowLeft,
  PlusCircle
} from "lucide-react";

export const AddCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    hrName: "",
    hrEmail: "",
    password: "",
    about: "",
    logo: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.hrName.trim() || !formData.hrEmail.trim() || !formData.password.trim()) {
      toast.warning("Please fill in all required fields (Company Name, HR Name, HR Email, Password).");
      return;
    }

    try {
      setLoading(true);
      const res = await adminService.addCompany(formData);
      toast.success(res.message || "Recruiter company successfully registered!");
      navigate("/admin/companies");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create recruiter company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header operations */}
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
          <p style={{ margin: "3px 0 0 0", color: "#64748b", fontSize: "13px" }}>Create a recruiter account profile with immediate platform access and approval status.</p>
        </div>
      </div>

      {/* Main Glassmorphic Form Card */}
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
          
          {/* Section 1: Recruiter Profile */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              1. Corporate Credentials
            </h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              {/* Company Name */}
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Company / Employer Name *</label>
                <div style={{ position: "relative" }}>
                  <Building2 size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="e.g. HireBridge Tech Solutions"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 38px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.15)",
                      color: "white",
                      outline: "none",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: HR Representative & Auth */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              2. HR Contact & Login Settings
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
              {/* HR Name */}
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>HR Manager Name *</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input
                    type="text"
                    name="hrName"
                    placeholder="e.g. Sarah Miller"
                    value={formData.hrName}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 38px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.15)",
                      color: "white",
                      outline: "none",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              {/* HR Email */}
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>HR Email Address *</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input
                    type="email"
                    name="hrEmail"
                    placeholder="recruiter@company.com"
                    value={formData.hrEmail}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 38px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.15)",
                      color: "white",
                      outline: "none",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              {/* Login Password */}
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Login Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 38px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.15)",
                      color: "white",
                      outline: "none",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Branding & About */}
          <div>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "14px", color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
              3. Branding & Context
            </h4>

            {/* Logo */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Company Logo Image Link</label>
              <div style={{ position: "relative" }}>
                <Image size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <input
                  type="url"
                  name="logo"
                  placeholder="https://example.com/logo.png"
                  value={formData.logo}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 15px 10px 38px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.15)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            {/* About */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", fontWeight: "600", marginBottom: "6px" }}>Corporate Description / About</label>
              <div style={{ position: "relative" }}>
                <FileText size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "#64748b" }} />
                <textarea
                  name="about"
                  placeholder="Summarize recruiter's primary engineering domains, global locations, and campus hiring objectives..."
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px 15px 10px 38px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.15)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
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
            onMouseOver={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseOut={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm text-light" role="status" style={{ width: "1rem", height: "1rem" }} />
                <span>Creating Recruiter Account...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Add Company Profile</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

