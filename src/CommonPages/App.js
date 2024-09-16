import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import './Styling_Components/App.css';
import TelstraLogo from '../Images/Telstra.jfif';
import Background from '../Images/Background.jpg';

function App() {
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
    <div style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100%'}}>
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
