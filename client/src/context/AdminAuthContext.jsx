import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminService } from "../services/adminService";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("hirebridge_token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const storedToken = localStorage.getItem("hirebridge_token");
      const storedUser = localStorage.getItem("hirebridge_user");
      
      if (storedToken) {
        try {
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          if (parsedUser && parsedUser.role === "admin") {
            const data = await adminService.getProfile();
            setAdmin(data);
          } else {
            // Not an admin
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to load admin profile:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    fetchAdminProfile();
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const data = await adminService.login(email, password);
      
      localStorage.setItem("hirebridge_token", data.token);
      localStorage.setItem("hirebridge_user", JSON.stringify(data.admin));
      
      setToken(data.token);
      setAdmin(data.admin);
      
      toast.success("Admin login successful!");
      navigate("/admin/overview");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid admin credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hirebridge_token");
    localStorage.removeItem("hirebridge_user");
    setToken(null);
    setAdmin(null);
    toast.info("Logged out of Admin Session.");
    navigate("/admin/login");
  };

  const updateAdminState = (updatedAdmin) => {
    localStorage.setItem("hirebridge_user", JSON.stringify(updatedAdmin));
    setAdmin(updatedAdmin);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        updateAdminState,
        isAuthenticated: !!token && admin?.role === "admin",
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

// Protected Route Component for Admin Dashboard
export const ProtectedAdminRoute = ({ children }) => {
  const { token, loading } = useAdminAuth();
  const storedUser = localStorage.getItem("hirebridge_user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  if (loading) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        color: "white"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "4px solid rgba(255,255,255,0.1)",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
        <p style={{ marginTop: "20px", fontWeight: "500", letterSpacing: "1px" }}>Verifying Admin credentials...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!token || !parsedUser || parsedUser.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
