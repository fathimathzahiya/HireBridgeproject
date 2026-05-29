import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import { interviewAPI, getTimeStatus } from "../../utils/studentDashboardAPI";
import { formatDateToDDMMYYYY } from "../../utils/dateFormatter";
import "./InterviewsList.css";

function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingInterviews();
  }, []);

  const fetchUpcomingInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        setError("Student ID not found. Please log in.");
        setLoading(false);
        return;
      }

      // Fetch interviews via authenticated API
      const allInterviews = await interviewAPI.getStudentInterviews(studentId);

      // Filter out completed interviews and sort by date (upcoming first)
      const upcomingInterviews = allInterviews
        .filter(interview => getTimeStatus(interview.date, interview.time) !== "completed")
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      setInterviews(upcomingInterviews);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError(err.message || "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="upcoming-interviews-container">
        <div className="welcome">
          <h1>Upcoming Interviews</h1>
          <p>Prepare for your scheduled interview rounds</p>
        </div>

        {loading ? (
          <div className="interviews-loading">
            <p>Loading scheduled interviews...</p>
          </div>
        ) : error ? (
          <div className="no-data">
            <p>⚠️ {error}</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="no-data">
            <p>You don't have any scheduled interviews yet.</p>
          </div>
        ) : (
          <div className="interviews-list">
            {interviews.map((interview) => {
              const job = interview.jobId;
              const company = interview.companyId;
              const application = interview.applicationId;
              const timeStatus = getTimeStatus(interview.date, interview.time);

              return (
                <div 
                  key={interview._id} 
                  className={`interview-card ${timeStatus}`}
                >
                  <div className="interview-header">
                    <h3>{job?.title || "Role Title"}</h3>
                    <span className={`status ${timeStatus}`}>
                      {timeStatus.charAt(0).toUpperCase() + timeStatus.slice(1)}
                    </span>
                  </div>

                  <div className="interview-details">
                    <div className="detail-row">
                      <strong>🏢 Company:</strong>
                      <span>{company?.name || "Company Name"}</span>
                    </div>

                    <div className="detail-row">
                      <strong>💼 Position:</strong>
                      <span>{job?.title || "N/A"}</span>
                    </div>

                    <div className="detail-row">
                      <strong>📅 Date:</strong>
                      <span>{formatDateToDDMMYYYY(interview.date)}</span>
                    </div>

                    <div className="detail-row">
                      <strong>🕐 Time:</strong>
                      <span>{interview.time}</span>
                    </div>

                    <div className="detail-row">
                      <strong>📍 Location:</strong>
                      <span>{job?.location || "N/A"}</span>
                    </div>

                    <div className="detail-row">
                      <strong>📋 App Status:</strong>
                      <span className="app-status-badge">{application?.status || "Scheduled"}</span>
                    </div>

                    <div className="detail-row full-width">
                      <strong>Required Skills:</strong>
                      <span>{job?.skillRequired || "N/A"}</span>
                    </div>
                  </div>

                  {interview.googleMeetLink && (
                    <div className="meet-link">
                      <strong>Google Meet / Platform Link:</strong>
                      <p>
                        <a 
                          href={interview.googleMeetLink.startsWith("http") ? interview.googleMeetLink : `https://${interview.googleMeetLink}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {interview.googleMeetLink}
                        </a>
                      </p>
                    </div>
                  )}

                  {interview.instructions && (
                    <div className="interview-instructions">
                      <strong>Instructions:</strong>
                      <p>{interview.instructions}</p>
                    </div>
                  )}

                  <div className="interview-actions">
                    {interview.googleMeetLink && (
                      <a 
                        href={interview.googleMeetLink.startsWith("http") ? interview.googleMeetLink : `https://${interview.googleMeetLink}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="btn-primary"
                        title="Join Interview"
                      >
                        Join Interview
                      </a>
                    )}
                    <button className="btn-secondary" style={{ cursor: "not-allowed", opacity: 0.6 }} disabled>
                      Reschedule Locked
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default UpcomingInterviews;
