import React, { useState } from 'react'
import axios from 'axios'
import './Companyreg.css'
import { Link, useNavigate } from 'react-router-dom'

function Companyreg() {
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [hrname, setHrname] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage("")

    if (password !== confirmPassword) {
      setStatusMessage('Passwords must match.')
      return
    }

    try {
      await axios.post('http://localhost:5000/company/auth/register', {
        name: company,
        email,
        website,
        HRName: hrname,
        phoneNumber: phone,
        location,
        description,
        password,
        confirmPassword,
      })
      
      setStatusMessage('Registration successful! Redirecting to login...')
      
      setTimeout(() => {
        navigate('/companylogin')
      }, 2000)
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to register company.'
      setStatusMessage(message)
    }
  }

  return (
    <div className='register-container'>
      <div className='logo'>
        <h1>HireBridge</h1>
      </div>

      <div className='register-box'>
        <h1 className='title'>Register Company</h1>
        <p className='subtitle'>
          Enter your professional details to get started.
        </p>

        <form onSubmit={handleSubmit}>
          <div className='form-row'>
            <div className='form-field'>
              <label>Name</label>
              <input
                type='text'
                placeholder='Enter company name'
                className='textbox'
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>Email</label>
              <input
                type='email'
                placeholder='Enter company email'
                className='textbox'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Website</label>
              <input
                type='text'
                placeholder='https://example.com'
                className='textbox'
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>HR Name</label>
              <input
                type='text'
                placeholder='Enter HR name'
                className='textbox'
                value={hrname}
                onChange={(e) => setHrname(e.target.value)}
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
              <label>Location</label>
              <input
                type='text'
                placeholder='Enter location'
                className='textbox'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className='form-field'>
            <label>Description</label>
            <textarea
              placeholder='Tell us about your company...'
              className='textarea'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Password</label>
              <input
                type='password'
                placeholder='password'
                className='textbox'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>Confirm Password</label>
              <input
                type='password'
                placeholder='confirm password'
                className='textbox'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {statusMessage && <div className='error-message'>{statusMessage}</div>}

          <button type='submit' className='btn'>
            Create Company Account →
          </button>
        </form>

        <p className='login-text'>
          Already have a company account?
          <Link to={'/companylogin'} className='login'> Login</Link>
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

export default Companyreg