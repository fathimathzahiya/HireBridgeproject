import React from "react";
import { Navigate } from "react-router-dom";
import { useStudentAuth } from "../context/AuthContext";

export const StudentProtectedRoute = ({ children }) => {
  const { token, loading } = useStudentAuth();
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
        <p style={{ marginTop: "20px", fontWeight: "500", letterSpacing: "1px" }}>Verifying student credentials...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!token || !parsedUser || parsedUser.role !== "student") {
    return <Navigate to="/studentlogin" replace />;
  }

  return children;
};
export default StudentProtectedRoute;
