import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ setIsAdmin, setIsUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = async () => {
      const confirmed = window.confirm('Are you sure you want to log out?');

      if (confirmed) {
        try {
          // Call the logout API to clear the session on the server
          await axios.post('http://localhost:8082/logout', {}, {
            withCredentials: true,
          });

          // Clear user data from localStorage
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('isUser'); 
          localStorage.removeItem('lastVisitedPage');
          // Clear user status as well if needed
          setIsAdmin(false); // Clear admin status in state
          setIsUser(false);  // Clear user status in state
          
          alert("You have been logged out successfully!");
          
          // Redirect to login page
          navigate('/');
        } catch (error) {
          console.error('Logout failed:', error);
          alert('Logout failed. Please try again.');
        }
      } else {
        // If the user cancels the logout, navigate back to the previous page
        navigate(-1); // Navigates back to the previous page
      }
    };

    confirmLogout();
  }, [navigate, setIsAdmin, setIsUser]);

  return null; // No UI needed for this component
};

export default Logout;
