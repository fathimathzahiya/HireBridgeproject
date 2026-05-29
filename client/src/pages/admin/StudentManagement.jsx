import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { StudentDetails } from "./StudentDetails";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  FileText,
  Plus
} from "lucide-react";

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [cgpaFilter, setCgpaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");

  // Edit Form State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    department: "",
    cgpa: "",
    skills: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load student profiles.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await adminService.blockStudent(id);
      toast.success(res.message);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle student account lock.");
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this student record? This action cannot be undone.")) {
      try {
        await adminService.deleteStudent(id);
        toast.success("Student record successfully removed.");
        fetchStudents();
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove student record.");
      }
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsDrawer(true);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditFormData({
      username: student.username || "",
      email: student.email || "",
      department: student.department || "",
      cgpa: student.cgpa || "",
      skills: student.skills || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateStudent(editingStudent._id, editFormData);
      toast.success("Student details updated successfully!");
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student profile.");
    }
  };

  const handleViewResume = async (resumePath) => {
    if (!resumePath) {
      toast.error("No resume uploaded by this student.");
      return;
    }
    
    try {
      const token = localStorage.getItem("hirebridge_token");
      let url = resumePath;
      if (!resumePath.startsWith("http")) {
        const filename = resumePath.replace("/uploads/", "");
        url = `http://localhost:5000/api/applications/resume/${filename}`;
      }
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Unable to fetch resume file from server");
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      toast.error("Failed to retrieve resume PDF: " + err.message);
    }
  };

  // Extract unique departments dynamically
  const uniqueDepts = [...new Set(students.map((s) => s.department))].filter(Boolean);

  // Filter Student records
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.skills && s.skills.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = !deptFilter || s.department === deptFilter;
    
    // CGPA filters (e.g. '7' means >= 7.0)
    const matchesCgpa = !cgpaFilter || (s.cgpa && s.cgpa >= parseFloat(cgpaFilter));

    // Block status
    const matchesBlock = !blockFilter || (blockFilter === "blocked" ? s.isBlocked : !s.isBlocked);

    return matchesSearch && matchesDept && matchesCgpa && matchesBlock;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Student Management</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>View, modify, and review registered student profiles.</p>
        </div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "8px 16px", borderRadius: "8px" }}>
          Total: {filteredStudents.length} Students
        </div>
      </div>

      {/* Advanced Filtering drawer row */}
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
            placeholder="Search students by name, email, skills..."
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

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "3 1 450px" }}>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{ flex: "1 1 130px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="">All Departments</option>
            {uniqueDepts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={cgpaFilter}
            onChange={(e) => setCgpaFilter(e.target.value)}
            style={{ flex: "1 1 130px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="">CGPA Filter</option>
            <option value="6">6.0 & Above</option>
            <option value="7">7.0 & Above</option>
            <option value="8">8.0 & Above</option>
            <option value="9">9.0 & Above</option>
          </select>

          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            style={{ flex: "1 1 130px", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.6)", color: "white", cursor: "pointer", fontSize: "13px" }}
          >
            <option value="">Account Status</option>
            <option value="active">Active accounts</option>
            <option value="blocked">Blocked accounts</option>
          </select>

          {(searchQuery || deptFilter || cgpaFilter || blockFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setDeptFilter("");
                setCgpaFilter("");
                setBlockFilter("");
              }}
              style={{
                padding: "10px 15px",
                backgroundColor: "#ef4444",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Student Data Table */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        overflowX: "auto"
      }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No matching student records found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
                <th style={{ padding: "16px 20px" }}>Name</th>
                <th style={{ padding: "16px 20px" }}>Email</th>
                <th style={{ padding: "16px 20px" }}>Department</th>
                <th style={{ padding: "16px 20px" }}>CGPA</th>
                <th style={{ padding: "16px 20px" }}>Skills</th>
                <th style={{ padding: "16px 20px" }}>Account Status</th>
                <th style={{ padding: "16px 20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="table-row-hover">
                  <td style={{ padding: "16px 20px", fontWeight: "600" }}>{student.username}</td>
                  <td style={{ padding: "16px 20px", color: "#cbd5e1" }}>{student.email}</td>
                  <td style={{ padding: "16px 20px" }}>{student.department || "N/A"}</td>
                  <td style={{ padding: "16px 20px", fontWeight: "700", color: "#3b82f6" }}>{student.cgpa?.toFixed(2) || "N/A"}</td>
                  <td style={{ padding: "16px 20px", color: "#94a3b8" }}>
                    {student.skills ? (student.skills.substring(0, 30) + (student.skills.length > 30 ? "..." : "")) : "N/A"}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor: student.isBlocked ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      color: student.isBlocked ? "#ef4444" : "#10b981"
                    }}>
                      {student.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleViewDetails(student)}
                        style={{ border: "none", background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="View detailed profile"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleEditClick(student)}
                        style={{ border: "none", background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="Quick Edit details"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(student._id)}
                        style={{
                          border: "none",
                          background: student.isBlocked ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          color: student.isBlocked ? "#10b981" : "#ef4444",
                          padding: "6px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                        title={student.isBlocked ? "Unlock account" : "Lock account"}
                      >
                        {student.isBlocked ? <Unlock size={15} /> : <Lock size={15} />}
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        style={{ border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                        title="Delete record"
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

      {/* QUICK EDIT STUDENT DETAILS MODAL */}
      {editingStudent && (
        <div className="modal-overlay" onClick={() => setEditingStudent(null)} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "30px", width: "450px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "700" }}>Quick Edit Student Profile</h3>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>STUDENT USERNAME</label>
                <input
                  type="text"
                  required
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>BRANCH DEPT</label>
                  <input
                    type="text"
                    required
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>CGPA SCALE</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editFormData.cgpa}
                    onChange={(e) => setEditFormData({ ...editFormData, cgpa: parseFloat(e.target.value) })}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>SKILLS TAGS</label>
                <input
                  type="text"
                  value={editFormData.skills}
                  onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "#0f172a", color: "white", outline: "none" }}
                  placeholder="e.g. JavaScript, React"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  style={{ padding: "10px 15px", border: "none", background: "#334155", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 15px", border: "none", background: "#f59e0b", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER POPUP FOR STUDENT DETAILS VIEW */}
      {showDetailsDrawer && selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => {
            setShowDetailsDrawer(false);
            setSelectedStudent(null);
          }}
          onViewResume={handleViewResume}
        />
      )}
    </div>
  );
};

export default StudentManagement;
