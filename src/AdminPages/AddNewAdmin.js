import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AddNewAdmin() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    address: 'admin'  // Default value for address
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [checking, setChecking] = useState(false);

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

    // Prepare the data to be sent to the backend
    const dataToSubmit = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phonenumber: formData.phonenumber,
      address: formData.address,  // Include address in the request
      role: 'ROLE_ADMIN'  // Set role to ROLE_ADMIN
    };

    try {
      setChecking(true);
      const response = await axios.post('http://localhost:8082/signup', dataToSubmit);
      console.log(dataToSubmit);
      console.log(response);
      alert('Admin created successfully! Please login.');
      navigate('/login');  // Redirect to login page after successful creation
    } catch (error) {
      console.error('Signup error:', error.response);
      alert('Creation failed. Please try again.');
    } finally {
      setChecking(false);
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
    </>
  );
}

export default AddNewAdmin;
