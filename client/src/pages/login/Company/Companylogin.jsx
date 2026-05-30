import React, { useState } from 'react'
import './Companylogin.css'
import { Link } from 'react-router-dom';

function Companylogin() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

   
  }

  return (
    <div>

      <div className='login-container'>

        <div className='login-box'>
          <div className="login-card">

           <h1>Welcome Back</h1>
           <p className="para">Access your smart placement dashboard</p>

           {/* Buttons */}
          <div className="role-buttons">
          <button >Student</button>
          <button className="active">Company</button>
          </div>

          <form onSubmit={handleSubmit}>

            <label> Email</label>

            <input
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='textbox'
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              placeholder='password'
              onChange={(e) => setPassword(e.target.value)}
              className='textbox'
            />

            <div className='options'>

              <div>
                <input type="checkbox" />
                <span> Remember me</span>
              </div>

              
            </div>

            <button type='submit' className='btn'>
              Sign In
            </button>

          </form>

          <p className='register'>
            New to HireBridge?
          <Link to={'/companyreg'} className='register'> <p>Register now</p> </Link>
          </p>

        </div>

      </div>

     </div>
    </div>
  )
}

export default Companylogin