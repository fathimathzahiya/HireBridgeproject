import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Companyreg from '../pages/register/Company/Companyreg'
import Studentreg from '../pages/register/Student/Studentreg'
import Login from '../pages/login/Login'
import StudentDashboard from '../pages/dashboard/StudentDashboard'
import DashboardOverview from '../pages/dashboard/DashboardOverview'
import AppliedJobs from '../pages/dashboard/AppliedJobs'
import ShortlistedJobs from '../pages/dashboard/ShortlistedJobs'
import RejectedJobs from '../pages/dashboard/RejectedJobs'
import UpcomingInterviews from '../pages/dashboard/UpcomingInterviews'
import CompanyDashboardRouter from '../pages/companyDashboard/CompanyDashboardRouter'

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
            <Route path='/student-dashboard/applied-jobs' element={<AppliedJobs/>}/>
            <Route path='/student-dashboard/shortlisted-jobs' element={<ShortlistedJobs/>}/>
            <Route path='/student-dashboard/rejected-jobs' element={<RejectedJobs/>}/>
            <Route path='/student-dashboard/upcoming-interviews' element={<UpcomingInterviews/>}/>

            {/* Company Dashboard */}
            <Route path='/company/:companyId/*' element={<CompanyDashboardRouter/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default DOM