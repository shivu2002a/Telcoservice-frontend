import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/styles.css'; // Import your CSS file here
import { useLocation } from 'react-router-dom';

const ModifyTvSubscription = () => {
    const [filteredServices, setFilteredServices] = useState([]);
    const [userId, setUserId] = useState(null);
    const [currentService, setCurrentService] = useState(null);
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
                const availedResponse = await axios.get('http://localhost:8082/user/api/subscribed-services', {
                    params: { userId },
                    withCredentials: true,
                });

                const { tvServicesAvailed } = availedResponse.data;

                if (tvServicesAvailed.length > 0) {
                    const current = tvServicesAvailed.find(service => service.tvService.serviceName === selectedServiceName);
                    setCurrentService(current);

                    const filteredAvailedServices = tvServicesAvailed.filter(
                        (service) => service.tvService.serviceName === selectedServiceName
                    );

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

    const handleSubscribe = async (newService) => {
        if (!currentService) {
            setError('Current service not found.');
            return;
        }

        try {
            console.log('Terminating old service...');
            await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

            const apiUrl = `http://localhost:8082/user/api/tv-service`;
            const requestBody = {
                startDate: currentService.startDate,
                endDate: currentService.endDate || null, // or the actual end date
                oldServiceId: currentService.tvService.serviceId,
                newServiceId: newService.serviceId,
            };

            console.log('Subscribe - Request Body:', requestBody);

            const response = await axios.put(apiUrl, requestBody, { 
                headers: {
                    'Content-Type': 'application/json' 
                },
                withCredentials: true
            });

            console.log('Subscription Update Response:', response);

            if (response.status === 200 || response.status === 204) {
                window.alert('Subscription updated successfully!');
            } else {
                setError('Failed to update the subscription. Please try again.');
                console.error('Unexpected response status:', response.status);
            }
        } catch (err) {
            setError('Error updating subscription.');
            console.error('Error updating subscription:', {
                message: err.message,
                response: err.response ? err.response.data : null,
                status: err.response ? err.response.status : 'No status',
                headers: err.response ? err.response.headers : 'No headers',
            });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="services-container">
            <h2>Modify TV Subscription</h2>
            {filteredServices.length > 0 ? (
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
                                <p className="plan-cost"><strong>Monthly Cost:</strong> ${service.monthlyCost}</p>
                                <button className="subscribe-button" onClick={() => handleSubscribe(service)}>Modify Subscription</button>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <div>No services available for modification.</div>
            )}
        </div>
    );
};

export default ModifyTvSubscription;
