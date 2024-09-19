import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingRequestStatus = () => {
    const [pendingReq, setPendingReq] = useState([]);
    const [internetServiceDetails, setInternetServiceDetails] = useState({});
    const [tvServiceDetails, setTvServiceDetails] = useState({});
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

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

                const fetchServiceDetails = async (requests) => {
                    const internetServiceIds = [...new Set(requests.filter(req => req.serviceType === 'INTERNET_SERVICE').map(req => req.serviceId))];
                    const tvServiceIds = [...new Set(requests.filter(req => req.serviceType === 'TV_SERVICE').map(req => req.serviceId))];
                    
                    const fetchInternetDetails = async () => {
                        const detailsPromises = internetServiceIds.map(serviceId => 
                            axios.get(`http://localhost:8082/api/internet-services/${serviceId}`, { withCredentials: true })
                        );
                        const responses = await Promise.all(detailsPromises);
                        const details = responses.reduce((acc, response) => {
                            acc[response.data.serviceId] = response.data;
                            return acc;
                        }, {});
                        setInternetServiceDetails(details);
                    };

                    const fetchTvDetails = async () => {
                        const detailsPromises = tvServiceIds.map(serviceId => 
                            axios.get(`http://localhost:8082/api/tv-services/${serviceId}`, { withCredentials: true })
                        );
                        const responses = await Promise.all(detailsPromises);
                        const details = responses.reduce((acc, response) => {
                            acc[response.data.serviceId] = response.data;
                            return acc;
                        }, {});
                        setTvServiceDetails(details);
                    };

                    await Promise.all([fetchInternetDetails(), fetchTvDetails()]);
                };
                fetchServiceDetails(pendingRequests);

            } catch (err) {
                setError('Unable to fetch Pending Request Status.');
                console.error(err);
            }
        };
        fetchPendingRequests();
    }, [userId]);

    const requestedRequests = pendingReq.filter(request => request.requestStatus === 'REQUESTED');
    const pastRequests = pendingReq.filter(request => request.requestStatus !== 'REQUESTED');

    const getBenefitsString = (benefits) => {
        return Array.isArray(benefits) ? benefits.join(', ') : 'No benefits available';
    };

    return (
        <div className="service-container">
            <h2>Service Requests</h2>

            <h3>Active Requests </h3>
            {requestedRequests.length === 0 ? (
                <p>No requested requests found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Service Name</th>
                            <th>Benefits</th>
                            <th>Description</th>
                            <th>Request Status</th>
                            <th>Service Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestedRequests.map((request, index) => {
                            const serviceDetails = request.serviceType === 'INTERNET_SERVICE'
                                ? internetServiceDetails[request.serviceId]
                                : tvServiceDetails[request.serviceId];

                            return (
                                <tr key={request.requestId}>
                                    <td>{index + 1}</td>
                                    <td>{serviceDetails ? serviceDetails.serviceName : 'Loading...'}</td>
                                    <td>{serviceDetails ? getBenefitsString(serviceDetails.benefits) : 'Loading...'}</td>
                                    <td>{serviceDetails ? serviceDetails.description : 'Loading...'}</td>
                                    <td>{request.requestStatus}</td>
                                    <td>{request.serviceType}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <h3>Past Requests</h3>
            {pastRequests.length === 0 ? (
                <p>No past requests found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Service Name</th>
                            <th>Benefits</th>
                            <th>Description</th>
                            <th>Request Status</th>
                            <th>Remarks</th>
                            <th>Service Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastRequests.map((request, index) => {
                            const serviceDetails = request.serviceType === 'INTERNET_SERVICE'
                                ? internetServiceDetails[request.serviceId]
                                : tvServiceDetails[request.serviceId];

                            return (
                                <tr key={request.requestId}>
                                    <td>{index + 1}</td>
                                    <td>{serviceDetails ? serviceDetails.serviceName : 'Loading...'}</td>
                                    <td>{serviceDetails ? getBenefitsString(serviceDetails.benefits) : 'Loading...'}</td>
                                    <td>{serviceDetails ? serviceDetails.description : 'Loading...'}</td>
                                    <td>{request.requestStatus}</td>
                                    <td>{request.remarks}</td>
                                    <td>{request.serviceType}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendingRequestStatus;
