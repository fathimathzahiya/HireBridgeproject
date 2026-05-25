import React, { useState } from 'react'
import axios from 'axios'
import './Studentreg.css'
import { Link, useNavigate } from 'react-router-dom'

function Studentreg() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    department: '',
    cgpa: '',
    project: '',
    skills: '',
    certification: '',
    resume: '',
    profileImage: '',
    github: '',
    linkedin: '',
    address: '',
    password: '',
    confirmPassword: '',
  })

  const [filePreview, setFilePreview] = useState({
    profileImage: null,
    resume: null,
  })

  const [files, setFiles] = useState({
    profileImage: null,
    resume: null,
    certification: null,
  })

  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    if (fileList && fileList[0]) {
      const file = fileList[0]
      
      // Store the actual file object
      setFiles(prev => ({
        ...prev,
        [name]: file,
      }))
      
      // Show preview for images only
      if (name === 'profileImage') {
        const reader = new FileReader()
        reader.onload = (event) => {
          setFilePreview(prev => ({
            ...prev,
            profileImage: event.target.result,
          }))
        }
        reader.readAsDataURL(file)
      } else if (name === 'resume') {
        setFilePreview(prev => ({
          ...prev,
          resume: file.name,
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMessage('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage('Passwords must match.')
      setLoading(false)
      return
    }

    if (!formData.fullname || !formData.email || !formData.phone || !formData.password) {
      setStatusMessage('Please fill all required fields (marked with *).')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('http://localhost:5000/student/auth/register', {
        username: formData.fullname,
        email: formData.email,
        phoneNumber: formData.phone,
        college: formData.department || 'Not specified',
        branch: 'Not specified',
        year: 'Not specified',
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      // Create FormData for file upload
      const profileFormData = new FormData()
      profileFormData.append('username', formData.fullname)
      profileFormData.append('email', formData.email)
      profileFormData.append('phoneNumber', formData.phone)
      profileFormData.append('department', formData.department)
      profileFormData.append('cgpa', formData.cgpa ? parseFloat(formData.cgpa) : null)
      profileFormData.append('project', formData.project)
      profileFormData.append('skills', formData.skills)
      profileFormData.append('github', formData.github)
      profileFormData.append('linkedin', formData.linkedin)
      profileFormData.append('address', formData.address)
      profileFormData.append('password', formData.password)

      // Append files if they exist
      if (files.resume) {
        profileFormData.append('resume', files.resume)
      }
      if (files.profileImage) {
        profileFormData.append('profileImage', files.profileImage)
      }
      if (files.certification) {
        profileFormData.append('certification', files.certification)
      }

      // Send with FormData
      await axios.put(
        `http://localhost:5000/api/student/updatestudent/${response.data.id}`,
        profileFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setStatusMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/studentlogin')
      }, 2000)
    } catch (error) {
      const message = error.response?.data?.error || 'Unable to register student.'
      setStatusMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='register-container'>
      <div className='logo'>
        <h1>HireBridge</h1>
      </div>

      <div className='register-box'>
        <h1 className='title'>Register as Student</h1>
        <p className='subtitle'>Complete your profile to get started with HireBridge.</p>

        <form onSubmit={handleSubmit}>
          {/* Required Fields */}
          <div className='section-title'>Basic Information *</div>
          
          <div className='form-row'>
            <div className='form-field'>
              <label>Full Name *</label>
              <input
                type='text'
                name='fullname'
                placeholder='Enter your full name'
                className='textbox'
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-field'>
              <label>Email Address *</label>
              <input
                type='email'
                name='email'
                placeholder='Enter your email'
                className='textbox'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Phone Number *</label>
              <input
                type='tel'
                name='phone'
                placeholder='Enter phone number'
                className='textbox'
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-field'>
              <label>Address</label>
              <input
                type='text'
                name='address'
                placeholder='Enter your address'
                className='textbox'
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className='section-title'>Academic Information</div>
          
          <div className='form-row'>
            <div className='form-field'>
              <label>Department</label>
              <input
                type='text'
                name='department'
                placeholder='e.g., Computer Science, Mechanical Engineering'
                className='textbox'
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div className='form-field'>
              <label>CGPA</label>
              <input
                type='number'
                name='cgpa'
                placeholder='e.g., 8.5'
                className='textbox'
                step='0.01'
                min='0'
                max='10'
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className='section-title'>Professional Information</div>
          
          <div className='form-row'>
            <div className='form-field full-width'>
              <label>Skills</label>
              <textarea
                name='skills'
                placeholder='e.g., JavaScript, React, Node.js, MongoDB, Python'
                className='textbox'
                rows='3'
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field full-width'>
              <label>Projects</label>
              <textarea
                name='project'
                placeholder='Describe your projects and achievements'
                className='textbox'
                rows='3'
                value={formData.project}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field full-width'>
              <label htmlFor='certificationUpload'>Certifications (Upload PDF/Image)</label>
              <div className='file-input-wrapper'>
                <input
                  id='certificationUpload'
                  type='file'
                  name='certification'
                  accept='.pdf,.jpg,.jpeg,.png,.doc,.docx'
                  className='file-input'
                  onChange={handleFileChange}
                />
                <label htmlFor='certificationUpload' className='file-input-label'>Choose File</label>
              </div>
              <p className='file-info'>Supported: PDF, Images (JPG, PNG), Documents (DOC, DOCX)</p>
              {formData.certification && <p className='file-selected'>✓ File selected</p>}
            </div>
          </div>

          {/* Links & Documents */}
          <div className='section-title'>Links & Documents</div>
          
          <div className='form-row'>
            <div className='form-field'>
              <label>GitHub Profile</label>
              <input
                type='url'
                name='github'
                placeholder='https://github.com/username'
                className='textbox'
                value={formData.github}
                onChange={handleChange}
              />
            </div>
            <div className='form-field'>
              <label>LinkedIn Profile</label>
              <input
                type='url'
                name='linkedin'
                placeholder='https://linkedin.com/in/username'
                className='textbox'
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label htmlFor='resumeUpload'>Resume (Upload PDF)</label>
              <div className='file-input-wrapper'>
                <input
                  id='resumeUpload'
                  type='file'
                  name='resume'
                  accept='.pdf'
                  className='file-input'
                  onChange={handleFileChange}
                />
                <label htmlFor='resumeUpload' className='file-input-label'>Choose File</label>
              </div>
              <p className='file-info'>PDF only (Max 5MB)</p>
              {filePreview.resume && <p className='file-selected'>✓ {filePreview.resume}</p>}
            </div>
            <div className='form-field'>
              <label htmlFor='profileImageUpload'>Profile Image (Upload JPG/PNG)</label>
              <div className='file-input-wrapper'>
                <input
                  id='profileImageUpload'
                  type='file'
                  name='profileImage'
                  accept='.jpg,.jpeg,.png'
                  className='file-input'
                  onChange={handleFileChange}
                />
                <label htmlFor='profileImageUpload' className='file-input-label'>Choose File</label>
              </div>
              <p className='file-info'>JPG or PNG (Max 2MB)</p>
              {filePreview.profileImage && (
                <div className='image-preview'>
                  <img src={filePreview.profileImage} alt='Profile Preview' />
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className='section-title'>Security Information *</div>
          
          <div className='form-row'>
            <div className='form-field'>
              <label>Password *</label>
              <input
                type='password'
                name='password'
                placeholder='Create a strong password'
                className='textbox'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-field'>
              <label>Confirm Password *</label>
              <input
                type='password'
                name='confirmPassword'
                placeholder='Confirm your password'
                className='textbox'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {statusMessage && (
            <div className={statusMessage.includes('successful') ? 'success-message' : 'error-message'}>
              {statusMessage}
            </div>
          )}

          <button type='submit' className='btn' disabled={loading}>
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        </form>

        <p className='login-link'>
          Already have an account?
          <Link to='/studentlogin'> Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Studentreg
