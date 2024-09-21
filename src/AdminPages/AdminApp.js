import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import TelstraLogo from '../Images/Telstra.jfif';
import AutoLogout from '../CommonPages/AutoLogout';
import ProfileOverlay from './ProfileOverlay'; // Assuming you have a similar ProfileOverlay for admin
import UserImage from '../Images/User.jfif'; // Admin profile image

function AdminApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  // Toggle profile overlay
  const toggleProfile = () => {
    if (isProfileOpen) {
      setIsSliding(true);
      setTimeout(() => {
        setIsProfileOpen(false);
        setIsSliding(false);
      }, 300); // Match with the transition time in CSS
    } else {
      setIsProfileOpen(true);
    }
  };

  // Save the last visited page when navigating unless logging out
  useEffect(() => {
    if (location.pathname !== '/logout') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  // Redirect to the last visited page if it's not the current page
  useEffect(() => {
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage && lastPage !== location.pathname) {
      navigate(lastPage);
    }
  }, [location, navigate]);

  const navigateHome=()=>{
    navigate('/admin/home');
  }
  return (
    <>
      <AutoLogout />
      <div id="top-navbar">
        <nav className="navbar">
          <div className='logo' onClick={navigateHome}>
            <img src={TelstraLogo} alt="Logo" className="navbar-image" />
            <h1 className="title">Telcoservice Provisioning</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/admin/home">Home</Link></li>
            <li><Link to="/admin/manageServices">Manage Services</Link></li>
            <li><Link to="/admin/requests">Manage Requests</Link></li>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/addNewAdmin">Add Admin</Link></li>
            <li>
              {/* Profile icon for opening profile overlay */}
              <img 
                src={UserImage} 
                alt="Admin Profile" 
                onClick={toggleProfile} 
                style={{ cursor: 'pointer', height: '40px', width: '40px', borderRadius: '50%' }} 
              />
            </li>
          </ul>
        </nav>

        {/* Profile Overlay */}
        {isProfileOpen && <ProfileOverlay onClose={toggleProfile} isSliding={isSliding} />}
        
        <Outlet />
      </div>
    </>
  );
}

export default AdminApp;
