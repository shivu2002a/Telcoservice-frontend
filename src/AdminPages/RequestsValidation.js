import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styling_Components/RequestsValidation.css';  // Import the CSS

function RequestsValidation() {
  const location = useLocation();
  const { user, service, request } = location.state; 
  const [remarks, setRemarks] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (status) => {
    try {
      await axios.patch(`http://localhost:8082/admin/api/approval-requests`, {
        requestId: request.requestId, // Include requestId for identifying the request
        requestStatus: status,
        remarks: remarks
      }, { withCredentials: true });
      alert(`Request ${status.toLowerCase()} successfully!`);
      navigate('/'); 
    } catch (error) {
      console.error('Error updating request:', error.response ? error.response.data : error.message);
      alert('Failed to update the request.');
    }
  };
  return (
    <div className="request-details-container">
      <h1>Validate Request</h1>
      
      <h2>Service Details</h2>
      <p><strong>Service Name:</strong> {service.serviceName}</p>
      <p><strong>Service Type:</strong> {service.serviceType}</p>
      <p><strong>Criteria:</strong> {service.criteria}</p>
      {request.serviceType === 'INTERNET_SERVICE' && (
        <>
        <p><strong>Description:</strong> {service.description}</p>
        <p><strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps</p>
        <p><strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps</p>
        <p><strong>Monthly Cost:</strong> ${service.monthlyCost}</p>
        </>
        )
    }
    {request.serviceType === "TV_SERVICE" &&(
        <>
        <p><strong>Description:</strong> {service.description}</p>
        <p><strong>Monthly Cost:</strong>${service.monthlyCost}</p>
        </>
    )}
      <h2>User Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>Validate Request </h2>
      <p><strong>Status:</strong> {request.requestStatus}</p>

      <div>
        <label htmlFor="remarks">Remarks: </label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add remarks here..."
          rows="4"
        />
      </div>

      <div>
        <button 
          className="approve-btn"
          onClick={() => handleSubmit('APPROVED')}
        >
          Approve
        </button>
        <button 
          className="disapprove-btn"
          onClick={() => handleSubmit('DISAPPROVED')}
        >
          Disapprove
        </button>
      </div>
    </div>
  );
}

export default RequestsValidation;
