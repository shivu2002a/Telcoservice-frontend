import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styling_Components/RequestsValidation.css';  // Import the CSS

function RequestsValidation() {
  const addressString = "h.no:123, street:Main St, city:New York, state:NY, pincode:10001";

  function formatKeyValuePairs(str) {
    const keyValuePairs = str.split(', '); // Split by comma and space
    return keyValuePairs.map(pair => {
      const [key, value] = pair.split(': '); // Split by colon for key-value pair
      return (
        <p key={key}><strong>{key}:</strong> {value}</p>
      );
    });
  }

  const location = useLocation();
  const { user, service, request } = location.state; 
  const [remarks, setRemarks] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (status) => {
    console.log("Request ID:", request.requestId);  // Log the requestId for debugging
    console.log("Service ID:", service.serviceId);  // Log serviceId
    console.log("User ID:", request.userId);  // Log userId
    console.log("Request Status:", status);  // Log status
  
    if (!request.requestId || !service.serviceId || !request.userId) {
      alert("Missing necessary data. Please check request and service details.");
      return;
    }
  
    try {
      const response = await axios.patch('http://localhost:8082/admin/api/approval-requests', {
        requestId: request.requestId, 
        requestStatus: status,
        remarks: remarks,
        serviceId: service.serviceId,
        userId: request.userId,
        serviceType: request.serviceType
      }, { withCredentials: true });
  
      if (response.status >= 200 && response.status < 300) {
        alert(`Request ${status.toLowerCase()} successfully!`);
        navigate('/admin/requests');
      } else {
        alert('Unexpected response status. Failed to update the request.');
      }
    } catch (error) {
      if (error.response) {
        alert(`Failed to update the request: ${error.response.data.message || 'Server Error'}`);
      } else if (error.request) {
        alert('No response received from the server. Please try again.');
      } else {
        alert('Error setting up request.');
      }
    }
  };
  

  // Format the address
  const formattedAddress = formatKeyValuePairs(user.address||'');

  return (
    <div className="request-details-container">
      <h1>Validate Request</h1>
      
      <h2>Service Details</h2>
      <p><strong>Service Name:</strong> {service.serviceName}</p>
      <p>
        <strong>Service Availability:</strong> <b>
        <span style={{ color: service.active ? 'green' : 'red' }}>
        {service.active ? 'Available' : 'Unavailable'}
        </span>
        </b>
      </p>
      <p><strong>Service Type:</strong> {service.serviceType}</p>
      <p><strong>Criteria:<span style={{color:'red'}}>{service.criteria}</span></strong></p>

      {request.serviceType === 'INTERNET_SERVICE' && (
        <>
        <p><strong>Description:</strong> {service.description}</p>
        <p><strong>Download Speed(Mbps):</strong> {service.serviceDownloadSpeed} Mbps</p>
        <p><strong>Upload Speed(Mbps):</strong> {service.serviceUploadSpeed} Mbps</p>
        <p><strong>Validity:</strong> {service.validity} Days</p>
        <p><strong>Cost(Rs.):</strong> {service.cost}</p>
        </>
      )}
      {request.serviceType === "TV_SERVICE" && (
        <>
        <p><strong>Description:</strong> {service.description}</p>
        <p><strong>Validity:</strong> {service.validity} Days</p>
        <p><strong>Cost(Rs.):</strong> {service.cost}</p>
        </>
      )}

      <h2>User Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone number:</strong> {user.phonenumber}</p>
      <p><strong>Address</strong></p>
      <div className="address-container">
        
        <div>{formattedAddress}</div>
      </div>
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
  disabled={remarks.trim() === ''}
>
  Disapprove
</button>
      </div>
    </div>
  );
}

export default RequestsValidation;
