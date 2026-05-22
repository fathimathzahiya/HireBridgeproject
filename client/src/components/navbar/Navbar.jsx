import React from 'react';
import { FaRegCircleUser } from "react-icons/fa6";
import './Navbar.css';

function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <h1 className="navbar-title">HireBridge</h1>
        <div className="icon">
          <FaRegCircleUser />
        </div>
      </nav>
    </div>
  )
}

export default Navbar