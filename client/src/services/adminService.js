import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/admin";

// Create Axios Instance
const adminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Interceptor to inject JWT Authorization Token
adminClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hirebridge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const adminService = {
  // Admin Authentication
  login: (email, password) =>
    adminClient.post("/login", { email, password }).then((res) => res.data),

  getProfile: () =>
    adminClient.get("/profile").then((res) => res.data),

  updateProfile: (data) =>
    adminClient.put("/profile/update", data).then((res) => res.data),

  // Analytics Overview
  getAnalytics: () =>
    adminClient.get("/analytics").then((res) => res.data),

  // Student Management
  getStudents: () =>
    adminClient.get("/students").then((res) => res.data),

  addStudent: (data) =>
    adminClient.post("/students/add", data).then((res) => res.data),

  getStudent: (id) =>
    adminClient.get(`/students/${id}`).then((res) => res.data),

  updateStudent: (id, data) =>
    adminClient.put(`/students/${id}`, data).then((res) => res.data),

  blockStudent: (id) =>
    adminClient.patch(`/students/block/${id}`).then((res) => res.data),

  deleteStudent: (id) =>
    adminClient.delete(`/students/${id}`).then((res) => res.data),

  // Company Management
  getCompanies: () =>
    adminClient.get("/companies").then((res) => res.data),

  addCompany: (data) =>
    adminClient.post("/companies/add", data).then((res) => res.data),

  approveCompany: (id) =>
    adminClient.patch(`/companies/approve/${id}`).then((res) => res.data),

  blockCompany: (id) =>
    adminClient.patch(`/companies/block/${id}`).then((res) => res.data),

  deleteCompany: (id) =>
    adminClient.delete(`/companies/${id}`).then((res) => res.data),

  // Job Management
  getJobs: () =>
    adminClient.get("/jobs").then((res) => res.data),

  updateJob: (id, data) =>
    adminClient.put(`/jobs/${id}`, data).then((res) => res.data),

  closeJob: (id) =>
    adminClient.patch(`/jobs/close/${id}`).then((res) => res.data),

  deleteJob: (id) =>
    adminClient.delete(`/jobs/${id}`).then((res) => res.data),

  // Application Management
  getApplications: () =>
    adminClient.get("/applications").then((res) => res.data),

  deleteApplication: (id) =>
    adminClient.delete(`/applications/${id}`).then((res) => res.data),

  // Interview Management
  getInterviews: () =>
    adminClient.get("/interviews").then((res) => res.data),

  completeInterview: (id) =>
    adminClient.patch(`/interviews/complete/${id}`).then((res) => res.data),

  // Bulletins & Notifications
  getAllNotifications: () =>
    adminClient.get("/notifications").then((res) => res.data),

  deleteNotification: (id) =>
    adminClient.delete(`/notifications/${id}`).then((res) => res.data),
};

export default adminService;
