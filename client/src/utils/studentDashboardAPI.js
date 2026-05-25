// API configuration and utility functions for student dashboard

const API_BASE_URL = "http://localhost:5000/api";

// Student APIs
export const studentAPI = {
  getStudent: (id) => fetch(`${API_BASE_URL}/student/getsinglestudent/${id}`).then(res => res.json()),
  getAllStudents: () => fetch(`${API_BASE_URL}/student/getstudent`).then(res => res.json()),
};

// Job APIs
export const jobAPI = {
  getJob: (id) => fetch(`${API_BASE_URL}/job/getsinglejob/${id}`).then(res => res.json()),
  getAllJobs: () => fetch(`${API_BASE_URL}/job/getjob`).then(res => res.json()),
};

// Application APIs
export const applicationAPI = {
  getApplication: (id) => fetch(`${API_BASE_URL}/application/getsingleapplication/${id}`).then(res => res.json()),
  getAllApplications: () => fetch(`${API_BASE_URL}/application/getapplication`).then(res => res.json()),
  createApplication: (data) => fetch(`${API_BASE_URL}/application/application`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json()),
};

// Interview APIs
export const interviewAPI = {
  getInterview: (id) => fetch(`${API_BASE_URL}/interview/getsingleinterview/${id}`).then(res => res.json()),
  getAllInterviews: () => fetch(`${API_BASE_URL}/interview/getinterview`).then(res => res.json()),
};

// Utility functions
export const filterApplicationsByStudent = (applications, studentId) => {
  return applications.filter(app => app.studentId === studentId);
};

export const combineApplicationsWithJobs = (applications, jobs) => {
  return applications.map(app => ({
    ...app,
    jobDetails: jobs.find(job => job._id === app.jobId),
  }));
};

export const combineInterviewsWithJobs = (interviews, jobs) => {
  return interviews.map(interview => ({
    ...interview,
    jobDetails: jobs.find(job => job._id === interview.jobId),
  }));
};

export const sortInterviewsByDate = (interviews) => {
  return interviews.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getTimeStatus = (date, time) => {
  const interviewDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  if (interviewDateTime < now) {
    return "completed";
  } else if (interviewDateTime - now < 24 * 60 * 60 * 1000) {
    return "urgent";
  }
  return "upcoming";
};
