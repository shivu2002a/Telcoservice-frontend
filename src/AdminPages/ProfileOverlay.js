import React, {useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import './Styling_Components/ProfileOverlay.css';
import axios from 'axios';
import UserImage from '../Images/User.jfif';

const ProfileOverlay = ({ onClose, isSliding }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
  const onLogout=()=>{
    navigate('/logout');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8082/checkLoggedInUser', { withCredentials: true });
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`profile-overlay ${isSliding ? 'sliding' : 'open'}`}>
        <button onClick={onClose} className="close-button">X</button>
      <div className="profile-content">
        <img src={UserImage} alt="User Profile" className="userImage" />
        <h2>{userData.username}</h2>
        <div className='details'>
        <p><strong>Name:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone Number:</strong> {userData.phonenumber}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverlay;
