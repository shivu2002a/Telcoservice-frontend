import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import TelstraLogo from '../Images/Telstra.jfif';
import AutoLogout from '../CommonPages/AutoLogout';

function AdminApp() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Update lastVisitedPage on navigation unless logging out
    if (location.pathname !== '/logout') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  useEffect(() => {
    // Redirect to the last visited page if it’s not the current page
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage && lastPage !== location.pathname) {
      navigate(lastPage);
    }
  }, [location, navigate]);

  return (
    <>
    <AutoLogout/>
      <div id="top-navbar">
        <nav className="navbar">
          <div className='logo'>
            <img src={TelstraLogo} alt="Logo" className="navbar-image" />
            <h1 className="title">Telcoservice Provisioning</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/admin/home">Home</Link></li>
            <li><Link to="/admin/manageServices">Manage Services</Link></li>
            <li><Link to="/admin/requests">Manage Requests</Link></li>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/addNewAdmin">Add Admin</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </ul>
        </nav>
        <Outlet />
        
      </div>

    </>
  );
}

export default AdminApp;
