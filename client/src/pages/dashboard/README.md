# Student Dashboard - Dynamic Navigation System

## Overview
The Student Dashboard has been refactored to include a dynamic sidebar menu with separate pages for each section. This provides a better user experience with proper navigation between different student-related pages.

## File Structure

```
client/src/pages/dashboard/
├── StudentDashboard.jsx              # Main component (wrapper)
├── StudentDashboardLayout.jsx        # Layout with sidebar navigation
├── DashboardOverview.jsx             # Dashboard overview page
├── AppliedJobs.jsx                   # Applied jobs listing
├── ShortlistedJobs.jsx               # Shortlisted jobs listing
├── RejectedJobs.jsx                  # Rejected jobs listing
├── UpcomingInterviews.jsx            # Upcoming interviews page
├── StudentDashboard.css              # Main styles
├── JobsList.css                      # Jobs page styles
└── InterviewsList.css                # Interviews page styles
```

## Components

### StudentDashboard.jsx
- Main entry point for the student dashboard
- Renders DashboardOverview by default
- Used in routing

### StudentDashboardLayout.jsx
- Provides the main layout with sidebar
- Manages navigation between pages
- Displays menu items dynamically
- Handles active menu state
- Shows profile strength, settings, and help links

### DashboardOverview.jsx
- Displays dashboard statistics
- Shows student profile information
- Fetches data from:
  - `GET /api/student/getsinglestudent/:id`
  - `GET /api/application/getapplication`
  - `GET /api/interview/getinterview`

### AppliedJobs.jsx
- Lists all jobs the student has applied to
- Shows job details (title, location, salary, etc.)
- Allows withdrawal of applications
- Fetches from:
  - `GET /api/application/getapplication`
  - `GET /api/job/getjob`

### ShortlistedJobs.jsx
- Lists jobs where the student has been shortlisted
- Determined by presence of interview records
- Shows job and position details
- Fetches from:
  - `GET /api/application/getapplication`
  - `GET /api/interview/getinterview`
  - `GET /api/job/getjob`

### RejectedJobs.jsx
- Lists applications that were not moved forward
- Shows rejected job opportunities
- Allows option to apply again
- Fetches same data as AppliedJobs but filters differently

### UpcomingInterviews.jsx
- Displays scheduled interviews
- Shows interview date, time, and Google Meet link
- Indicates urgent interviews (within 24 hours)
- Provides direct link to join the interview
- Fetches from:
  - `GET /api/interview/getinterview`
  - `GET /api/job/getjob`

## Routing

The routing is configured in `client/src/DOM/DOM.jsx`:

```javascript
<Route path='/student-dashboard' element={<DashboardOverview/>}/>
<Route path='/student-dashboard/applied-jobs' element={<AppliedJobs/>}/>
<Route path='/student-dashboard/shortlisted-jobs' element={<ShortlistedJobs/>}/>
<Route path='/student-dashboard/rejected-jobs' element={<RejectedJobs/>}/>
<Route path='/student-dashboard/upcoming-interviews' element={<UpcomingInterviews/>}/>
```

## Menu Items

The sidebar includes the following menu items:

1. **Dashboard Overview** - Main statistics and profile
2. **Applied Jobs** - All job applications
3. **Shortlisted Jobs** - Jobs you've been shortlisted for
4. **Rejected Jobs** - Applications not moved forward
5. **Upcoming Interviews** - Scheduled interviews

## Data Flow

### Backend Integration

All components fetch data from the backend API:

**Student Data:**
```javascript
GET /api/student/getsinglestudent/:id
```

**Jobs Data:**
```javascript
GET /api/job/getjob
GET /api/job/getsinglejob/:id
```

**Applications Data:**
```javascript
GET /api/application/getapplication
GET /api/application/getsingleapplication/:id
```

**Interviews Data:**
```javascript
GET /api/interview/getinterview
GET /api/interview/getsingleinterview/:id
```

### Data Storage

The student ID is stored in `localStorage` as `studentId`. This is used to:
- Filter applications by student
- Filter interviews by student
- Load student profile information

## Styling

### StudentDashboard.css
- Main layout styles (sidebar, topbar, welcome section)
- Card and stats styles
- Menu active states
- Profile overview styles

### JobsList.css
- Job card styling
- Status badge colors
- Button styles
- Responsive design

### InterviewsList.css
- Interview card styling
- Status indicators (urgent, upcoming, completed)
- Google Meet link display
- Action buttons

## Usage

### Navigation
Users can click on any menu item to navigate to that section. The active menu item is highlighted automatically.

### Profile Strength
Shows current profile completion percentage with a progress bar. Click "Complete Profile" to update profile information.

### Settings & Help
Bottom menu links for Settings and Help Center are functional placeholders.

## Key Features

1. **Dynamic Navigation**: Sidebar automatically updates active state based on current route
2. **Data Fetching**: All components fetch fresh data on mount
3. **Error Handling**: Basic error logging for API failures
4. **Loading States**: Components show loading indicator while fetching data
5. **Empty States**: Proper messages when no data is available
6. **Responsive Design**: Works on desktop and mobile devices

## API Utilities

Utility functions are available in `client/src/utils/studentDashboardAPI.js`:

- `filterApplicationsByStudent()` - Filter applications by student ID
- `combineApplicationsWithJobs()` - Merge application and job details
- `combineInterviewsWithJobs()` - Merge interview and job details
- `sortInterviewsByDate()` - Sort interviews chronologically
- `getTimeStatus()` - Get interview status (upcoming, urgent, completed)

## Future Enhancements

1. Add status field to Application model for better filtering
2. Add saved jobs collection for "Saved Jobs" count
3. Implement real-time notifications for interview updates
4. Add application withdrawal confirmation
5. Add interview rescheduling functionality
6. Add resume/portfolio links to job cards
7. Add company information/details
8. Implement filtering and sorting options
9. Add pagination for large lists
10. Add interview preparation materials

## Notes

- All timestamps use string format (YYYY-MM-DD for dates, HH:MM for times)
- Student ID must be stored in localStorage during login
- API base URL is set to `http://localhost:5000/api`
- All API calls use GET requests for fetching data
