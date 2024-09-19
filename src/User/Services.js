import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import './Styling_Components/Services.css';
import { useNavigate } from 'react-router-dom';

function Services() {
    const [internetServices, setInternetServices] = useState([]);
    const [tvServices, setTvServices] = useState([]);
    const [subscribedInternetServices, setSubscribedInternetServices] = useState([]);
    const [subscribedTvServices, setSubscribedTvServices] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // Fetch services data
    const fetchServices = useCallback(async () => {
        try {
            console.log('Fetching services...');
            const [internetResponse, tvResponse] = await Promise.all([
                axios.get('http://localhost:8082/api/internet-services/', { withCredentials: true }),
                axios.get('http://localhost:8082/api/tv-services/', { withCredentials: true }),
            ]);

            setInternetServices(internetResponse.data || []);
            setTvServices(tvResponse.data || []);
        } catch (err) {
            setError('Error fetching services.');
            console.error('Error fetching services:', err);
        }
    }, []);

    // Fetch subscribed services
    const fetchSubscribedServices = useCallback(async () => {
        try {
            console.log('Fetching subscribed services...');
            const response = await axios.get('http://localhost:8082/user/api/subscribed-services', { withCredentials: true });
            const { internetServicesAvailed, tvServicesAvailed } = response.data;

            setSubscribedInternetServices(internetServicesAvailed || []);
            setSubscribedTvServices(tvServicesAvailed || []);
        } catch (err) {
            setError('Unable to fetch subscribed services.');
            console.error('Error fetching subscribed services:', err);
        }
    }, []);

    // Fetch pending requests
    const fetchPendingRequests = useCallback(async () => {
        try {
            console.log('Fetching pending requests...');
            const response = await axios.get('http://localhost:8082/user/api/pending-request', { withCredentials: true });
            console.log('Pending requests data:', response.data);

            setPendingRequests(response.data || []);
        } catch (err) {
            setError('Unable to fetch pending requests.');
            console.error('Error fetching pending requests:', err);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchServices(), fetchSubscribedServices(), fetchPendingRequests()]);
            setLoading(false);
        };
        fetchData();
    }, [fetchServices, fetchSubscribedServices, fetchPendingRequests]);

    const isUserSubscribed = (serviceId, isInternetService) => {
        const subscribedList = isInternetService ? subscribedInternetServices : subscribedTvServices;
        return subscribedList.some(service => service.serviceId === serviceId && service.active);
    };

    const isServiceRequested = (serviceName) => {
        return pendingRequests.some(request => request.name === serviceName);
    };

    const countSubscribedServices = (isInternetService) => {
        const subscribedList = isInternetService ? subscribedInternetServices : subscribedTvServices;
        return subscribedList.length;
    };

    const countRequestedServices = (isInternetService) => {
        const serviceTypeKey = isInternetService ? 'INTERNET_SERVICE' : 'TV_SERVICE';

        const requestedCount = pendingRequests.filter(request => 
            request.serviceType === serviceTypeKey && request.requestStatus === 'REQUESTED'
        ).length;

        console.log(`Requested count for ${isInternetService ? 'Internet' : 'TV'} services: ${requestedCount}`);
        return requestedCount;
    };

    const handleSubscribe = async (serviceId, serviceName, serviceType, isInternetService) => {
        const apiUrl = isInternetService
            ? 'http://localhost:8082/user/api/internet-service'
            : 'http://localhost:8082/user/api/tv-service';

        try {
            console.log('Sending request to subscribe to:', apiUrl);
            await axios.post(apiUrl, null, {
                params: { serviceId },
                withCredentials: true,
            });
            console.log('Request sent successfully for:', serviceId);

            navigate('/user/pending-requests'); // Navigate first
            window.alert('Request sent successfully! Redirecting to pending requests...');
        } catch (err) {
            window.alert('Error sending request.');
            console.error('Error sending request:', err);
        }
    };

    const handleButtonClick = async (serviceId, serviceName, serviceType, isInternetService) => {
        const totalSubscribed = countSubscribedServices(isInternetService);
        const totalRequested = countRequestedServices(isInternetService);
        const combinedTotal = totalSubscribed + totalRequested;

        if (sameNameServiceSubscribed(serviceName, serviceType, isInternetService)) {
            // Show confirmation popup
            const userConfirmed = window.confirm(`You have a subscribed service with the name "${serviceName}" but of a different type (${serviceType}). If you want a new service, please upgrade or terminate the existing service!`);
            if (userConfirmed) {
                navigate('/user/subscribed-services');
            }
        } else if (combinedTotal < 2) {
            if (isProcessing) return; // Prevent multiple requests

            setIsProcessing(true);

            try {
                console.log('Sending request for service:', serviceId, serviceName);
                await handleSubscribe(serviceId, serviceName, serviceType, isInternetService);
            } finally {
                setIsProcessing(false);
                // Fetch updated data after request
                console.log('Fetching updated data...');
                await Promise.all([fetchServices(), fetchSubscribedServices(), fetchPendingRequests()]);
            }
        } else if (combinedTotal === 2) {
            // Show confirmation popup
            const userConfirmed = window.confirm('You have 2 availed services. If you want a new service, please update or terminate an existing service!');
            if (userConfirmed) {
                navigate('/user/subscribed-services');
            }
        } else {
            handleDisabledClick(
                isUserSubscribed(serviceId, isInternetService),
                totalSubscribed,
                totalRequested
            );
        }
    };

    const sameNameServiceSubscribed = (serviceName, serviceType, isInternetService) => {
        console.log(`Checking for serviceName: ${serviceName} in ${isInternetService ? 'Internet' : 'TV'} services`);

        // Check subscriptions across both types
        const allSubscribedServices = [
            ...subscribedInternetServices,
            ...subscribedTvServices
        ];
        console.log(serviceName+" "+allSubscribedServices[0].serviceName);
        // Return true if the user has a service with the same name but different type
        return allSubscribedServices.some(service => 
            service.serviceName === serviceName && service.serviceType !== serviceType && service.active
        );
    };

    const isSubscribeButtonDisabled = (serviceId, serviceName, serviceType, isInternetService) => {
        const totalSubscribed = countSubscribedServices(isInternetService);
        const totalRequested = countRequestedServices(isInternetService);
        const combinedTotal = totalSubscribed + totalRequested;

        // Check if the user is already subscribed to the service
        if (isUserSubscribed(serviceId, isInternetService)) return true;

        // Check if the combined total of subscribed and requested services is 2 or more
        if (combinedTotal >= 2) return true;

        // Check if there is a service with the same name but of a different type
        if (sameNameServiceSubscribed(serviceName, serviceType, isInternetService)) return true;

        return false;
    };

    const handleDisabledClick = (isSubscribed, totalSubscribed, totalRequested) => {
        if (isSubscribed) {
            window.alert(`You have already subscribed to this service. Total subscribed services: ${totalSubscribed}`);
        } else {
            window.alert(`You have already availed ${totalSubscribed} and requested ${totalRequested} services.\nIf you want a new service, please terminate a service or update an existing service.`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Internet Services</h1>
            <div className="services-grid">
                {internetServices.map(service => (
                    service.active && (
                        <ServiceCard
                            key={service.serviceId}
                            service={service}
                            isSubscribed={isUserSubscribed(service.serviceId, true)}
                            isRequested={isServiceRequested(service.serviceName)}
                            onSubscribe={(id, name, type) => handleButtonClick(id, name, type, true)}
                            isButtonDisabled={isSubscribeButtonDisabled(service.serviceId, service.serviceName, service.serviceType, true)}
                            onDisabledClick={(isSubscribed) => handleDisabledClick(
                                isSubscribed,
                                countSubscribedServices(true),
                                countRequestedServices(true)
                            )}
                        />
                    )
                ))}
            </div>

            <h1>TV Services</h1>
            <div className="services-grid">
                {tvServices.map(service => (
                    service.active && (
                        <ServiceCard
                            key={service.serviceId}
                            service={service}
                            isSubscribed={isUserSubscribed(service.serviceId, false)}
                            isRequested={isServiceRequested(service.serviceName)}
                            onSubscribe={(id, name, type) => handleButtonClick(id, name, type, false)}
                            isButtonDisabled={isSubscribeButtonDisabled(service.serviceId, service.serviceName, service.serviceType, false)}
                            onDisabledClick={(isSubscribed) => handleDisabledClick(
                                isSubscribed,
                                countSubscribedServices(false),
                                countRequestedServices(false)
                            )}
                        />
                    )
                ))}
            </div>
        </div>
    );
}

export default Services;
