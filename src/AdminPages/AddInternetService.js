import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styling_Components/AddService.css';

function AddInternetService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDownloadSpeed: '',
    serviceUploadSpeed: '',
    benefits: '',
    criteria: '',
    cost: '',
    description: '',
    serviceType: 'BASIC',
    validity:'',
  });

  const [loading, setLoading] = useState(false);  // For loading state
  const [error, setError] = useState(null);       // For error handling

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
    setLoading(true);   // Start loading
    setError(null);     // Reset any previous errors

    try {
      // Call the API to add the service
      await axios.post('http://localhost:8082/admin/api/internet-service', formData, { withCredentials: true });

      alert("Service added successfully!!");
      navigate(`/admin/addInternetService`);

      // Reset form fields after submission
      setFormData({
        serviceName: '',
        serviceDownloadSpeed: '',
        serviceUploadSpeed: '',
        benefits: '',
        criteria: '',
        cost: '',
        description: '',
        serviceType: 'BASIC',
        validity:'',
      });
    } catch (err) {
      console.error(err);
      // Set error message for display
      setError('Failed to add service. Please try again.');
    } finally {
      setLoading(false);  // End loading
    }
  };

  return (
    <div className="internet-details-form">
      <h1>Create New Internet Service</h1>

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
          <label>Download Speed (Mbps):</label>
          <input
            type="text"
            name="serviceDownloadSpeed"
            value={formData.serviceDownloadSpeed}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Upload Speed (Mbps):</label>
          <input
            type="text"
            name="serviceUploadSpeed"
            value={formData.serviceUploadSpeed}
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
          <label>Validity:</label>Days
          <input
            type="text"
            name="validity"
            value={formData.validity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Cost:</label>Rs.
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
    </div>
  );
}

export default AddInternetService;
