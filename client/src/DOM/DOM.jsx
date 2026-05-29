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
import { AdminAuthProvider, ProtectedAdminRoute } from '../context/AdminAuthContext'
import { AdminDashboardLayout } from '../layouts/AdminDashboardLayout'
import { AdminLogin } from '../pages/admin/AdminLogin'
import { AdminOverview } from '../pages/admin/AdminOverview'
import { StudentManagement } from '../pages/admin/StudentManagement'
import { CompanyManagement } from '../pages/admin/CompanyManagement'
import { JobManagement } from '../pages/admin/JobManagement'
import { ApplicationManagement } from '../pages/admin/ApplicationManagement'
import { AdminInterviewManagement } from '../pages/admin/AdminInterviewManagement'
import { NotificationManagement } from '../pages/admin/NotificationManagement'
import { Reports } from '../pages/admin/Reports'
import { AdminSettings } from '../pages/admin/AdminSettings'

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

            {/* Student Dashboard */}
            <Route path='/student/dashboard' element={<StudentDashboard/>}/>
            <Route path='/student-dashboard' element={<DashboardOverview/>}/>
            <Route path='/jobs' element={<Jobs/>}/>
            <Route path='/student-dashboard/jobs' element={<Jobs/>}/>
            <Route path='/student-dashboard/applied-jobs' element={<AppliedJobs/>}/>
            <Route path='/student-dashboard/selected-jobs' element={<SelectedJobs/>}/>
            <Route path='/student-dashboard/shortlisted-jobs' element={<ShortlistedJobs/>}/>
            <Route path='/student-dashboard/rejected-jobs' element={<RejectedJobs/>}/>
            <Route path='/student-dashboard/upcoming-interviews' element={<UpcomingInterviews/>}/>

            {/* Company Dashboard */}
            <Route path='/company/:companyId/*' element={<CompanyDashboardRouter/>}/>

            {/* Admin Dashboard */}
            <Route path='/admin/login' element={
              <AdminAuthProvider>
                <AdminLogin />
              </AdminAuthProvider>
            } />
            
            <Route path='/admin/*' element={
              <AdminAuthProvider>
                <ProtectedAdminRoute>
                  <AdminDashboardLayout>
                    <Routes>
                      <Route path="overview" element={<AdminOverview />} />
                      <Route path="students" element={<StudentManagement />} />
                      <Route path="companies" element={<CompanyManagement />} />
                      <Route path="jobs" element={<JobManagement />} />
                      <Route path="applications" element={<ApplicationManagement />} />
                      <Route path="interviews" element={<AdminInterviewManagement />} />
                      <Route path="notifications" element={<NotificationManagement />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                  </AdminDashboardLayout>
                </ProtectedAdminRoute>
              </AdminAuthProvider>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default DOM