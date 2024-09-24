import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styling_Components/AddService.css';

function AddTvService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    benefits: '',
    criteria: '',
    cost: '',
    description: '',
    serviceType: 'BASIC',
    validity: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the API to add the service
      await axios.post(process.env.REACT_APP_BACKEND_URL+'/admin/api/tv-service', formData, { withCredentials: true });

      setModalMessage("Service added successfully!");
      setShowModal(true);
      
      // Reset form fields after submission
      setFormData({
        serviceName: '',
        benefits: '',
        criteria: '',
        cost: '',
        description: '',
        serviceType: 'BASIC',
        validity: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate(`/admin/addTvService`);
  };

  return (
    <div className="internet-details-form">
      <h1>Create New TV Service</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Service Name:</label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Service Type:</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="BASIC">BASIC</option>
            <option value="STANDARD">STANDARD</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </div>

        <div>
          <label>Benefits:</label>
          <input
            type="text"
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Criteria:</label>
          <input
            type="text"
            name="criteria"
            value={formData.criteria}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Validity:</label> Days
          <input
            type="text"
            name="validity"
            value={formData.validity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Cost:</label> Rs.
          <input
            type="text"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn submit-btn" disabled={loading}>
          {loading ? 'Adding Service...' : 'Add Service'}
        </button>

        {error && <p className="error">{error}</p>} {/* Display error if any */}
      </form>

      {/* Modal for success message */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={closeModal} className="btn">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTvService;
