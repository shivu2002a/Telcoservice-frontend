// Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ setIsAdmin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = async () => {
      const confirmed = window.confirm('Are you sure you want to log out?');

      if (confirmed) {
        try {
          // Call the logout API to clear the session on the server if needed
          await axios.post('http://localhost:8082/logout', {}, {
            withCredentials: true,
          });

          // Clear user data (like admin status) from localStorage or state
          localStorage.removeItem('isAdmin');
          setIsAdmin(false); // Clear admin status in state
          alert("Logging out!!");
          // Redirect to login page
          navigate('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      } else {
        // If the user cancels logout, navigate back to the previous page
        navigate(-1); // Navigates back to the previous page
      }
    };

    confirmLogout();
  }, [navigate, setIsAdmin]);

  return null; // No UI needed for this component
};

export default Logout;
