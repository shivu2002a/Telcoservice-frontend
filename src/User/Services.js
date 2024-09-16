import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/Services.css';

function Services() {
    const [internetServices, setInternetServices] = useState([]);
    const [tvServices, setTvServices] = useState([]);
    const [subscribedInternetServices, setSubscribedInternetServices] = useState([]);
    const [subscribedTvServices, setSubscribedTvServices] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const [internetResponse, tvResponse] = await Promise.all([
                    axios.get('http://localhost:8082/api/internet-services/', { withCredentials: true }),
                    axios.get('http://localhost:8082/api/tv-services/', { withCredentials: true }),
                ]);

                setInternetServices(internetResponse.data);
                setTvServices(tvResponse.data);
            } catch (err) {
                setError('Error fetching services.');
                console.error('Error fetching services:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const fetchSubscribedServices = async () => {
            try {
                const response = await axios.get('http://localhost:8082/user/api/subscribed-services', { withCredentials: true });
                const { internetServicesAvailed, tvServicesAvailed } = response.data;

                setSubscribedInternetServices(internetServicesAvailed || []);
                setSubscribedTvServices(tvServicesAvailed || []);
                setError('');
            } catch (err) {
                setError('Unable to fetch subscribed services.');
                console.error(err);
            }
        };

        fetchSubscribedServices();
    }, []);

    // Load user requested services from local storage
    const getRequestedServices = () => {
        const storedServices = localStorage.getItem('requestedServices');
        return storedServices ? JSON.parse(storedServices) : [];
    };

    // Update local storage with the newly requested service
    const updateRequestedServices = (serviceName, serviceType) => {
        const requestedServices = getRequestedServices();
        requestedServices.push({ name: serviceName, type: serviceType });
        localStorage.setItem('requestedServices', JSON.stringify(requestedServices));
    };

    // Check if the user is already subscribed to the service
    const isUserSubscribed = (serviceId, isInternetService) => {
        const subscribedList = isInternetService ? subscribedInternetServices : subscribedTvServices;
        return subscribedList.some(service => service.serviceId === serviceId && service.active);
    };

    // Check if the user has already requested a service with the same name
    const isServiceRequested = (serviceName) => {
        const requestedServices = getRequestedServices();
        return requestedServices.some(service => service.name === serviceName);
    };

    // Check if the user has any service with the same name (irrespective of type)
    const hasSameNameService = (serviceName, isInternetService) => {
        const subscribedList = isInternetService ? subscribedInternetServices : subscribedTvServices;
        return subscribedList.some(service => service.internetService?.serviceName?.toLowerCase() === serviceName.toLowerCase() ||
                                             service.tvService?.serviceName?.toLowerCase() === serviceName.toLowerCase());
    };

    // Handle subscription request
    const handleSubscribe = async (serviceId, serviceName, serviceType, isInternetService) => {
        // Check if the user is already subscribed to this service
        if (isUserSubscribed(serviceId, isInternetService)) {
            window.alert('You are already subscribed to this service.');
            return;
        }

        // Check if the user has already requested this service
        if (isServiceRequested(serviceName)) {
            window.alert('You have already requested a service with this name.');
            return;
        }

        // Check if the user has any service with the same name (irrespective of type)
        if (hasSameNameService(serviceName, isInternetService)) {
            window.alert('You already have a service with this name, if you want to avail then modify the current service');
            return;
        }

        const apiUrl = isInternetService
            ? 'http://localhost:8082/user/api/internet-service'
            : 'http://localhost:8082/user/api/tv-service';

        try {
            await axios.post(
                apiUrl,
                null,
                {
                    params: { serviceId },
                    withCredentials: true,
                }
            );

            // Update local storage after successful request
            updateRequestedServices(serviceName, serviceType);

            window.alert('Request sent to admin successfully!');
        } catch (err) {
            window.alert('Error sending request to admin.');
            console.error('Error details:', err);
        }
    };

    // Handle logout and clear local storage
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login'; // Redirect to login page or wherever appropriate
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Internet Services</h1>
            <div className="services-grid">
                {internetServices.length === 0 ? (
                    <p>No internet services available.</p>
                ) : (
                    internetServices.map(service => (
                        service.active && (
                            <div className="service-box" key={service.serviceId}>
                                <h2>{service.serviceName}</h2>
                                <p><strong>Type:</strong> {service.serviceType}</p>
                                <p><strong>Description:</strong> {service.description}</p>
                                <p><strong>Benefits:</strong> {service.benefits}</p>
                                

                                {service.serviceDownloadSpeed && (
                                    <div className="speed-info">
                                        <p>
                                            <span className="icon">⬇️</span>
                                            <strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps
                                        </p>
                                        <p>
                                            <span className="icon">⬆️</span>
                                            <strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps
                                        </p>
                                    </div>
                                )}

                                <p className="plan-cost">${service.cost}</p>

                                <button
                                    className="subscribe-btn"
                                    onClick={() => handleSubscribe(service.serviceId, service.serviceName, service.serviceType, true)}
                                    disabled={isUserSubscribed(service.serviceId, true)}
                                >
                                    {isUserSubscribed(service.serviceId, true) ? 'Subscribed' : 'Subscribe'}
                                </button>
                            </div>
                        )
                    ))
                )}
            </div>

            <hr />

            <h1>TV Services</h1>
            <div className="services-grid">
                {tvServices.length === 0 ? (
                    <p>No TV services available.</p>
                ) : (
                    tvServices.map(service => (
                        service.active && (
                            <div className="service-box" key={service.serviceId}>
                                <h2>{service.serviceName}</h2>
                                <p><strong>Type:</strong> {service.serviceType}</p>
                                <p><strong>Description:</strong> {service.description}</p>
                                <p><strong>Benefits:</strong> {service.benefits}</p>

                                

                                {service.serviceDownloadSpeed && (
                                    <div className="speed-info">
                                        <p>
                                            <span className="icon">⬇️</span>
                                            <strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps
                                        </p>
                                        <p>
                                            <span className="icon">⬆️</span>
                                            <strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps
                                        </p>
                                    </div>
                                )}


                                <p className="plan-cost">${service.cost}</p>

                                <button
                                    className="subscribe-btn"
                                    onClick={() => handleSubscribe(service.serviceId, service.serviceName, service.serviceType, false)}
                                    disabled={isUserSubscribed(service.serviceId, false)}
                                >
                                    {isUserSubscribed(service.serviceId, false) ? 'Subscribed' : 'Subscribe'}
                                </button>
                            </div>
                        )
                    ))
                )}
            </div>
        </div>
    );
}

export default Services;
