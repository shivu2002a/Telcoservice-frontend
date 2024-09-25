import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/PendingRequests.css';
import { useNavigate } from 'react-router-dom';

function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACKEND_URL+`/userdetails?userId=${userId}`, { withCredentials: true });
      return response.data || 'Unknown User';  // Provide a fallback value
    } catch (error) {
      console.error(`Error fetching user details for userId: ${userId}`, error);
      return 'Unknown User';  // Fallback in case of an error
    }
  };

  const fetchServiceDetails = async (serviceId, serviceType) => {
    try {
      const endpoint = serviceType === 'INTERNET_SERVICE'
        ? process.env.REACT_APP_BACKEND_URL+`/api/internet-services/${serviceId}`
        : process.env.REACT_APP_BACKEND_URL+`/api/tv-services/${serviceId}`;
      const response = await axios.get(endpoint, { withCredentials: true });
      const serviceData = response.data;
      return {
        serviceId,
        serviceName: serviceData.serviceName || 'Unknown Service',
        criteria: serviceData.criteria || 'No Criteria',
        active: serviceData.active || false,
        serviceType: serviceData.serviceType || 'Unknown Type',
        cost:serviceData.cost,
        description:serviceData.description,
        validity:serviceData.validity,
      };
    } catch (error) {
      console.error(`Error fetching service details for serviceId: ${serviceId}`, error);
      return {
        serviceName: 'Unknown Service',
        criteria: 'No Criteria',
        active: false,
        serviceType: 'Unknown Type'
      };  // Fallback in case of an error
    }
  };

  // Fetch pending requests and populate user and service details
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL+'/admin/api/approval-requests', { withCredentials: true });
        const requests = response.data;

        const updatedRequests = await Promise.all(
          requests.map(async (request) => {
            try {
              const user= await fetchUserDetails(request.userId);
              const serviceData = await fetchServiceDetails(request.serviceId, request.serviceType);
              return {
                ...request,
                userName:user.username,
                serviceName: serviceData.serviceName,
                serviceCriteria: serviceData.criteria,
                serviceActive: serviceData.active,
                type: serviceData.serviceType,
              };
            } catch (error) {
              console.error('Error updating request:', error);
              return null;
            }
          })
        );

        setPendingRequests(updatedRequests.filter(Boolean)); // Filter out any null (failed) requests
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the pending requests or details!", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleNavigateToValidation = async (request) => {
    try {
      const user = await fetchUserDetails(request.userId);
      const service = await fetchServiceDetails(request.serviceId, request.serviceType);
      console.log(service);
      console.log(`vfrom test ${user}`);
      // Provide fallback values if service or user data is missing
      navigate('/admin/validation', { 
        state: { 
          user: user || 'Unknown User', 
          service: { 
            ...service, 
            serviceName: service.serviceName || 'Unknown Service', 
            criteria: service.criteria || '' // Ensure this is at least an empty string
          }, 
          request 
        } 
      });
    } catch (error) {
      console.error('Error navigating to validation:', error);
    }
  };  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='pending-requests'>
      <h1>Pending Requests</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Service Name</th>
            <th>User Name</th>
            <th>Service Type</th>
            <th>Service Availability</th>
            <th>Criteria</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests
            .filter(request => request.requestStatus === 'REQUESTED') // Only show REQUESTED status
            .map((request, index) => (
              <tr key={request.requestId}>
                <td>{index + 1}</td>
                <td>{`${request.serviceName} (${request.type})`}</td> {/* Show Service Name */} 
                <td>{request.userName}</td> {/* Show User Name */}
                <td>{request.serviceType}</td>
                <td>
                  <b>
                    <span style={{ color: request.serviceActive ? 'green' : 'red' }}>
                      {request.serviceActive ? 'Available' : 'Unavailable'}
                    </span>
                  </b>
                </td>
                <td>{request.serviceCriteria}</td>
                <td>
                  <button onClick={() => handleNavigateToValidation(request)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingRequests;
