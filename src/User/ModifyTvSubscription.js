import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/styles.css'; // Import your CSS file here
import { useLocation } from 'react-router-dom';

const ModifyTvSubscription = () => {
    const [filteredServices, setFilteredServices] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedServiceName = queryParams.get('serviceName');

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get('http://localhost:8082/checkLoggedInUser', { withCredentials: true });
                setUserId(response.data.userId);
            } catch (err) {
                setError('Unable to fetch user details.');
                console.error('Error fetching user details:', err);
            }
        };
        fetchLoggedInUser();
    }, []);

    useEffect(() => {
        const fetchFilteredServices = async () => {
            if (!userId || !selectedServiceName) return;

            setLoading(true);
            setError(null);

            try {
                // Fetch availed TV services
                const availedResponse = await axios.get('http://localhost:8082/user/api/subscribed-services', {
                    params: { userId },
                    withCredentials: true,
                });

                const { tvServicesAvailed } = availedResponse.data;

                if (tvServicesAvailed.length > 0) {
                    // Filter availed services based on selectedServiceName
                    const filteredAvailedServices = tvServicesAvailed.filter(
                        (service) => service.tvService.serviceName === selectedServiceName
                    );

                    // Fetch filtered TV services
                    const servicePromises = filteredAvailedServices.map(async (service) => {
                        const servicesResponse = await axios.get('http://localhost:8082/user/api/tv-service/other', {
                            params: {
                                serviceName: service.tvService.serviceName,
                                serviceType: service.tvService.serviceType,
                            },
                            withCredentials: true,
                        });

                        return servicesResponse.data;
                    });

                    // Resolve all promises and flatten the results
                    const allFilteredServices = (await Promise.all(servicePromises)).flat();
                    setFilteredServices(allFilteredServices);
                } else {
                    setError('No availed TV services found.');
                }
            } catch (err) {
                setError(`Failed to fetch services. Please try again later. Error: ${err.message}`);
                console.error('Error fetching filtered services:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredServices();
    }, [userId, selectedServiceName]);

    const handleSubscribe = async (serviceId) => {
        try {
            const apiUrl = `http://localhost:8082/api/tv-services/subscribe`;

            await axios.post(
                apiUrl,
                null,
                {
                    params: { serviceId },
                    withCredentials: true,
                }
            );

            window.alert('Request sent to admin successfully!');
        } catch (err) {
            setError('Error sending request to admin.');
            console.error('Error details:', err);
        }
    };

    return (
        <div className="services-container">
            <h2>Modify TV Subscription</h2>
            {error && <div className="alert alert-error">{error}</div>}
            {loading ? (
                <p>Loading...</p>
            ) : filteredServices.length > 0 ? (
                <div className="services-grid">
                    {filteredServices.map((service) => (
                        service.active && (
                            <div className="service-box" key={service.serviceId}>
                                <h2>{service.serviceName}</h2>
                                <p><strong>Type:</strong> {service.serviceType}</p>
                                <p><strong>Description:</strong> {service.description}</p>
                                <p><strong>Benefits:</strong> {service.benefits}</p>
                                <div className="speed-info">
                                    <p><span className="icon">⬇️</span> <strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps</p>
                                    <p><span className="icon">⬆️</span> <strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps</p>
                                </div>
                                <p className="plan-cost"><strong>Cost:</strong> ${service.monthlyCost}/month</p>
                                <button className="subscribe-button" onClick={() => handleSubscribe(service.serviceId)}>
                                    Subscribe
                                </button>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                !loading && <p>No available services found.</p>
            )}
        </div>
    );
};

export default ModifyTvSubscription;
