# Company Dashboard Implementation Guide

## Overview
Complete implementation of a production-level company dashboard for the placement platform, mirroring the student dashboard architecture with comprehensive job management, applicant tracking, and interview scheduling features.

## Architecture

### Backend Structure

#### Models Updated
1. **Company Model** (`server/models/companymodel.js`)
   - Enhanced with fields: email, industry, companySize, HREmail, companyLogo, aboutCompany, createdAt

2. **Application Model** (`server/models/applicationmodel.js`)
   - Added status field: "Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"
   - Added appliedAt timestamp and notes field

3. **Interview Model** (`server/models/interviewmodel.js`)
   - Added status: "Scheduled", "Completed", "Cancelled"
   - Added result: "Pending", "Selected", "Rejected", "On Hold"
   - Added instructions, feedback, and createdAt fields

4. **Job Model** (`server/models/jobmodel.js`)
   - Added applicationDeadline, status ("Open", "Closed", "On Hold")
   - Added createdAt and updatedAt timestamps

#### Controllers

1. **Company Controller** (`server/controllers/companycontroller.js`)
   - `getCompanyDashboard(companyId)` - Returns company stats and overview
   - `getSingleCompany(companyId)` - Get company profile details
   - `updateCompanyProfile(companyId, data)` - Update profile information
   - `getAllCompanies()` - List all companies

2. **Job Controller** (`server/controllers/jobcontroller.js`)
   - **Student Operations:**
     - `getAllJobs()` - Get all open jobs with company details
     - `getSingleJob(jobId)` - Get detailed job information
     - `searchJobs(filters)` - Search jobs by title, location, department, salary
   
   - **Company Operations:**
     - `createJob(data)` - Post new job listing
     - `getCompanyJobs(companyId)` - Get all jobs posted by company
     - `updateJob(jobId, data)` - Edit job details
     - `closeJob(jobId)` - Close job posting
     - `deleteJob(jobId)` - Delete job posting
     - `getJobApplicantCount(jobId)` - Get applicant statistics

3. **Application Controller** (`server/controllers/applicationcontroller.js`)
   - **Student Operations:**
     - `applyForJob(data)` - Submit job application
     - `getStudentApplications(studentId)` - Get all applications
     - `getStudentApplicationsByStatus(studentId, status)` - Filter by status
   
   - **Company Operations:**
     - `getCompanyApplicants(companyId)` - Get all applicants for company
     - `getJobApplicants(jobId)` - Get applicants for specific job
     - `getCompanyApplicantsByStatus(companyId, status)` - Filter applicants
     - `updateApplicationStatus(applicationId, data)` - Change application status
     - `addApplicationNotes(applicationId, notes)` - Add feedback/notes

4. **Interview Controller** (`server/controllers/interviewcontroller.js`)
   - **Company Operations:**
     - `scheduleInterview(data)` - Schedule new interview
     - `getCompanyInterviews(companyId)` - Get all interviews
     - `getInterviewsByStatus(companyId, status)` - Filter interviews
     - `updateInterviewStatus(interviewId, data)` - Update interview and result
   
   - **Student Operations:**
     - `getStudentInterviews(studentId)` - Get all student interviews
     - `getStudentUpcomingInterviews(studentId)` - Get upcoming interviews
     - `cancelInterview(interviewId)` - Cancel interview

#### Routes

All routes follow RESTful conventions:

**Company Routes** (`/api/company/*`)
- GET `/companies` - List all companies
- GET `/company/{companyId}` - Get company profile
- GET `/company/{companyId}/dashboard` - Get dashboard stats
- PUT `/company/{companyId}` - Update profile

**Job Routes** (`/api/jobs/*`)
- GET `/jobs` - Get all open jobs
- GET `/jobs/search?title=...&location=...` - Search jobs
- GET `/jobs/{jobId}` - Get job details
- POST `/jobs` - Create job (company)
- PUT `/jobs/{jobId}` - Update job (company)
- PUT `/jobs/{jobId}/close` - Close job (company)
- DELETE `/jobs/{jobId}` - Delete job (company)
- GET `/jobs/{jobId}/applicant-count` - Get applicant count

**Application Routes** (`/api/applications/*`)
- POST `/applications` - Apply for job (student)
- GET `/student/{studentId}/applications` - Get student applications
- GET `/student/{studentId}/applications/{status}` - Filter student applications
- GET `/company/{companyId}/applicants` - Get all applicants (company)
- GET `/job/{jobId}/applicants` - Get job applicants (company)
- GET `/company/{companyId}/applicants/{status}` - Filter applicants (company)
- PUT `/applications/{applicationId}/status` - Update status (company)
- PUT `/applications/{applicationId}/notes` - Add notes (company)

**Interview Routes** (`/api/interviews/*`)
- POST `/interviews` - Schedule interview (company)
- GET `/company/{companyId}/interviews` - Get company interviews
- GET `/company/{companyId}/interviews/{status}` - Filter interviews (company)
- PUT `/interviews/{interviewId}` - Update interview (company)
- GET `/student/{studentId}/interviews` - Get student interviews
- GET `/student/{studentId}/interviews/upcoming` - Get upcoming interviews
- PUT `/interviews/{interviewId}/cancel` - Cancel interview

### Frontend Structure

#### Utilities
- **companyDashboardAPI.js** - Centralized axios API service
  - All API calls with error handling
  - Utility functions for data filtering, formatting, and status management
  - Helper functions for color coding and badge generation

#### Components Structure
```
companyDashboard/
├── CompanyDashboardLayout.jsx      # Main wrapper with sidebar
├── CompanyDashboardOverview.jsx    # Dashboard stats and quick actions
├── JobPostings.jsx                  # Create, edit, delete, view jobs
├── Applicants.jsx                   # Manage applicants, view details, add notes
├── InterviewManagement.jsx          # Schedule, update, manage interviews
├── CompanyProfile.jsx               # Edit company information
├── CompanyDashboardRouter.jsx       # Route handler
└── *.css                           # Component styling
```

#### Key Features

1. **CompanyDashboardLayout**
   - Collapsible sidebar navigation
   - Responsive header with logout
   - Menu for all sections
   - Mobile-friendly design

2. **CompanyDashboardOverview**
   - Welcome section with company logo
   - 4 stat cards: Active jobs, Total applicants, Shortlisted, Interviews scheduled
   - Company information display
   - Quick action buttons

3. **JobPostings**
   - Create new job with form
   - Edit existing jobs
   - Close job postings
   - Delete jobs
   - Grid view of all jobs with status badges

4. **Applicants**
   - List all applicants with status badges
   - Filter by status (Applied, Under Review, Shortlisted, etc.)
   - Update application status via dropdown
   - View detailed applicant profile in modal
   - Add feedback notes to applicants
   - Display student CGPA, skills, projects, certifications
   - Links to GitHub and LinkedIn

5. **InterviewManagement**
   - Schedule interviews from shortlisted candidates
   - Automatic form population with candidate details
   - Google Meet link generation
   - Interview instructions
   - List all interviews with status
   - Mark interviews as completed
   - Set interview results (Selected/Rejected)
   - Cancel interviews
   - Filter by status (Scheduled, Completed, Cancelled)

6. **CompanyProfile**
   - View current company information
   - Edit profile information
   - Update: name, website, location, industry, size, HR details, logo, about

#### Routing
```
/company/{companyId}/overview        - Dashboard overview
/company/{companyId}/jobs            - Job management
/company/{companyId}/applicants      - Applicant management
/company/{companyId}/interviews      - Interview scheduling
/company/{companyId}/profile         - Company profile
```

## Authentication Flow

1. **Login Page**
   - Single login page for all roles
   - Role selector: Student / Company / Admin
   - Email and password input
   - Stores: userId/companyId, role, name, email in localStorage

2. **Role-based Redirect**
   - Student → `/student-dashboard`
   - Company → `/company/{companyId}/overview`
   - Admin → `/admin/dashboard` (future implementation)

## Data Flow Example: Job Application to Selection

```
1. Student Applies
   ↓ POST /applications
   Application created with status "Applied"
   ↓

2. Company Reviews
   ↓ PUT /applications/{id}/status
   Status → "Under Review"
   ↓

3. Company Shortlists
   ↓ PUT /applications/{id}/status
   Status → "Shortlisted"
   ↓

4. Company Schedules Interview
   ↓ POST /interviews
   Interview created, Application → "Interview Scheduled"
   ↓

5. Interview Completed
   ↓ PUT /interviews/{id}
   Set result: "Selected" or "Rejected"
   ↓
   
6. Final Status
   Application status → "Selected" or "Rejected"
```

## API Response Format

```json
// Success
{
  "id": "...",
  "status": "Applied",
  "appliedAt": "2024-01-15T10:00:00Z",
  "studentId": {...},
  "jobId": {...},
  "companyId": {...}
}

// Error
{
  "error": "Message describing what went wrong"
}
```

## Styling

- **Color Scheme:**
  - Primary: #667eea (Purple)
  - Secondary: #764ba2 (Dark Purple)
  - Success: #2ecc71 (Green)
  - Warning: #f39c12 (Orange)
  - Danger: #e74c3c (Red)
  - Info: #3498db (Blue)

- **Responsive Breakpoints:**
  - Desktop: >= 1024px
  - Tablet: 768px - 1023px
  - Mobile: < 768px

## Setup Instructions

### Backend
1. Ensure MongoDB is running
2. Install dependencies: `npm install`
3. Update models, controllers, routes
4. Start server: `npm start`

### Frontend
1. Install axios: `npm install axios`
2. Copy companyDashboardAPI.js to utils
3. Copy all company dashboard components
4. Update DOM.jsx with new routes
5. Update Login.jsx for redirect logic
6. Start development server: `npm start`

## Testing Checklist

- [ ] Company registration working
- [ ] Company login redirects to dashboard
- [ ] Dashboard stats displaying correctly
- [ ] Job posting creation working
- [ ] Job edit/delete functionality
- [ ] Job search/filter working
- [ ] Applicants list displaying
- [ ] Status change updating correctly
- [ ] Applicant details modal showing
- [ ] Notes functionality working
- [ ] Interview scheduling working
- [ ] Google Meet link acceptance
- [ ] Interview status updates
- [ ] Company profile editing
- [ ] Responsive design on mobile
- [ ] Sidebar toggle working
- [ ] Logout functionality
- [ ] localStorage clearing on logout

## Future Enhancements

1. **Admin Dashboard**
   - User management
   - Job approval system
   - Platform analytics
   - Complaint handling

2. **Advanced Features**
   - Bulk upload candidates
   - Email notifications
   - Analytics dashboard
   - Resume parsing
   - Video interview integration

3. **Optimization**
   - Pagination for large lists
   - Advanced filtering
   - Export to Excel/PDF
   - Search indexing
   - Caching mechanisms

## Troubleshooting

### Issue: Routes not loading
- Ensure all components are imported in DOM.jsx
- Check route paths match component props

### Issue: API calls failing
- Verify backend server is running on port 5000
- Check API endpoint URLs in companyDashboardAPI.js
- Verify authentication headers if required

### Issue: localStorage issues
- Clear browser cache and localStorage
- Check for name conflicts in localStorage keys
- Verify logout clears all company-related data

## Support

For issues or questions, refer to:
- Backend routes in `/server/routes/`
- Controller logic in `/server/controllers/`
- Frontend components in `/client/src/pages/companyDashboard/`
- API service in `/client/src/utils/companyDashboardAPI.js`
