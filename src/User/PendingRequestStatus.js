import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingRequestStatus = () => {
    const [pendingReq , setPendingReq] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    //const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get('http://localhost:8082/checkLoggedInUser', { withCredentials: true });
                setUserId(response.data.userId);
            } catch (err) {
                setError('Unable to fetch user details.');
                console.error(err);
            }
        };
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        // fetchSubscribedServices  --  fetchPendingRequests
        const fetchPendingRequests = async () => {
            if (!userId) return;

            try {
                const response = await axios.get('http://localhost:8082/user/api/pending-request', {
                    params: { userId },
                    withCredentials: true
                });
                const pendingRequests = response.data;
                setPendingReq(pendingRequests || []);
                setError('');
            } catch (err) {
                setError('Unable to fetch Pending Request Status.');
                console.error(err);
            }
        };
        fetchPendingRequests();
    }, [userId]);

    
    //console.log(userId);
    return (
        <div className="service-container">
        <h2>Pending Requests</h2>
        {pendingReq.length === 0 ? (
            <p>No pending requests found.</p>
        ) : (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Remarks</th>
                        <th>Request Status</th>
                        <th>Service ID</th>
                        <th>Service Type</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingReq.map(request => (
                        <tr key={request.requestid}>
                            <td>{request.requestId}</td>
                            <td>{request.remarks || 'N/A'}</td>
                            <td>{request.requestStatus}</td>
                            <td>{request.serviceId}</td>
                            <td>{request.serviceType}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    );
};

export default PendingRequestStatus;