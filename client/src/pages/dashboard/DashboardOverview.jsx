import React, { useState, useEffect } from "react";
import StudentDashboardLayout from "./StudentDashboardLayout";
import "../dashboard/StudentDashboard.css";

function DashboardOverview() {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    interviews: 0,
    notificationsCount: 0,
    selectedJobs: 0,
  });
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      const token = localStorage.getItem("hirebridge_token");
      
      if (studentId && token) {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Fetch student profile
        const studentRes = await fetch(`http://localhost:5000/api/student/getsinglestudent/${studentId}`, { headers });
        if (studentRes.ok) {
          const studentInfo = await studentRes.json();
          setStudentData(studentInfo);
        }

        // Fetch applied jobs count
        const applicationsRes = await fetch(`http://localhost:5000/api/application/getapplication`, { headers });
        if (applicationsRes.ok) {
          const applications = await applicationsRes.json();
          const studentApplications = applications.filter(app => app.studentId === studentId);
          const selectedApplications = studentApplications.filter(app => app.status === "Selected");
          
          // Fetch interviews count
          const interviewsRes = await fetch(`http://localhost:5000/api/interview/getinterview`, { headers });
          let studentInterviewsCount = 0;
          if (interviewsRes.ok) {
            const interviews = await interviewsRes.json();
            const studentInterviews = interviews.filter(int => int.studentId === studentId);
            studentInterviewsCount = studentInterviews.length;
          }

          // Fetch notifications count
          const notificationsRes = await fetch(`http://localhost:5000/api/notifications/student/${studentId}`, { headers });
          let notifCount = 0;
          if (notificationsRes.ok) {
            const notifications = await notificationsRes.json();
            notifCount = notifications.length;
          }

          setStats({
            appliedJobs: studentApplications.length,
            interviews: studentInterviewsCount,
            notificationsCount: notifCount,
            selectedJobs: selectedApplications.length,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const loggedInStudentName = studentData?.username || localStorage.getItem("studentName") || "Student";

  return (
    <StudentDashboardLayout>
      <div>
        {/* Welcome Section */}
        <div className="welcome">
          <h1>Hello, {loggedInStudentName}!</h1>
          <p>You have {stats.appliedJobs} active applications in progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
          <div className="card">
            <h3>Total Applications</h3>
            <h1>{stats.appliedJobs}</h1>
          </div>

          <div className="card">
            <h3>Notifications</h3>
            <h1>{stats.notificationsCount}</h1>
          </div>

          <div className="card">
            <h3>Interviews</h3>
            <h1>{stats.interviews}</h1>
          </div>

          <div className="card">
            <h3>Selected Jobs</h3>
            <h1>{stats.selectedJobs}</h1>
          </div>
        </div>
      </div>
    </StudentDashboardLayout>
  );
}

export default DashboardOverview;
