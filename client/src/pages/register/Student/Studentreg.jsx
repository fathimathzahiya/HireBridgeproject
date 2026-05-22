import React, { useState } from 'react'
import axios from 'axios'
import './Studentreg.css'
import { Link, useNavigate } from 'react-router-dom'

function Studentreg() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage('')

    if (password !== confirmPassword) {
      setStatusMessage('Passwords must match.')
      return
    }

    try {
      await axios.post('http://localhost:5000/student/auth/register', {
        username: fullname,
        email,
        phoneNumber: phone,
        college,
        branch,
        year,
        password,
        confirmPassword,
      })
      navigate('/studentlogin')
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to register student.'
      setStatusMessage(message)
    }
  }

  return (
    <div className='register-container'>
      <div className='logo'>
        <h1>HireBridge</h1>
      </div>

      <div className='register-box'>
        <h1 className='title'>Register Student</h1>
        <p className='subtitle'>Enter your academic details to get started.</p>

        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-field'>
              <label>Full Name</label>
              <input
                type='text'
                placeholder='Enter your full name'
                className='textbox'
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>Email</label>
              <input
                type='email'
                placeholder='Enter your email'
                className='textbox'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Phone Number</label>
              <input
                type='text'
                placeholder='Enter phone number'
                className='textbox'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>College / University</label>
              <input
                type='text'
                placeholder='Enter college or university'
                className='textbox'
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Branch</label>
              <input
                type='text'
                placeholder='Enter your branch'
                className='textbox'
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>Year</label>
              <input
                type='text'
                placeholder='Enter your year of study'
                className='textbox'
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Password</label>
              <input
                type='password'
                placeholder='Password'
                className='textbox'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>Confirm Password</label>
              <input
                type='password'
                placeholder='Confirm password'
                className='textbox'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {statusMessage && <div className='error-message'>{statusMessage}</div>}

          <button type='submit' className='btn'>
            Create Student Account →
          </button>
        </form>

        <p className='login-text'>
          Already have a student account?
          <Link to={'/studentlogin'} className='login'> Login</Link>
        </p>
      </div>

      <div className='footer'>
        <h2>HireBridge</h2>
        <p>
          © 2024 HireBridge Placement Solutions.
          All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Studentreg
