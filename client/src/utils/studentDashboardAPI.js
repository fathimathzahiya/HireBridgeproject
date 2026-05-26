// API configuration and utility functions for student dashboard

const API_BASE_URL = "http://localhost:5000/api";

// Helper function to fetch with auth token
const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("hirebridge_token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "API Request failed");
    }
    return data;
  });
};

// Student APIs
export const studentAPI = {
  getStudent: (id) => fetchWithAuth(`${API_BASE_URL}/student/getsinglestudent/${id}`),
  getAllStudents: () => fetchWithAuth(`${API_BASE_URL}/student/getstudent`),
};

// Job APIs
export const jobAPI = {
  getJob: (id) => fetchWithAuth(`${API_BASE_URL}/jobs/${id}`),
  getAllJobs: () => fetchWithAuth(`${API_BASE_URL}/jobs`),
};

// Application APIs
export const applicationAPI = {
  getStudentApplications: (studentId) => fetchWithAuth(`${API_BASE_URL}/student/${studentId}/applications`),
  getStudentApplicationsByStatus: (studentId, status) => fetchWithAuth(`${API_BASE_URL}/student/${studentId}/applications/${status}`),
  createApplication: (data) => fetchWithAuth(`${API_BASE_URL}/applications`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Interview APIs
export const interviewAPI = {
  getStudentInterviews: (studentId) => fetchWithAuth(`${API_BASE_URL}/student/${studentId}/interviews`),
  getStudentUpcomingInterviews: (studentId) => fetchWithAuth(`${API_BASE_URL}/student/${studentId}/interviews/upcoming`),
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

