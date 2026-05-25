import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  applicationAPI,
  getApplicationStatusColor,
  sortApplicantsByDate,
} from "../../utils/companyDashboardAPI";
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
    try {
      await applicationAPI.updateApplicationStatus(applicantId, {
        status: newStatus,
      });
      alert("Application status updated!");
      fetchApplicants();
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await applicationAPI.addApplicationNotes(selectedApplicant._id, noteText);
      alert("Note added successfully!");
      setNoteText("");
      setShowNoteForm(false);
      fetchApplicants();
    } catch (err) {
      alert("Error adding note: " + err.message);
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
                    {new Date(applicant.appliedAt).toLocaleDateString()}
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
            </div>

            <div className="detail-section">
              <h4>Application Details</h4>
              <p>
                <strong>Job:</strong> {selectedApplicant.jobId?.title}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedApplicant.status}
              </p>
            </div>

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
    </div>
  );
};

export default Applicants;
