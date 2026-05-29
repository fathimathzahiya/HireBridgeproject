import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminLogin = () => {
  const { login, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setFormLoading(true);
    await login(email, password);
    setFormLoading(false);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
      fontFamily: "'Inter', sans-serif",
      color: "white",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      {/* Abstract blurred color drops for visual wow effect */}
      <div style={{
        position: "absolute",
        width: "300px",
        height: "300px",
        background: "rgba(59, 130, 246, 0.25)",
        borderRadius: "50%",
        filter: "blur(80px)",
        top: "20%",
        left: "30%",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        width: "250px",
        height: "250px",
        background: "rgba(139, 92, 246, 0.25)",
        borderRadius: "50%",
        filter: "blur(80px)",
        bottom: "20%",
        right: "30%",
        zIndex: 0
      }}></div>

      {/* Glassmorphic Login card */}
      <div style={{
        width: "420px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "40px 35px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        zIndex: 10,
        boxSizing: "border-box"
      }}>
        <h2 style={{
          margin: "0 0 10px 0",
          fontSize: "28px",
          fontWeight: "800",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Admin Console</h2>
        <p style={{
          margin: "0 0 30px 0",
          color: "#94a3b8",
          fontSize: "14px",
          fontWeight: "500"
        }}>HireBridge Placement System</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#cbd5e1", letterSpacing: "0.5px" }}>ADMIN EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hirebridge.com"
              required
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "12px 15px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#cbd5e1", letterSpacing: "0.5px" }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "12px 15px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
            />
          </div>

          <button
            type="submit"
            disabled={loading || formLoading}
            style={{
              marginTop: "10px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              border: "none",
              color: "white",
              fontWeight: "700",
              padding: "14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
              transition: "transform 0.1s, opacity 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = "0.95"}
            onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
          >
            {loading || formLoading ? "Signing In..." : "Log In as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
