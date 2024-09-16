import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/PendingRequests.css';

function RequestsHistory() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

            // Fetch service details by serviceId based on serviceType and filter for inactive services (active: false)
            let serviceName, serviceCriteria, serviceActive, type;

            if (request.serviceType === "INTERNET_SERVICE") {
              const serviceResponse = await axios.get(`http://localhost:8082/api/internet-services/${request.serviceId}`, { withCredentials: true });
              serviceName = serviceResponse.data.serviceName;
              serviceCriteria = serviceResponse.data.criteria;
              type = serviceResponse.data.serviceType;
              serviceActive = serviceResponse.data.active; // Check if the service is active
            }

            if (request.serviceType === "TV_SERVICE") {
              const serviceResponse = await axios.get(`http://localhost:8082/api/tv-services/${request.serviceId}`, { withCredentials: true });
              serviceName = serviceResponse.data.serviceName;
              serviceCriteria = serviceResponse.data.criteria;
              type = serviceResponse.data.serviceType;
              serviceActive = serviceResponse.data.active; // Check if the service is active
            }
            // Return the request including the service details
            return {
              ...request,
              userName,
              serviceName,
              serviceCriteria,
              serviceActive,
              type
            };
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className='requets-history-table'>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Service Name</th>
              <th>User Name</th>
              <th>Service Type</th>
              <th>Service Availability</th>
              <th>Criteria</th>
              <th>Request Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Filter to only show requests with inactive services */}
            {pendingRequests
              .filter(request => !request.active) // Show only inactive services
              .map((request, index) => (
                <tr key={request.requestId}>
                  <td>{index + 1}</td>
                  <td>{request.serviceName + " (" + request.type + ")"}</td> {/* Show Service Name */}
                  <td>{request.userName}</td> {/* Show User Name */}
                  <td>{request.serviceType}</td>
                  {/* Conditional rendering for service availability */}
                  <td><b><span style={{ color: request.serviceActive ? 'green' : 'red' }}>
                    {request.serviceActive ? 'Available' : 'Unavailable'}
                  </span></b></td> 
                  <td>{request.serviceCriteria}</td>
                  <td>{request.requestStatus}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RequestsHistory;
