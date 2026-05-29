import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Companyreg from '../pages/register/Company/Companyreg'
import Studentreg from '../pages/register/Student/Studentreg'
import Login from '../pages/login/Login'
import StudentDashboard from '../pages/dashboard/StudentDashboard'
import DashboardOverview from '../pages/dashboard/DashboardOverview'
import Jobs from '../pages/dashboard/Jobs'
import AppliedJobs from '../pages/dashboard/AppliedJobs'
import SelectedJobs from '../pages/dashboard/SelectedJobs'
import ShortlistedJobs from '../pages/dashboard/ShortlistedJobs'
import RejectedJobs from '../pages/dashboard/RejectedJobs'
import UpcomingInterviews from '../pages/dashboard/UpcomingInterviews'
import CompanyDashboardRouter from '../pages/companyDashboard/CompanyDashboardRouter'

// Admin Panel Imports
import { AdminAuthProvider } from '../context/AdminAuthContext'
import { AdminDashboardLayout } from '../layouts/AdminDashboardLayout'
import { AdminLogin } from '../pages/admin/AdminLogin'
import { AdminOverview } from '../pages/admin/AdminOverview'
import { StudentManagement } from '../pages/admin/StudentManagement'
import { AddStudent } from '../pages/admin/AddStudent'
import { CompanyManagement } from '../pages/admin/CompanyManagement'
import { AddCompany } from '../pages/admin/AddCompany'
import { JobManagement } from '../pages/admin/JobManagement'
import { ApplicationManagement } from '../pages/admin/ApplicationManagement'
import { AdminInterviewManagement } from '../pages/admin/AdminInterviewManagement'
import { AdminSettings } from '../pages/admin/AdminSettings'

// Route Protection Contexts & Components
import { StudentAuthProvider } from '../context/AuthContext'
import { StudentProtectedRoute } from '../components/StudentProtectedRoute'
import { CompanyAuthProvider } from '../context/CompanyAuthContext'
import { CompanyProtectedRoute } from '../components/CompanyProtectedRoute'
import { AdminProtectedRoute } from '../components/AdminProtectedRoute'

function DOM() {
  return (
    <div>
      <div>
        <BrowserRouter>
          <Routes>
            {/* Login & Registration */}
            <Route path='/' element={<Login defaultRole='student'/>}/>
            <Route path='/login' element={<Login defaultRole='student'/>}/>
            <Route path='/studentlogin' element={<Login defaultRole='student'/>}/>
            <Route path='/companylogin' element={<Login defaultRole='company'/>}/>
            <Route path='/studentreg' element={<Studentreg/>}/>
            <Route path='/companyreg' element={<Companyreg/>}/>

            {/* Student Dashboard (Protected) */}
            <Route path='/student/dashboard' element={<StudentAuthProvider><StudentProtectedRoute><StudentDashboard/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard' element={<StudentAuthProvider><StudentProtectedRoute><DashboardOverview/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/jobs' element={<StudentAuthProvider><StudentProtectedRoute><Jobs/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard/jobs' element={<StudentAuthProvider><StudentProtectedRoute><Jobs/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard/applied-jobs' element={<StudentAuthProvider><StudentProtectedRoute><AppliedJobs/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard/selected-jobs' element={<StudentAuthProvider><StudentProtectedRoute><SelectedJobs/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard/shortlisted-jobs' element={<StudentAuthProvider><StudentProtectedRoute><ShortlistedJobs/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard/rejected-jobs' element={<StudentAuthProvider><StudentProtectedRoute><RejectedJobs/></StudentProtectedRoute></StudentAuthProvider>}/>
            <Route path='/student-dashboard/upcoming-interviews' element={<StudentAuthProvider><StudentProtectedRoute><UpcomingInterviews/></StudentProtectedRoute></StudentAuthProvider>}/>

            {/* Company Dashboard (Protected) */}
            <Route path='/company/:companyId/*' element={
              <CompanyAuthProvider>
                <CompanyProtectedRoute>
                  <CompanyDashboardRouter/>
                </CompanyProtectedRoute>
              </CompanyAuthProvider>
            }/>

            {/* Admin Dashboard (Protected) */}
            <Route path='/admin/login' element={
              <AdminAuthProvider>
                <AdminLogin />
              </AdminAuthProvider>
            } />
            
            <Route path='/admin/*' element={
              <AdminAuthProvider>
                <AdminProtectedRoute>
                  <AdminDashboardLayout>
                    <Routes>
                      <Route path="overview" element={<AdminOverview />} />
                      <Route path="students" element={<StudentManagement />} />
                      <Route path="students/add" element={<AddStudent />} />
                      <Route path="companies" element={<CompanyManagement />} />
                      <Route path="companies/add" element={<AddCompany />} />
                      <Route path="jobs" element={<JobManagement />} />
                      <Route path="applications" element={<ApplicationManagement />} />
                      <Route path="interviews" element={<AdminInterviewManagement />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                  </AdminDashboardLayout>
                </AdminProtectedRoute>
              </AdminAuthProvider>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default DOM