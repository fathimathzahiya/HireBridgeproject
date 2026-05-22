import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CompanyDashboard() {
  const navigate = useNavigate()
  const authUser = JSON.parse(localStorage.getItem('hirebridge_user'))

  useEffect(() => {
    if (!authUser || authUser.role !== 'company') {
      navigate('/')
    }
  }, [authUser, navigate])

  const handleLogout = () => {
    localStorage.removeItem('hirebridge_user')
    navigate('/')
  }

  if (!authUser) return null

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Company Dashboard</h1>
      <p>Welcome back, {authUser.name || authUser.email}</p>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default CompanyDashboard
