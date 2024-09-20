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

    const currentDate = new Date();

    const filterActiveAndFutureServices = (services) => {
        return services
            .filter(service => !service.endDate || new Date(service.endDate) >= currentDate)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));  // Sort by start date in ascending order
    };

    const filterPastServices = (services) => {
        return services
            .filter(service => service.endDate && new Date(service.endDate) < currentDate)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));  // Sort by start date in ascending order
    };

    const activeInternetServices = filterActiveAndFutureServices(internetServices);
    const pastInternetServices = filterPastServices(internetServices);
    const activeTvServices = filterActiveAndFutureServices(tvServices);
    const pastTvServices = filterPastServices(tvServices);

    return (
        <div className="services-container">
            <h2>My Services</h2>
            {error && <p className="error-message">{error}</p>}
            {activeInternetServices.length === 0 && activeTvServices.length === 0 && pastInternetServices.length === 0 && pastTvServices.length === 0 ? (
                <p className="no-services">No services found.</p>
            ) : (
                <div className="services-grid-subscribed">
                    {/* Active Services */}
                    {(activeInternetServices.length > 0 || activeTvServices.length > 0) && (
                        <div className="active-services">
                            <h3>Active Services</h3>

                            {activeInternetServices.length > 0 && (
                                <>
                                    <h4>Internet Services</h4>
                                    <div className="active-internet-service-section">
                                        {activeInternetServices.map(service => (
                                            <div className="service-box" key={service.serviceId}>
                                                <div className="service-header">
                                                    <h3>{service.internetService.serviceName}</h3>
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
                                                {new Date(service.startDate) > currentDate && (
                                                    <p className="future-service-message">
                                                        This service will activate after your current service ends on {new Date(service.startDate).toLocaleDateString()}.
                                                    </p>
                                                )}
                                                <p className="plan-cost">${service.internetService.cost}</p>
                                                <div className='buttons'>
                                                    <button onClick={() => handleModifyInternet(service.internetService.serviceName)} className="btn modify-button">
                                                        Modify Service
                                                    </button>
                                                    <button
                                                        className="btn terminate-button"
                                                        onClick={() => handleTerminateInternetService(service)}
                                                    >
                                                        Terminate Service
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {activeTvServices.length > 0 && (
                                <>
                                    <h4>TV Services</h4>
                                    <div className="active-tv-service-section">
                                        {activeTvServices.map(service => (
                                            <div className="service-box" key={service.serviceId}>
                                                <div className="service-header">
                                                    <h3>{service.tvService.serviceName}</h3>
                                                </div>
                                                <p><strong>Type:</strong> {service.tvService.serviceType}</p>
                                                <p><strong>Description:</strong> {service.tvService.description}</p>
                                                <p><strong>Benefits:</strong> {service.tvService.benefits}</p>
                                                <p><strong>Start Date:</strong> {new Date(service.startDate).toLocaleDateString()}</p>
                                                <p><strong>End Date:</strong> {service.endDate ? new Date(service.endDate).toLocaleDateString() : 'Ongoing'}</p>
                                                {new Date(service.startDate) > currentDate && (
                                                    <p className="future-service-message">
                                                        This service will activate after your current service ends on {new Date(service.startDate).toLocaleDateString()}.
                                                    </p>
                                                )}
                                                <p className="plan-cost">${service.tvService.cost}</p>
                                                <div className='buttons'>
                                                    <button onClick={() => handleModifyTv(service.tvService.serviceName)} className="btn modify-button">
                                                        Modify Service
                                                    </button>
                                                    <button
                                                        className="btn terminate-button"
                                                        onClick={() => handleTerminateTvService(service)}
                                                    >
                                                        Terminate Service
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Past Services */}
                    {(pastInternetServices.length > 0 || pastTvServices.length > 0) && (
                        <div className="past-services">
                            <h3>Past Services</h3>
                            {pastInternetServices.length > 0 && (
                                <div className="past-internet-service-section">
                                    <h4>Internet Services</h4>
                                    {pastInternetServices.map(service => (
                                        <div className="service-box inactive" key={service.serviceId}>
                                            <div className="service-header">
                                                <h3>{service.internetService.serviceName}</h3>
                                            </div>
                                            <p><strong>Type:</strong> {service.internetService.serviceType}</p>
                                            <p><strong>Description:</strong> {service.internetService.description}</p>
                                            <p><strong>Start Date:</strong> {new Date(service.startDate).toLocaleDateString()}</p>
                                            <p><strong>End Date:</strong> {new Date(service.endDate).toLocaleDateString()}</p>
                                            <p className="plan-cost">${service.internetService.cost}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {pastTvServices.length > 0 && (
                                <div className="past-tv-service-section">
                                    <h4>TV Services</h4>
                                    {pastTvServices.map(service => (
                                        <div className="service-box inactive" key={service.serviceId}>
                                            <div className="service-header">
                                                <h3>{service.tvService.serviceName}</h3>
                                            </div>
                                            <p><strong>Type:</strong> {service.tvService.serviceType}</p>
                                            <p><strong>Description:</strong> {service.tvService.description}</p>
                                            <p><strong>Start Date:</strong> {new Date(service.startDate).toLocaleDateString()}</p>
                                            <p><strong>End Date:</strong> {new Date(service.endDate).toLocaleDateString()}</p>
                                            <p className="plan-cost">${service.tvService.cost}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubscribedServices;
