import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import './Styling_Components/App.css';
import TelstraLogo from '../Images/Telstra.jfif';
import BackgroundImage from '../Images/Background.jpg';
import AutoLogout from './AutoLogout';
function App() {
  const backgroundStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh', // Ensure the background covers the full viewport height
    width: '100vw',  // Ensure the background covers the full viewport width
};
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Update lastVisitedPage unless navigating to login or signup
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  useEffect(() => {
    // Redirect to the last visited page if applicable
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage && lastPage !== location.pathname) {
      navigate(lastPage);
    }
  }, [location, navigate]);

  return (
    <>
    <AutoLogout />
    <div style={backgroundStyle}>
      <nav className="navbar" id="top-navbar">
        <div className='logo'>
          <img src={TelstraLogo} alt="Logo" className="navbar-image" />
          <h1 className="title">Telcoservice Provisioning</h1>
        </div>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Create an account</Link></li>
        </ul>
      </nav>
      <Outlet />
      </div>
    </>
  );
}

export default App;
