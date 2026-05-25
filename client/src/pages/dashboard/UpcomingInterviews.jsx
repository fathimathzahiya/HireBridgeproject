import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import "./InterviewsList.css";

function UpcomingInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingInterviews();
  }, []);

  const fetchUpcomingInterviews = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem("studentId");

      // Fetch all interviews
      const interviewsRes = await fetch(`http://localhost:5000/api/interview/getinterview`);
      const allInterviews = await interviewsRes.json();

      // Filter interviews for this student
      const studentInterviews = allInterviews.filter(int => int.studentId === studentId);

      // Sort by date (upcoming first)
      const sortedInterviews = studentInterviews.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      // Fetch job details for each interview
      const jobsRes = await fetch(`http://localhost:5000/api/job/getjob`);
      const allJobs = await jobsRes.json();

      const interviewsWithDetails = sortedInterviews.map(interview => {
        const jobDetails = allJobs.find(job => job._id === interview.jobId);
        return {
          ...interview,
          jobDetails,
        };
      });

      setInterviews(interviewsWithDetails);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeStatus = (date, time) => {
    const interviewDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (interviewDateTime < now) {
      return "completed";
    } else if (interviewDateTime - now < 24 * 60 * 60 * 1000) {
      return "urgent";
    }
    return "upcoming";
  };

  return (
    <StudentDashboardLayout>
      <div>
        <div className="welcome">
          <h1>Upcoming Interviews</h1>
          <p>Prepare for your scheduled interviews</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : interviews.length === 0 ? (
          <div className="no-data">
            <p>You don't have any scheduled interviews yet.</p>
          </div>
        ) : (
          <div className="interviews-list">
            {interviews.map((interview) => (
              <div 
                key={interview._id} 
                className={`interview-card ${getTimeStatus(interview.date, interview.time)}`}
              >
                <div className="interview-header">
                  <h3>{interview.jobDetails?.title}</h3>
                  <span className={`status ${getTimeStatus(interview.date, interview.time)}`}>
                    {getTimeStatus(interview.date, interview.time).charAt(0).toUpperCase() + 
                     getTimeStatus(interview.date, interview.time).slice(1)}
                  </span>
                </div>

                <div className="interview-details">
                  <div className="detail-row">
                    <strong>📅 Date:</strong>
                    <span>{new Date(interview.date).toLocaleDateString()}</span>
                  </div>

                  <div className="detail-row">
                    <strong>🕐 Time:</strong>
                    <span>{interview.time}</span>
                  </div>

                  <div className="detail-row">
                    <strong>🏢 Company:</strong>
                    <span>Company Name</span>
                  </div>

                  <div className="detail-row">
                    <strong>📍 Location:</strong>
                    <span>{interview.jobDetails?.location}</span>
                  </div>

                  <div className="detail-row">
                    <strong>💼 Position:</strong>
                    <span>{interview.jobDetails?.title}</span>
                  </div>

                  <div className="detail-row">
                    <strong>Required Skills:</strong>
                    <span>{interview.jobDetails?.skillRequired}</span>
                  </div>
                </div>

                <div className="meet-link">
                  <strong>Google Meet Link:</strong>
                  <p>{interview.googleMeetLink}</p>
                </div>

                <div className="interview-actions">
                  <a 
                    href={interview.googleMeetLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary"
                  >
                    Join Interview
                  </a>
                  <button className="btn-secondary">Reschedule</button>
                  <button className="btn-tertiary">View Job Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default UpcomingInterviews;
