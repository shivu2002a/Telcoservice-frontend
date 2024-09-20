// src/User/UserDashboard.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Styling_Components/UserDashboard.css'; // Update or merge styles if needed
import AutoLogout from '../CommonPages/AutoLogout';
import TelstraLogo from '../Images/Telstra.jfif';
const UserDashboard = () => {
  return (
    <>
      <AutoLogout />
      <nav className="navbar">
        <div className='logo'>
          <img src={TelstraLogo} alt="Logo" className="navbar-image" />
          <h1 className="title">Telcoservice Provisioning</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/user/home">Home</Link></li>
          <li><Link to="/user/services">Services</Link></li>
          <li><Link to="/user/subscribed-services">My Services</Link></li>
          <li><Link to="/user/pending-requests">My Requests</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserDashboard;
