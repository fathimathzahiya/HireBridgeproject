import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import "../dashboard/StudentDashboard.css";

function DashboardOverview() {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    interviews: 0,
    savedJobs: 0,
  });
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get student ID from localStorage or session
      const studentId = localStorage.getItem("studentId");
      
      if (studentId) {
        // Fetch student profile
        const studentRes = await fetch(`http://localhost:5000/api/student/getsinglestudent/${studentId}`);
        const studentInfo = await studentRes.json();
        setStudentData(studentInfo);

        // Fetch applied jobs count
        const applicationsRes = await fetch(`http://localhost:5000/api/application/getapplication`);
        const applications = await applicationsRes.json();
        const studentApplications = applications.filter(app => app.studentId === studentId);

        // Fetch interviews count
        const interviewsRes = await fetch(`http://localhost:5000/api/interview/getinterview`);
        const interviews = await interviewsRes.json();
        const studentInterviews = interviews.filter(int => int.studentId === studentId);

        setStats({
          appliedJobs: studentApplications.length,
          interviews: studentInterviews.length,
          savedJobs: 24, // This would come from a saved jobs collection
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <div>
        {/* Welcome Section */}
        <div className="welcome">
          <h1>Hello, {studentData?.username || "Student"}!</h1>
          <p>You have {stats.appliedJobs} active applications in progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats">
          <div className="card">
            <h3>Applied Jobs</h3>
            <h1>{stats.appliedJobs}</h1>
          </div>

          <div className="card">
            <h3>Interviews</h3>
            <h1>{stats.interviews}</h1>
          </div>

          <div className="card">
            <h3>Saved Jobs</h3>
            <h1>{stats.savedJobs}</h1>
          </div>
        </div>

        {/* Profile Overview */}
        {studentData && (
          <div className="profile-overview" style={{ marginTop: "30px" }}>
            <div className="card" style={{ padding: "20px" }}>
              <h2>Your Profile</h2>
              <p><strong>Department:</strong> {studentData.department}</p>
              <p><strong>CGPA:</strong> {studentData.cgpa}</p>
              <p><strong>Skills:</strong> {studentData.skills}</p>
              <p><strong>Phone:</strong> {studentData.phoneNumber}</p>
              <p><strong>Address:</strong> {studentData.address}</p>
            </div>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
}

export default DashboardOverview;
