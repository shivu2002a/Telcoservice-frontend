import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ setIsUser, setIsAdmin }) => {
  const navigate = useNavigate();
  const logoutTimer = useRef(null);

  // Log the user out by clearing their session
  const logout = () => {
    alert("Session timeout!!\nPlease do login again");
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isUser');
    navigate('/login');
  };

  // Reset the logout timer
  const resetTimer = () => {
    
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    logoutTimer.current = setTimeout(logout, 600000); // 10 minutes (600000 ms)
  };

  useEffect(() => {
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    // Initialize the timer
    resetTimer();

    // Cleanup function to remove listeners and clear timer
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, []);

  return null;
};

export default AutoLogout;
