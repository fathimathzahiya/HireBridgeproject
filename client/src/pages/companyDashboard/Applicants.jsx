import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  applicationAPI,
  getApplicationStatusColor,
  sortApplicantsByDate,
} from "../../utils/companyDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./Applicants.css";

const Applicants = () => {
  const { companyId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");

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
        throw new Error("Unable to fetch resume from backend");
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      toast.error("Failed to load resume: " + err.message);
    }
  };
  
  // Interview scheduling modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingApplicantId, setSchedulingApplicantId] = useState(null);
  const [schedLink, setSchedLink] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");

  const statuses = [
    "All",
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Rejected",
  ];

  useEffect(() => {
    fetchApplicants();
  }, [companyId, filterStatus]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      let data;
      if (filterStatus === "All") {
        data = await applicationAPI.getCompanyApplicants(companyId);
      } else {
        data = await applicationAPI.getCompanyApplicantsByStatus(
          companyId,
          filterStatus
        );
      }
      setApplicants(sortApplicantsByDate(data));
      setError(null);
    } catch (err) {
      setError("Failed to fetch applicants");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    if (newStatus === "Interview Scheduled") {
      setSchedulingApplicantId(applicantId);
      setSchedLink("");
      setSchedDate("");
      setSchedTime("");
      setShowScheduleModal(true);
      return;
    }
    try {
      await applicationAPI.updateApplicationStatus(applicantId, {
        status: newStatus,
      });
      toast.success("Application status updated!");
      fetchApplicants();
    } catch (err) {
      toast.error("Error updating status: " + err.message);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!schedLink || !schedDate || !schedTime) {
      toast.warning("Please fill in all interview fields.");
      return;
    }
    try {
      await applicationAPI.updateApplicationStatus(schedulingApplicantId, {
        status: "Interview Scheduled",
        interviewLink: schedLink,
        interviewDate: schedDate,
        interviewTime: schedTime,
      });
      toast.success("Interview scheduled successfully!");
      setShowScheduleModal(false);
      fetchApplicants();
    } catch (err) {
      toast.error("Error scheduling interview: " + err.message);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await applicationAPI.addApplicationNotes(selectedApplicant._id, noteText);
      toast.success("Note added successfully!");
      setNoteText("");
      setShowNoteForm(false);
      fetchApplicants();
    } catch (err) {
      toast.error("Error adding note: " + err.message);
    }
  };

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
  };

  if (loading) {
    return <div className="loading">Loading applicants...</div>;
  }

  return (
    <div className="applicants-container">
      <div className="applicants-header">
        <h2>Applicants Management</h2>
        <p>Total: {applicants.length}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {statuses.map((status) => (
          <button
            key={status}
            className={`filter-tab ${filterStatus === status ? "active" : ""}`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="no-applicants">
          <p>No applicants found for this filter.</p>
        </div>
      ) : (
        <div className="applicants-list">
          {applicants.map((applicant) => (
            <div key={applicant._id} className="applicant-card">
              <div className="applicant-header">
                <div className="applicant-info">
                  <h3>{applicant.studentId?.username}</h3>
                  <p className="email">{applicant.studentId?.email}</p>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getApplicationStatusColor(applicant.status) }}
                >
                  {applicant.status}
                </span>
              </div>

              <div className="applicant-details">
                <div className="detail-item">
                  <span className="label">Job:</span>
                  <span className="value">{applicant.jobId?.title}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Applied On:</span>
                  <span className="value">
                    {formatDateToDDMMYYYY(applicant.appliedAt)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">CGPA:</span>
                  <span className="value">{applicant.studentId?.cgpa || "N/A"}</span>
                </div>
              </div>

              <div className="applicant-actions">
                <select
                  className="status-dropdown"
                  value={applicant.status}
                  onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  className="btn-view"
                  onClick={() => handleViewDetails(applicant)}
                >
                  View Details
                </button>

                {applicant.studentId?.resume && (
                  <button
                    className="btn-view"
                    style={{ backgroundColor: "#0284c7", color: "white" }}
                    onClick={() => handleViewResume(applicant.studentId.resume)}
                  >
                    📄 Resume
                  </button>
                )}

                <button
                  className="btn-note"
                  onClick={() => {
                    handleViewDetails(applicant);
                    setShowNoteForm(true);
                  }}
                >
                  Add Note
                </button>
              </div>

              {applicant.notes && (
                <div className="applicant-notes">
                  <p>
                    <strong>Notes:</strong> {applicant.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div className="modal-overlay" onClick={() => setSelectedApplicant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedApplicant(null)}
            >
              ×
            </button>

            <h3>{selectedApplicant.studentId?.username}</h3>

            <div className="detail-section">
              <h4>Personal Information</h4>
              <p>
                <strong>Email:</strong> {selectedApplicant.studentId?.email}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedApplicant.studentId?.phoneNumber || "N/A"}
              </p>
              <p>
                <strong>Department:</strong>{" "}
                {selectedApplicant.studentId?.department || "N/A"}
              </p>
              <p>
                <strong>CGPA:</strong> {selectedApplicant.studentId?.cgpa || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedApplicant.studentId?.address || "N/A"}
              </p>
              {selectedApplicant.studentId?.resume && (
                <p>
                  <strong>Resume:</strong>{" "}
                  <button 
                    onClick={() => handleViewResume(selectedApplicant.studentId.resume)}
                    style={{
                      background: "#0284c7",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      marginLeft: "5px"
                    }}
                  >
                    View Resume PDF 📄
                  </button>
                </p>
              )}
            </div>

            <div className="detail-section">
              <h4>Application Details</h4>
              <p>
                <strong>Job:</strong> {selectedApplicant.jobId?.title}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {formatDateToDDMMYYYY(selectedApplicant.appliedAt)}
              </p>
              <p>
                <strong>Status:</strong> {selectedApplicant.status}
              </p>
            </div>

            {selectedApplicant.status === "Interview Scheduled" && selectedApplicant.interviewLink && (
              <div className="detail-section" style={{ background: "#f5f3ff", borderLeft: "4px solid #7c3aed", padding: "12px", borderRadius: "4px" }}>
                <h4 style={{ color: "#6d28d9", margin: "0 0 8px 0" }}>📅 Interview Details</h4>
                <p>
                  <strong>Platform Link:</strong>{" "}
                  <a href={selectedApplicant.interviewLink.startsWith("http") ? selectedApplicant.interviewLink : `https://${selectedApplicant.interviewLink}`} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed", textDecoration: "underline", fontWeight: "bold" }}>
                    Join Platform Link
                  </a>
                </p>
                <p>
                  <strong>Date:</strong> {formatDateToDDMMYYYY(selectedApplicant.interviewDate)}
                </p>
                <p>
                  <strong>Time:</strong> {selectedApplicant.interviewTime}
                </p>
              </div>
            )}

            <div className="detail-section">
              <h4>Student Profile</h4>
              <p>
                <strong>Skills:</strong>{" "}
                {selectedApplicant.studentId?.skills || "N/A"}
              </p>
              <p>
                <strong>Projects:</strong>{" "}
                {selectedApplicant.studentId?.project || "N/A"}
              </p>
              <p>
                <strong>Certifications:</strong>{" "}
                {selectedApplicant.studentId?.certification || "N/A"}
              </p>
              {selectedApplicant.studentId?.github && (
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a href={selectedApplicant.studentId?.github} target="_blank" rel="noopener noreferrer">
                    {selectedApplicant.studentId?.github}
                  </a>
                </p>
              )}
              {selectedApplicant.studentId?.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={selectedApplicant.studentId?.linkedin} target="_blank" rel="noopener noreferrer">
                    {selectedApplicant.studentId?.linkedin}
                  </a>
                </p>
              )}
            </div>

            {showNoteForm && (
              <div className="note-form">
                <h4>Add Note</h4>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add interview feedback or notes..."
                  rows="4"
                />
                <button className="btn-submit" onClick={handleAddNote}>
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interview Scheduling Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowScheduleModal(false)}
            >
              ×
            </button>

            <h3 style={{ margin: "0 0 10px 0", fontSize: "20px" }}>📅 Schedule Interview</h3>
            <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
              Please specify the platform link, date, and time for the student's interview.
            </p>

            <form onSubmit={handleScheduleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={{ fontWeight: "600", fontSize: "14px" }}>Interview Link (Google Meet/Zoom/etc.) *</label>
                  <input
                    type="url"
                    required
                    value={schedLink}
                    onChange={(e) => setSchedLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                    <label style={{ fontWeight: "600", fontSize: "14px" }}>Date *</label>
                    <input
                      type="date"
                      required
                      value={schedDate}
                      onChange={(e) => setSchedDate(e.target.value)}
                      style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                    <label style={{ fontWeight: "600", fontSize: "14px" }}>Time *</label>
                    <input
                      type="time"
                      required
                      value={schedTime}
                      onChange={(e) => setSchedTime(e.target.value)}
                      style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "25px" }}>
                <button
                  type="button"
                  className="btn-note"
                  style={{ margin: 0, padding: "8px 16px" }}
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-view"
                  style={{ margin: 0, padding: "8px 16px", backgroundColor: "#7c3aed", color: "white", border: "none" }}
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
