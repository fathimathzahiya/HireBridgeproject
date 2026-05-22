import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Companyreg from '../pages/register/Company/Companyreg'
import Studentreg from '../pages/register/Student/Studentreg'
import Login from '../pages/login/Login'
import StudentDashboard from '../pages/dashboard/StudentDashboard'
import CompanyDashboard from '../pages/dashboard/CompanyDashboard'

function DOM() {
  return (
    <div>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login defaultRole='student'/>}/>
            <Route path='/studentlogin' element={<Login defaultRole='student'/>}/>
            <Route path='/companylogin' element={<Login defaultRole='company'/>}/>
            <Route path='/studentreg' element={<Studentreg/>}/>
            <Route path='/companyreg' element={<Companyreg/>}/>
            <Route path='/student/dashboard' element={<StudentDashboard/>}/>
            <Route path='/company/dashboard' element={<CompanyDashboard/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default DOM