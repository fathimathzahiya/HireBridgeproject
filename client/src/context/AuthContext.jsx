import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const StudentAuthContext = createContext(null);

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("hirebridge_token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentProfile = async () => {
      const storedToken = localStorage.getItem("hirebridge_token");
      const storedStudentId = localStorage.getItem("studentId");
      const storedUser = localStorage.getItem("hirebridge_user");
      
      if (storedToken && storedStudentId) {
        try {
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          if (parsedUser && parsedUser.role === "student") {
            const res = await axios.get(`http://localhost:5000/api/student/getsinglestudent/${storedStudentId}`, {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            });
            setStudent(res.data);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to load student profile:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    fetchStudentProfile();
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/student/auth/login", { email, password });
      const data = response.data;
      
      localStorage.setItem("hirebridge_token", data.token);
      localStorage.setItem("hirebridge_user", JSON.stringify({ ...data, role: "student" }));
      localStorage.setItem("studentId", data.id);
      localStorage.setItem("studentName", data.username);
      
      setToken(data.token);
      setStudent(data);
      
      toast.success("Student login successful!");
      navigate("/student-dashboard");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid student credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hirebridge_token");
    localStorage.removeItem("hirebridge_user");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentName");
    setToken(null);
    setStudent(null);
    toast.info("Logged out of Student Session.");
    navigate("/studentlogin");
  };

  const updateStudentState = (updatedStudent) => {
    if (updatedStudent.username) {
      localStorage.setItem("studentName", updatedStudent.username);
    }
    setStudent(updatedStudent);
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        updateStudentState,
        isAuthenticated: !!token && !!student,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider");
  }
  return context;
};
export default StudentAuthContext;
