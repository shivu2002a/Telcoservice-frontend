import React, { useState } from 'react';
import axios from 'axios';
import './Styling_Components/SignUp.css'; // Optional: for styling
import { useNavigate, Link, Outlet } from 'react-router-dom';
import TelstraLogo from '../Images/Telstra.jfif';
import BackgroundImage from '../Images/Background.jpg';

function SignUp() {
  const backgroundStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100%', // Ensure the background covers the full viewport height
    width: '100vw',  // Ensure the background covers the full viewport width
};
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    hno: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

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
  
    if (!formData.hno || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      errors.address = 'Complete address is required';
    }
  
    return errors;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Concatenate the address fields
    const address = `H.No: ${formData.hno}, Street: ${formData.street}, City: ${formData.city}, State: ${formData.state}, Pincode: ${formData.pincode}`;

    // Prepare the data to be sent to the backend
    const dataToSubmit = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phonenumber: formData.phonenumber,
      address: address
    };

    try {
      const response = await axios.post('http://localhost:8082/signup', dataToSubmit);
      alert('Signup successful and Please login in!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error.response);
      alert('Signup failed. Please try again.');
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
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Create an account</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
      <div className="signup-container">
        <h1>Sign Up</h1>
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

          {/* Address Fields */}
          <div className="form-group">
            <label>House Number:</label>
            <input
              type="text"
              name="hno"
              value={formData.hno}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Street:</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
          {errors.address && <p className="error">{errors.address}</p>}

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

          <button type="submit" className="btn submit-btn">Sign Up</button>
          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
      </div>
    </>
  );
}

export default SignUp;
