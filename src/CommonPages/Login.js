import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/Login.css';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import TelstraLogo from '../Images/Telstra.jfif';
import BackgroundImage from '../Images/Background.jpg';

const Login = ({ setIsUser, setIsAdmin }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const backgroundStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh', // Ensure the background covers the full viewport height
    width: '100vw',  // Ensure the background covers the full viewport width
};
  // Check localStorage on page load to persist login state
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    const isUser = localStorage.getItem('isUser');
    const lastPage = localStorage.getItem('lastVisitedPage') || '/home';

    if (isAdmin === 'true') {
      setIsAdmin(true);
      navigate('/admin');
    } else if (isUser === 'true') {
      setIsUser(true);
      navigate('/user');
    }
  }, [navigate, setIsAdmin, setIsUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('password', password);
      try {
        // First, handle login attempt
        const response = await axios.post('http://localhost:8082/login', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        if (response.status === 200) {
          // Only call checkLoggedInUser if login is successful
          const roleResponse = await axios.get('http://localhost:8082/checkLoggedInUser', {
            withCredentials: true,
          });
    
          const userRole = roleResponse.data.userRole;
          const lastPage = localStorage.getItem('lastVisitedPage') || (userRole === 'ROLE_ADMIN' ? '/admin/home' : '/user');
    
          if (userRole === 'ROLE_ADMIN') {
            setIsAdmin(true);
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('lastVisitedPage', lastPage); // Ensure last page is set
            navigate(lastPage);
          } else if (userRole === 'ROLE_USER') {
            setIsUser(true);
            localStorage.setItem('isUser', 'true');
            localStorage.setItem('lastVisitedPage', lastPage); // Ensure last page is set
            navigate(lastPage);
          } else {
            alert("Account doesn't exist!! Please sign up.");
            navigate('/signup');
          }
        }
      } catch (error) {
        // Log the error for debugging
        console.log('Login error:', error.response || error.message);
    
        // Handle specific error responses based on status codes
        if (error.response) {
          if (error.response.status === 400) {
            // Incorrect password case
            setErrorMessage('Invalid username or password. Please try again.');
          } else {
            setErrorMessage('Something went wrong. Please try again later.');
          }
        } else {
          setErrorMessage('Unable to reach server. Please try again later.');
        }
      }
    };

  return (
    <>
    <div style={backgroundStyle}>
      <nav className="navbar">
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

      <div className="login-container">
        <h1>Login</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>User Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
          <p className="login-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
      </div>
    </>
  );
};

export default Login;
