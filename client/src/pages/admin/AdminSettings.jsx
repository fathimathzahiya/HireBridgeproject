import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { 
  Settings, 
  ShieldAlert, 
  User, 
  Mail, 
  KeyRound, 
  Save, 
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";

export const AdminSettings = () => {
  const { admin, updateAdminState } = useAdminAuth();
  
  // Profile settings state
  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password settings state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Visibilities
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.warning("Name and email fields cannot be empty.");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await adminService.updateProfile({ name, email });
      updateAdminState(res.admin);
      toast.success(res.message || "General settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update profile settings.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const res = await adminService.updateProfile({ oldPassword, newPassword });
      toast.success(res.message || "Admin password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to change admin password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Account Settings</h2>
        <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
          Modify administrative profile configurations and toggle password authorization policies.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "25px",
        alignItems: "start"
      }}>
        {/* Profile Card settings */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "25px",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ background: "rgba(59,130,246,0.15)", padding: "10px", borderRadius: "10px", color: "#3b82f6" }}>
              <User size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Administrative Profile</h3>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Admin Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Super Admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px 12px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
                <input
                  type="email"
                  placeholder="admin@hirebridge.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px 12px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: isUpdatingProfile ? "rgba(59,130,246,0.5)" : "#3b82f6",
                color: "white",
                cursor: isUpdatingProfile ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { if(!isUpdatingProfile) e.currentTarget.style.background = "#2563eb" }}
              onMouseOut={(e) => { if(!isUpdatingProfile) e.currentTarget.style.background = "#3b82f6" }}
            >
              {isUpdatingProfile ? (
                <>
                  <div className="spinner-border spinner-border-sm text-light" style={{ width: "1rem", height: "1rem" }} role="status"></div>
                  <span>Updating Details...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save General Settings</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change password security card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "25px",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ background: "rgba(139,92,246,0.15)", padding: "10px", borderRadius: "10px", color: "#8b5cf6" }}>
              <KeyRound size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Security Authorization</h3>
          </div>

          <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Old Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Current Admin Password
              </label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  style={{ position: "absolute", right: "12px", top: "12px", border: "none", background: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                New Secure Password
              </label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: "absolute", right: "12px", top: "12px", border: "none", background: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Confirm New Password
              </label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 40px 12px 40px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.2)",
                    color: "white",
                    outline: "none",
                    fontSize: "14px",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: "12px", top: "12px", border: "none", background: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: isUpdatingPassword ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                color: "white",
                cursor: isUpdatingPassword ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { if(!isUpdatingPassword) e.currentTarget.style.transform = "translateY(-1px)" }}
              onMouseOut={(e) => { if(!isUpdatingPassword) e.currentTarget.style.transform = "translateY(0)" }}
            >
              {isUpdatingPassword ? (
                <>
                  <div className="spinner-border spinner-border-sm text-light" style={{ width: "1rem", height: "1rem" }} role="status"></div>
                  <span>Saving Security...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Update Password Credentials</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Security Policies guidelines info card */}
      <div style={{
        background: "rgba(245, 158, 11, 0.05)",
        border: "1px solid rgba(245, 158, 11, 0.15)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        gap: "15px",
        alignItems: "start",
        marginTop: "10px"
      }}>
        <ShieldAlert size={20} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#f59e0b" }}>System-Wide Security Policy</h4>
          <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
            The administrator credentials secure all records including student resumes, corporate job offerings, candidate applications status, and analytical reports. Changing settings triggers audit timber-logs. Please use multi-factor complexity password constraints.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
