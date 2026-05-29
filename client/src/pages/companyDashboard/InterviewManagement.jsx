import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  interviewAPI,
  applicationAPI,
  getInterviewStatusBadge,
  getInterviewResultBadge,
  formatDateTime,
} from "../../utils/companyDashboardAPI";
import "./InterviewManagement.css";

const InterviewManagement = () => {
  const { companyId } = useParams();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [formData, setFormData] = useState({
    applicationId: "",
    date: "",
    time: "",
    googleMeetLink: "",
    instructions: "",
  });
  const [filterStatus, setFilterStatus] = useState("All");

  const statuses = ["All", "Scheduled", "Completed", "Cancelled"];

  useEffect(() => {
    fetchInterviews();
    fetchApplicants();
  }, [companyId]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await interviewAPI.getCompanyInterviews(companyId);
      setInterviews(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch interviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      const shortlistedApplicants = await applicationAPI.getCompanyApplicantsByStatus(
        companyId,
        "Shortlisted"
      );
      setApplicants(shortlistedApplicants);
    } catch (err) {
      console.error("Error fetching applicants:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.applicationId ||
        !formData.date ||
        !formData.time ||
        !formData.googleMeetLink
      ) {
        toast.warning("Please fill all required fields");
        return;
      }

      const applicant = applicants.find((a) => a._id === formData.applicationId);
      await interviewAPI.scheduleInterview({
        applicationId: formData.applicationId,
        studentId: applicant.studentId._id,
        companyId,
        jobId: applicant.jobId._id,
        date: formData.date,
        time: formData.time,
        googleMeetLink: formData.googleMeetLink,
        instructions: formData.instructions,
      });

      toast.success("Interview scheduled successfully!");
      setFormData({
        applicationId: "",
        date: "",
        time: "",
        googleMeetLink: "",
        instructions: "",
      });
      setShowScheduleForm(false);
      fetchInterviews();
      fetchApplicants();
    } catch (err) {
      toast.error("Error scheduling interview: " + err.message);
    }
  };

  const handleUpdateResult = async (interviewId, result, feedback) => {
    try {
      await interviewAPI.updateInterviewStatus(interviewId, {
        result,
        feedback,
      });
      toast.success(`Candidate marked as ${result}!`);
      fetchInterviews();
    } catch (err) {
      toast.error("Error updating result: " + err.message);
    }
  };

  const handleManualComplete = async (interviewId) => {
    if (window.confirm("Are you sure you want to mark this interview as completed?")) {
      try {
        await interviewAPI.updateInterviewStatus(interviewId, {
          status: "Completed",
        });
        toast.success("Interview status marked as Completed!");
        fetchInterviews();
      } catch (err) {
        toast.error("Error updating status: " + err.message);
      }
    }
  };

  const handleCancelInterview = async (interviewId) => {
    if (window.confirm("Are you sure you want to cancel this interview?")) {
      try {
        await interviewAPI.cancelInterview(interviewId);
        toast.success("Interview cancelled!");
        fetchInterviews();
      } catch (err) {
        toast.error("Error cancelling interview: " + err.message);
      }
    }
  };

  const filteredInterviews = interviews.filter((interview) =>
    filterStatus === "All" ? true : interview.status === filterStatus
  );

  if (loading) {
    return <div className="loading">Loading interviews...</div>;
  }

  return (
    <div className="interview-management-container">
      <div className="interview-header">
        <h2>Interview Management</h2>
        <button
          className="btn-primary btn-schedule-toggle"
          onClick={() => setShowScheduleForm(!showScheduleForm)}
        >
          {showScheduleForm ? "Cancel" : "+ Schedule Interview"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showScheduleForm && (
        <div className="schedule-form-container">
          <form onSubmit={handleScheduleSubmit} className="interview-form">
            <h3>Schedule New Interview</h3>

            <div className="form-group">
              <label>Select Applicant *</label>
              <select
                name="applicationId"
                value={formData.applicationId}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Applicant --</option>
                {applicants.map((applicant) => (
                  <option key={applicant._id} value={applicant._id}>
                    {applicant.studentId?.username} - {applicant.jobId?.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Interview Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Interview Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Google Meet Link *</label>
              <input
                type="url"
                name="googleMeetLink"
                value={formData.googleMeetLink}
                onChange={handleInputChange}
                placeholder="https://meet.google.com/..."
                required
              />
            </div>

            <div className="form-group">
              <label>Interview Instructions</label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Add any special instructions for the candidate..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-submit">
              Schedule Interview
            </button>
          </form>
        </div>
      )}

      {!showScheduleForm && (
        <>
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

          {/* Interviews List */}
          {filteredInterviews.length === 0 ? (
            <div className="no-interviews">
              <p>No interviews scheduled yet.</p>
            </div>
          ) : (
            <div className="interviews-grid">
              {filteredInterviews.map((interview) => (
                <div key={interview._id} className="interview-card">
                  <div className="interview-header-card">
                    <h3>{interview.studentId?.username}</h3>
                    <span
                      className={`status-badge ${getInterviewStatusBadge(interview.status)}`}
                    >
                      {interview.status}
                    </span>
                  </div>

                  <div className="interview-details">
                    <p>
                      <strong>Job:</strong> {interview.jobId?.title}
                    </p>
                    <p>
                      <strong>Date & Time:</strong>{" "}
                      {formatDateTime(interview.date, interview.time)}
                    </p>
                    <p>
                      <strong>Meet Link:</strong>{" "}
                      <a href={interview.googleMeetLink} target="_blank" rel="noopener noreferrer">
                        Join Meeting
                      </a>
                    </p>
                    {interview.instructions && (
                      <p>
                        <strong>Instructions:</strong> {interview.instructions}
                      </p>
                    )}
                    {interview.result !== "Pending" && (
                      <p>
                        <strong>Result:</strong>{" "}
                        <span className={`result-badge ${getInterviewResultBadge(interview.result)}`}>
                          {interview.result}
                        </span>
                      </p>
                    )}
                    {interview.feedback && (
                      <p>
                        <strong>Feedback:</strong> {interview.feedback}
                      </p>
                    )}
                  </div>

                  {interview.status === "Completed" && interview.result === "Pending" && (
                    <div className="interview-actions">
                      <button
                        className="btn-select"
                        onClick={() => handleUpdateResult(interview._id, "Selected", "")}
                      >
                        Mark as Selected
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleUpdateResult(interview._id, "Rejected", "")}
                      >
                        Mark as Rejected
                      </button>
                    </div>
                  )}

                  {interview.status === "Scheduled" && (
                    <div className="interview-actions">
                      <button
                        className="btn-select"
                        onClick={() => handleManualComplete(interview._id)}
                        style={{ backgroundColor: "#10b981", color: "white", marginRight: "10px" }}
                      >
                        ✓ Complete
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => handleCancelInterview(interview._id)}
                      >
                        Cancel Interview
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InterviewManagement;
