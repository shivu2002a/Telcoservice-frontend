import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/Services.css'; 
import { useLocation, useNavigate } from 'react-router-dom';

const ModifyTVSubscription = () => {
    const [filteredServices, setFilteredServices] = useState([]);
    const [userId, setUserId] = useState(null);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [costDifference, setCostDifference] = useState(0);
    const [newServiceToSubscribe, setNewServiceToSubscribe] = useState(null);
    const [successDialog, setSuccessDialog] = useState(false); // New state for success dialog

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedServiceName = queryParams.get('serviceName');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_BACKEND_URL+'/checkLoggedInUser', { withCredentials: true });
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
                const availedResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+'/user/api/subscribed-services', {
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
                        const servicesResponse = await axios.get(process.env.REACT_APP_BACKEND_URL+'/user/api/tv-service/other', {
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

        // Calculate the cost difference
        const currentCost = currentService.tvService.cost || 0;
        const newCost = newService.cost || 0;
        const costDifference = newCost - currentCost;

        setCostDifference(costDifference);
        setNewServiceToSubscribe(newService);
        setConfirmDialog(true);
    };

    const handleConfirmSubscription = async () => {
        if (!currentService || !newServiceToSubscribe) {
            setError('Current service or new service not found.');
            setConfirmDialog(false);
            return;
        }

        try {
            console.log('Terminating old service...');
            await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

            const apiUrl = process.env.REACT_APP_BACKEND_URL+`/user/api/tv-service`;
            const requestBody = {
                startDate: currentService.startDate,
                endDate: currentService.endDate || null,
                oldServiceId: currentService.tvService.serviceId,
                newServiceId: newServiceToSubscribe.serviceId,
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
                setSuccessDialog(true); // Show success dialog
                setError(null);
                setConfirmDialog(false); // Close the confirmation dialog
                setTimeout(() => {
                    setSuccessDialog(false); // Auto-close success dialog after 3 seconds
                    navigate('/user/subscribed-services');
                }, 3000);
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
        } finally {
            setConfirmDialog(false);
        }
    };

    const dialogStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        padding: '20px',
        zIndex: 1000,
        width: '500px',
    };

    const successStyle = {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'green',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        width: '300px',
        textAlign: 'center',
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="services-container">
            <h2>Modify TV Subscription</h2>
            {successDialog && <div style={successStyle}>Subscription updated successfully!</div>} {/* Success message */}
            {filteredServices.length > 0 ? (
                <div className="services-grid">
                    {filteredServices.map((service) => (
                        service.active && (
                            <div className="service-box" key={service.serviceId}>
                                <h2>{service.serviceName}</h2>
                                <p><strong>Type:</strong> {service.serviceType}</p>
                                <p><strong>Description:</strong> {service.description}</p>
                                <p><strong>Benefits:</strong> {service.benefits}</p>
                                <p className="plan-cost">${service.cost}</p>
                                <button className="subscribe-button" onClick={() => handleSubscribe(service)}>Modify Subscription</button>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <div>No services available for modification.</div>
            )}

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div style={dialogStyle}>
                    <h3>Confirm Subscription Update</h3>
                    <p><strong>Current Service Cost:</strong> ${currentService.tvService.cost || 'N/A'}</p>
                    <p><strong>New Service Cost:</strong> ${newServiceToSubscribe.cost || 'N/A'}</p>
                    <p><strong>Cost Difference:</strong> ${Math.round(costDifference, 2)}</p>
                    <p>
                        {costDifference > 0 ? 
                            `You will need to pay an additional Rs.${Math.round(costDifference, 2)}. Are you okay with this?` :
                            `You will be refunded Rs.${Math.abs(Math.round(costDifference, 2))}.`
                        }
                    </p>
                    <button onClick={handleConfirmSubscription}>Confirm</button>
                    <button onClick={() => setConfirmDialog(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ModifyTVSubscription;
