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
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const navigate = useNavigate()

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setStatusMessage("Please select an image file only.")
        return
      }
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage("")

    if (password !== confirmPassword) {
      setStatusMessage('Passwords must match.')
      return
    }

    try {
      const data = new FormData()
      data.append("name", company)
      data.append("email", email)
      data.append("website", website)
      data.append("HRName", hrname)
      data.append("phoneNumber", phone)
      data.append("location", location)
      data.append("description", description)
      data.append("password", password)
      data.append("confirmPassword", confirmPassword)
      
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto)
      }

      await axios.post('http://localhost:5000/company/auth/register', data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
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

          <div className='form-field' style={{ marginBottom: "15px" }}>
            <label>Profile Photo (Accepts JPG, PNG, WEBP)</label>
            <input
              type='file'
              accept='image/*'
              onChange={handlePhotoChange}
              style={{ display: "none" }}
              id="profilePhotoUpload"
            />
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "8px" }}>
              <label htmlFor="profilePhotoUpload" className="btn" style={{ margin: 0, padding: "8px 16px", cursor: "pointer", width: "auto", display: "inline-block", background: "#3b82f6" }}>
                Choose Profile Photo
              </label>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #3b82f6" }}
                />
              )}
              {profilePhoto && <span style={{ color: "#cbd5e1", fontSize: "14px" }}>{profilePhoto.name}</span>}
            </div>
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