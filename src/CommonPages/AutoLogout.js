// src/CommonPages/AutoLogout.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ setIsUser, setIsAdmin }) => {
  const navigate = useNavigate();
  let logoutTimer;

  // Log the user out by clearing their session
  const logout = () => {
    alert("Session timeout!!\n Please do login again");
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isUser');
    setIsAdmin(false);
    setIsUser(false);
    navigate('/login');
  };

  // Reset the logout timer
  const resetTimer = () => {
    console.log('User activity detected. Resetting timer...');
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    logoutTimer = setTimeout(logout, 600000); // 10 minutes (600000 ms)
  };

  useEffect(() => {
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    // Initialize the timer
    resetTimer();

    // Cleanup function to remove listeners and clear timer
    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, []);

  return null;
};

export default AutoLogout;
