import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/PendingRequests.css';
import { useNavigate } from 'react-router-dom';

function PendingRequests() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch pending requests and get user and service details
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8082/admin/api/approval-requests', { withCredentials: true });
        const requests = response.data;

        // Fetch user and service names for each request
        const updatedRequests = await Promise.all(
          requests.map(async (request) => {
            // Fetch user details by userId
            const userResponse = await axios.get(`http://localhost:8082/userdetails?userId=${request.userId}`, { withCredentials: true });
            const userName = userResponse.data.username; // Assuming 'username' is the field

            // Fetch service details by serviceId
            if(request.serviceType==="INTERNET_SERVICE")
            {
            const serviceResponse = await axios.get(`http://localhost:8082/api/internet-services/${request.serviceId}`, { withCredentials: true });
            const serviceName = serviceResponse.data.serviceName; // Assuming 'serviceName' is the field
            const serviceCriteria=serviceResponse.data.criteria;
            return {
              ...request,
              userName,
              serviceName,
              serviceCriteria
            };
            }
            if(request.serviceType==="TV_SERVICE")
            {
            const serviceResponse = await axios.get(`http://localhost:8082/api/tv-services/${request.serviceId}`, { withCredentials: true });
            const serviceName = serviceResponse.data.serviceName; // Assuming 'serviceName' is the field
            const serviceCriteria=serviceResponse.data.criteria;
            
            
            // Return the updated request with user and service names
            return {
              ...request,
              userName,
              serviceName,
              serviceCriteria
            };
          }
          })
        );

        setPendingRequests(updatedRequests);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("There was an error fetching the pending requests or details!", error);
        setError(error.message);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchPendingRequests();
  }, []);

  const handleNavigateToValidation = async (request) => {
    // Fetch the user and service details for the selected request
    const userResponse = await axios.get(`http://localhost:8082/userdetails?userId=${request.userId}`, { withCredentials: true });
    const user = userResponse.data;
    if(request.serviceType==="INTERNET_SERVICE")
    {
    const serviceResponse = await axios.get(`http://localhost:8082/api/internet-services/${request.serviceId}`, { withCredentials: true });
    const service = serviceResponse.data;
    navigate('/admin/validation', { state: { user, service, request } });
    }
    else{
      const serviceResponse = await axios.get(`http://localhost:8082/api/tv-services/${request.serviceId}`, { withCredentials: true });
      const service = serviceResponse.data;
      navigate('/admin/validation', { state: { user, service, request } });
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Pending Requests</h1>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Service Name</th>
            <th>User Name</th>
            <th>Service Type</th>
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
                <td>{request.serviceName}</td> {/* Show Service Name */}
                <td>{request.userName}</td> {/* Show User Name */}
                <td>{request.serviceType}</td>
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
    </>
  );
}

export default PendingRequests;
