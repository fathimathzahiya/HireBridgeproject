import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("hirebridge_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default ProtectedRoute;
