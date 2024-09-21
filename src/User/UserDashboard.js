import React, { useState } from 'react';
import { useNavigate,Outlet, Link } from 'react-router-dom';
import './Styling_Components/UserDashboard.css';
import AutoLogout from '../CommonPages/AutoLogout';
import TelstraLogo from '../Images/Telstra.jfif';
import ProfileOverlay from './ProfileOverlay';
import UserImage from '../Images/User.jfif';

const UserDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const navigate=useNavigate();
  const toggleProfile = () => {
    if (isProfileOpen) {
      setIsSliding(true);
      setTimeout(() => {
        setIsProfileOpen(false);
        setIsSliding(false);
      }, 300); // Duration should match CSS transition
    } else {
      setIsProfileOpen(true);
    }
  };
  const navigateHome=()=>{
    navigate('/user/home');
  }

  return (
    <>
      <AutoLogout />
      <nav className={`navbar ${isProfileOpen ? 'hidden' : ''}`}>
        <div className='logo' onClick={navigateHome}>
          <img src={TelstraLogo} alt="Logo" className="navbar-image"/>
          <h1 className="title">Telcoservice Provisioning</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/user/home">Home</Link></li>
          <li><Link to="/user/services">Services</Link></li>
          <li><Link to="/user/subscribed-services">My Services</Link></li>
          <li><Link to="/user/pending-requests">My Requests</Link></li>
          <li>
            <Link> {/* Wrap the image in a Link */}
              <img 
                src={UserImage} 
                alt="User Profile" 
                onClick={toggleProfile} 
                style={{ cursor: 'pointer', height: '40px', width: '40px', borderRadius: '50%' }} 
              />
            </Link>
          </li>
        </ul>
      </nav>
      {isProfileOpen && <ProfileOverlay onClose={toggleProfile} isSliding={isSliding} />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserDashboard;
