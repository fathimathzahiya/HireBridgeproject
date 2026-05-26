import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'

function Login({ defaultRole = 'student' }) {
  const [role, setRole] = useState(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setRole(defaultRole)
  }, [defaultRole])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage('')

    const endpoint = role === 'student'
      ? 'http://localhost:5000/student/auth/login'
      : 'http://localhost:5000/company/auth/login'

    try {
      const response = await axios.post(endpoint, { email, password })
      const userData = { ...response.data, role }
      localStorage.setItem('hirebridge_user', JSON.stringify(userData))
      if (response.data.token) {
        localStorage.setItem('hirebridge_token', response.data.token)
      }
      
      // Store student ID for profile fetching
      if (role === 'student') {
        localStorage.setItem('studentId', response.data.id)
        localStorage.setItem('studentName', response.data.username)
        navigate('/student-dashboard')
      } else {
        localStorage.setItem('companyId', response.data.id)
        localStorage.setItem('companyName', response.data.name)
        localStorage.setItem('companyEmail', response.data.email)
        navigate(`/company/${response.data.id}/overview`)
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to login. Please try again.'
      setStatusMessage(message)
    }
  }

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className='login-card'>
          <h1>Welcome Back</h1>
          <p className='para'>Access your smart placement dashboard</p>

          <div className='role-buttons'>
            <button
              type='button'
              className={role === 'student' ? 'active' : ''}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type='button'
              className={role === 'company' ? 'active' : ''}
              onClick={() => setRole('company')}
            >
              Company
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='textbox'
            />

            <label>Password</label>
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='textbox'
            />

            <div className='options'>
              <div className='remember'>
                <input id='remember' type='checkbox' />
                <label htmlFor='remember'>
                  <span> Remember me</span>
                </label>
              </div>
            </div>

            {statusMessage && <div className='error-message'>{statusMessage}</div>}

            <button type='submit' className='btn'>
              Sign In
            </button>
          </form>

          <p className='register'>
            New to HireBridge?
            <Link
              to={role === 'student' ? '/studentreg' : '/companyreg'}
              className='register-link'
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
