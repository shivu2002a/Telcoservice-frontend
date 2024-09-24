import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddNewAdmin() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    address: 'admin' // Default value for address
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    if (!formData.password) errors.password = 'Password is required';
    else if (!passwordRegex.test(formData.password))
      errors.password = 'Password must be at least 8 characters long and contain both letters and numbers';

    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (!formData.phonenumber) errors.phonenumber = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phonenumber)) errors.phonenumber = 'Phone number must be 10 digits';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSubmit = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phonenumber: formData.phonenumber,
      address: formData.address,
      role: 'ROLE_ADMIN'
    };

    try {
      setChecking(true);
      await axios.post(process.env.REACT_APP_BACKEND_URL+'/signup', dataToSubmit);
      setModalMessage('Admin created successfully!');
      setShowModal(true);
    } catch (error) {
      console.error('Signup error:', error.response);
      setModalMessage('Creation failed. Please try again.');
      setShowModal(true);
    } finally {
      setChecking(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalMessage.includes('successfully')) {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="signup-container">
        <h1>Create Admin</h1>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Phone Number Field */}
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
            />
            {errors.phonenumber && <p className="error">{errors.phonenumber}</p>}
          </div>

          {/* Password Fields */}
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn submit-btn" disabled={checking}>
            {checking ? 'Checking...' : 'Create Admin'}
          </button>
        </form>
      </div>

      {/* Modal for success/error message */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p>{modalMessage}</p>
            <button onClick={closeModal} className="btn">OK</button>
          </div>
        </div>
      )}
    </>
  );
}

// Modal styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'center'
};

export default AddNewAdmin;
