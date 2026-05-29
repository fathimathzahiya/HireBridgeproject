import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { CompanyDetails } from "./CompanyDetails";
import {
  Search,
  Check,
  X,
  Lock,
  Unlock,
  Trash2,
  Eye,
  Building2,
  PlusCircle
} from "lucide-react";

export const CompanyManagement = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("All");
  const [jobsData, setJobsData] = useState([]);

  useEffect(() => {
    fetchCompanies();
    fetchJobsData();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch company listings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsData = async () => {
    try {
      const data = await adminService.getJobs();
      setJobsData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveCompany(id);
      toast.success("Recruiter profile approved successfully!");
      fetchCompanies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve corporate profile.");
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await adminService.blockCompany(id);
      toast.success(res.message);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle recruiter block status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company profile? All posted jobs and application links will be affected.")) {
      try {
        await adminService.deleteCompany(id);
        toast.success("Corporate account profile permanently removed.");
        fetchCompanies();
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove company profile.");
      }
    }
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setShowDetailsDrawer(true);
  };

  // Get job counts for companies
  const getJobCount = (companyId) => {
    return jobsData.filter((job) => (job.companyId?._id || job.companyId) === companyId).length;
  };

  // Filter listings
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.HRName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesApproval =
      approvalFilter === "All"
        ? true
        : approvalFilter === "Approved"
        ? c.isApproved
        : !c.isApproved;

    return matchesSearch && matchesApproval;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Company Management</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>Approve new recruiters, verify profiles, and manage active jobs.</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => navigate("/admin/companies/add")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
              transition: "transform 0.1s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <PlusCircle size={14} />
            <span>Add Company</span>
          </button>
          
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "8px 16px", borderRadius: "8px" }}>
            Total: {filteredCompanies.length} Recruiters
          </div>
        </div>
      </div>

      {/* Advanced search and vetting status filter controls */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center"
      }}>
        {/* Search */}
        <div style={{ flex: "2 1 250px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search recruiters by name, email, HR manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px 10px 40px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.1)",
              color: "white",
              outline: "none",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Approval vetting categories tabs */}
        <div style={{ display: "flex", gap: "10px" }}>
          {["All", "Approved", "Pending Vetting"].map((tab) => (
            <button
              key={tab}
              onClick={() => setApprovalFilter(tab)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                backgroundColor: approvalFilter === tab ? "#3b82f6" : "rgba(255,255,255,0.02)",
                color: approvalFilter === tab ? "white" : "#cbd5e1",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Companies Table grid */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        overflowX: "auto"
      }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading recruiters...</p>
        ) : filteredCompanies.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No matching company records found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                <th style={{ padding: "16px 20px" }}>Company Logo & Name</th>
                <th style={{ padding: "16px 20px" }}>HR Manager</th>
                <th style={{ padding: "16px 20px" }}>HR Email</th>
                <th style={{ padding: "16px 20px" }}>Jobs Posted</th>
                <th style={{ padding: "16px 20px" }}>Vetting status</th>
                <th style={{ padding: "16px 20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="table-row-hover">
                  <td style={{ padding: "16px 20px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={
                        company.companyLogo?.startsWith("http")
                          ? company.companyLogo
                          : `http://localhost:5000${company.companyLogo}`
                      }
                      alt="logo"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        objectFit: "cover"
                      }}
                    />
                    <span>{company.name}</span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>{company.HRName}</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{company.email}</td>
                  <td style={{ padding: "16px 20px", fontWeight: "700", textAlign: "center", color: "#3b82f6" }}>
                    {getJobCount(company._id)}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 6px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "700",
                        textAlign: "center",
                        width: "fit-content",
                        backgroundColor: company.isApproved ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                        color: company.isApproved ? "#10b981" : "#f59e0b"
                      }}>
                        {company.isApproved ? "Approved Recruiter" : "Pending Vetting"}
                      </span>
                      {company.isBlocked && (
                        <span style={{
                          display: "inline-block",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: "700",
                          textAlign: "center",
                          width: "fit-content",
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#ef4444"
                        }}>
                          Blocked Account
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleViewDetails(company)}
                        style={{ border: "none", background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="View details"
                      >
                        <Eye size={15} />
                      </button>

                      {!company.isApproved && (
                        <button
                          onClick={() => handleApprove(company._id)}
                          style={{ border: "none", background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                          title="Approve recruiter profile"
                        >
                          <Check size={15} />
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleBlock(company._id)}
                        style={{
                          border: "none",
                          background: company.isBlocked ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          color: company.isBlocked ? "#10b981" : "#ef4444",
                          padding: "6px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                        title={company.isBlocked ? "Unblock company" : "Block company"}
                      >
                        {company.isBlocked ? <Unlock size={15} /> : <Lock size={15} />}
                      </button>

                      <button
                        onClick={() => handleDelete(company._id)}
                        style={{ border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="Delete company profile"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DRAWER POPUP FOR DETAILED VIEW */}
      {showDetailsDrawer && selectedCompany && (
        <CompanyDetails
          company={selectedCompany}
          onClose={() => {
            setShowDetailsDrawer(false);
            setSelectedCompany(null);
          }}
          jobsCount={getJobCount(selectedCompany._id)}
          jobsData={jobsData}
        />
      )}
    </div>
  );
};

export default CompanyManagement;
