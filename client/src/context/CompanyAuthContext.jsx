import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const CompanyAuthContext = createContext(null);

export const CompanyAuthProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("hirebridge_token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("hirebridge_token");
    localStorage.removeItem("hirebridge_user");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    localStorage.removeItem("companyEmail");
    setToken(null);
    setCompany(null);
    toast.info("Logged out of Company Recruiter Session.");
    navigate("/companylogin");
  }, [navigate]);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const storedToken = localStorage.getItem("hirebridge_token");
      const storedCompanyId = localStorage.getItem("companyId");
      const storedUser = localStorage.getItem("hirebridge_user");
      
      if (storedToken && storedCompanyId) {
        try {
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          if (parsedUser && parsedUser.role === "company") {
            const res = await axios.get(`http://localhost:5000/api/company/${storedCompanyId}`, {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            });
            setCompany(res.data);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to load company profile:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    fetchCompanyProfile();
  }, [token, handleLogout]);

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/company/auth/login", { email, password });
      const data = response.data;
      
      localStorage.setItem("hirebridge_token", data.token);
      localStorage.setItem("hirebridge_user", JSON.stringify({ ...data, role: "company" }));
      localStorage.setItem("companyId", data.id);
      localStorage.setItem("companyName", data.name);
      localStorage.setItem("companyEmail", data.email);
      
      setToken(data.token);
      setCompany(data);
      
      toast.success("Company login successful!");
      navigate(`/company/${data.id}/overview`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid company credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyState = (updatedCompany) => {
    if (updatedCompany.name) {
      localStorage.setItem("companyName", updatedCompany.name);
    }
    setCompany(updatedCompany);
  };

  return (
    <CompanyAuthContext.Provider
      value={{
        company,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        updateCompanyState,
        isAuthenticated: !!token && !!company,
      }}
    >
      {children}
    </CompanyAuthContext.Provider>
  );
};

export const useCompanyAuth = () => {
  const context = useContext(CompanyAuthContext);
  if (!context) {
    throw new Error("useCompanyAuth must be used within a CompanyAuthProvider");
  }
  return context;
};
export default CompanyAuthContext;
