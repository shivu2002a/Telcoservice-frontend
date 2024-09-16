import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styling_Components/SubscribeServices.css';

const SubscribedServices = () => {
    const [internetServices, setInternetServices] = useState([]);
    const [tvServices, setTvServices] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get('http://localhost:8082/checkLoggedInUser', { withCredentials: true });
                setUserId(response.data.userId);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Unable to fetch user details.');
            }
        };
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const fetchSubscribedServices = async () => {
            if (!userId) return;

            try {
                const response = await axios.get('http://localhost:8082/user/api/subscribed-services', {
                    params: { userId },
                    withCredentials: true
                });
                const { internetServicesAvailed, tvServicesAvailed } = response.data;

                setInternetServices(internetServicesAvailed || []);
                setTvServices(tvServicesAvailed || []);
                setError('');
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('Unable to fetch subscribed services.');
            }
        };
        if (userId) {
            fetchSubscribedServices();
        }
    }, [userId]);

    const handleModifyTv = (serviceName) => navigate(`/user/modify-tv-subscription?serviceName=${encodeURIComponent(serviceName)}`);
    const handleModifyInternet = (serviceName) => navigate(`/user/modify-internet-subscription?serviceName=${encodeURIComponent(serviceName)}`);

    const handleTerminateTvService = (service) => {
        navigate('/user/tv-feedback', {
            state: { service }
        });
    };

    const handleTerminateInternetService = (service) => {
        navigate('/user/internet-feedback', {
            state: { service }
        });
    };
    return (
        <div className="services-container">
            <h2>My Services</h2>
            {error && <p className="error-message">{error}</p>}
            {internetServices.length === 0 && tvServices.length === 0 ? (
                <p className="no-services">No services found.</p>
            ) : (
                <div className="services-grid">
                    {internetServices.length > 0 && (
                        <div className="service-section">
                            <h3>Internet Services</h3>
                            {internetServices.map(service => (
                                <div className="service-box" key={service.serviceId}>
                                    <div className="service-header">
                                        <h4>{service.internetService.serviceName}</h4>
                                        <button onClick={() => handleModifyInternet(service.internetService.serviceName)} className="btn modify-button">
                                            Modify
                                        </button>
                                    </div>
                                    <p><strong>Type:</strong> {service.internetService.serviceType}</p>
                                    <p><strong>Description:</strong> {service.internetService.description}</p>
                                    <p><strong>Benefits:</strong> {service.internetService.benefits}</p>
                                    <div className="speed-info">
                                        <p><span className="icon">⬇️</span> <strong>Download Speed:</strong> {service.internetService.serviceDownloadSpeed} Mbps</p>
                                        <p><span className="icon">⬆️</span> <strong>Upload Speed:</strong> {service.internetService.serviceUploadSpeed} Mbps</p>
                                    </div>
                                    <p><strong>Start Date:</strong> {new Date(service.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {service.endDate ? new Date(service.endDate).toLocaleDateString() : 'Ongoing'}</p>
                                    <p className="plan-cost">${service.internetService.cost}</p>
                                    <button
                                        className="btn terminate-button"
                                        onClick={() => handleTerminateInternetService(service)}
                                    >
                                        Terminate Internet Service
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {tvServices.length > 0 && (
                        <div className="service-section">
                            <h3>TV Services</h3>
                            {tvServices.map(service => (
                                <div className="service-box" key={service.serviceId}>
                                    <div className="service-header">
                                        <h4>{service.tvService.serviceName}</h4>
                                        <button onClick={() => handleModifyTv(service.tvService.serviceName)} className="btn modify-button">
                                            Modify
                                        </button>
                                    </div>
                                    <p><strong>Type:</strong> {service.tvService.serviceType}</p>
                                    <p><strong>Description:</strong> {service.tvService.description}</p>
                                    <p><strong>Benefits:</strong> {service.tvService.benefits}</p>
                                    <p><strong>Start Date:</strong> {new Date(service.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {service.endDate ? new Date(service.endDate).toLocaleDateString() : 'Ongoing'}</p>
                                    <p className="plan-cost">${service.tvService.cost}</p>
                                    <button
                                        className="btn terminate-button"
                                        onClick={() => handleTerminateTvService(service)}
                                    >
                                        Terminate TV Service
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubscribedServices;
