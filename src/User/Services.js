import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ServiceCard from './ServiceCard.js';
import StyleServices from './Styling_Components/Services.css';
import { useNavigate } from 'react-router-dom';
import TvImage from '../Images/Tv.jpg';
import InternetImage from '../Images/Internet.jfif'

function Services() {
    const [internetServices, setInternetServices] = useState([]);
    const [tvServices, setTvServices] = useState([]);
    const [subscribedInternetServices, setSubscribedInternetServices] = useState([]);
    const [subscribedTvServices, setSubscribedTvServices] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showMoreInternetServices, setShowMoreInternetServices] = useState(false); // New state for Internet services
    const [showMoreTvServices, setShowMoreTvServices] = useState(false); // New state for TV services
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
    const fetchServiceDetails = async (serviceId, isInternetService) => {
        try {
            const endpoint = isInternetService
                ? `http://localhost:8082/api/internet-services/${serviceId}`
                : `http://localhost:8082/api/tv-services/${serviceId}`;
            const response = await axios.get(endpoint, { withCredentials: true });
            return response.data; // Assuming response data includes serviceName
        } catch (error) {
            console.error(`Error fetching service details for ID ${serviceId}:`, error);
            return null;
        }
    };
    
    const fetchSubscribedServices = useCallback(async () => {
        try {
            console.log('Fetching subscribed services...');
            const response = await axios.get('http://localhost:8082/user/api/subscribed-services', { withCredentials: true });
            const { internetServicesAvailed, tvServicesAvailed } = response.data;
    
            // Fetch details for each service
            const fetchAllServiceDetails = async (services, isInternetService) => {
                const detailsPromises = services.map(async (service) => {
                    const details = await fetchServiceDetails(service.serviceId, isInternetService);
                    return { ...service, serviceName: details?.serviceName || 'Unknown Service Name',serviceType:details?.serviceType };
                });
                return Promise.all(detailsPromises);
            };
    
            const processedInternetServices = await fetchAllServiceDetails(internetServicesAvailed || [], true);
            const processedTvServices = await fetchAllServiceDetails(tvServicesAvailed || [], false);
    
            // Log the processed data
            console.log('Processed Internet Services:', processedInternetServices);
            console.log('Processed TV Services:', processedTvServices);
    
            setSubscribedInternetServices(processedInternetServices);
            setSubscribedTvServices(processedTvServices);
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

    const handleViewMoreInternet = () => setShowMoreInternetServices(!showMoreInternetServices);
    const handleViewMoreTv = () => setShowMoreTvServices(!showMoreTvServices);

    // Logic to display 5 services initially and toggle between showing all services or fewer
    const displayedInternetServices = showMoreInternetServices ? internetServices : internetServices.slice(0, 5);
    const displayedTvServices = showMoreTvServices ? tvServices : tvServices.slice(0, 5);

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
    
            // Check if the service has no criteria
            const service = isInternetService ? internetServices.find(s => s.serviceId === serviceId) : tvServices.find(s => s.serviceId === serviceId);
            if (service && !service.criteria) {
                navigate('/user/subscribed-services'); // Navigate directly to subscribed services
                window.alert('You have been subscribed directly! Redirecting to subscribed services...');
            } else {
                navigate('/user/pending-requests'); // Navigate to pending requests for other cases
                window.alert('Request sent successfully! Redirecting to pending requests...');
            }
        } catch (err) {
            window.alert('Error sending request.');
            console.error('Error sending request:', err);
        }
    };
    

    const handleButtonClick = async (serviceId, serviceName, serviceType, isInternetService) => {
        const totalSubscribed = countSubscribedServices(isInternetService);
        const totalRequested = countRequestedServices(isInternetService);
        const combinedTotal = totalSubscribed + totalRequested;
    
        const isSubscribed = isUserSubscribed(serviceId, isInternetService);
        const hasSameNameService = sameNameServiceSubscribed(serviceName, serviceType, isInternetService);
    
        // Check if the service has empty criteria
        const service = isInternetService ? internetServices.find(s => s.serviceId === serviceId) : tvServices.find(s => s.serviceId === serviceId);
        
        if (service && !service.criteria) {
            const userConfirmed = window.confirm(`For ${serviceName} service there is no need to send a request for subscribing.\n Do you want to subscribe directly?`);
            if (userConfirmed) {
                if (isProcessing) return; // Prevent multiple requests
                setIsProcessing(true);
                try {
                    await handleSubscribe(serviceId, serviceName, serviceType, isInternetService);
                    navigate('/user/subscribed-services'); // Navigate to subscribed services page
                } finally {
                    setIsProcessing(false);
                    // Fetch updated data after request
                    await Promise.all([fetchServices(), fetchSubscribedServices(), fetchPendingRequests()]);
                }
            }
            return; // Exit early
        }
    
        // Existing logic for other conditions
        if (hasSameNameService) {
            const userConfirmed = window.confirm(`You have a subscribed service with the name "${serviceName}" but of a different type (${serviceType}). If you want a new service, please upgrade or terminate the existing service!`);
            if (userConfirmed) {
                navigate('/user/subscribed-services');
            }
        } else if (combinedTotal < 2) {
            if (isProcessing) return; // Prevent multiple requests
            setIsProcessing(true);
            try {
                await handleSubscribe(serviceId, serviceName, serviceType, isInternetService);
                navigate('/user/pending-requests'); // Navigate to subscribed services page
            } finally {
                setIsProcessing(false);
                await Promise.all([fetchServices(), fetchSubscribedServices(), fetchPendingRequests()]);
            }
        } else if (combinedTotal === 2) {
            const userConfirmed = window.confirm('You have 2 availed services. If you want a new service, please update or terminate an existing service!');
            if (userConfirmed) {
                navigate('/user/subscribed-services');
            }
        } else {
            handleDisabledClick(isSubscribed, totalSubscribed, totalRequested, hasSameNameService);
        }
    };
    
    
    

    const sameNameServiceSubscribed = (serviceName, serviceType, isInternetService) => {
        console.log(`Checking for serviceName: ${serviceName} in ${isInternetService ? 'Internet' : 'TV'} services`);
    
        // Combine internet and TV subscribed services
        const allSubscribedServices = [
            ...subscribedInternetServices,
            ...subscribedTvServices
        ];
    
        // Log subscribed services for debugging
        allSubscribedServices.forEach(service => {
            console.log(`Subscribed service: ${service.serviceName}, Type: ${service.serviceType}, Active: ${service.active}`);
        });
    
        // Check if any service has the same name but a different type
        const foundService = allSubscribedServices.find(service =>
            service.serviceName === serviceName && service.serviceType !== serviceType && service.active
        );
    
        if (foundService) {
            console.log(`Found subscribed service with the same name but different type: ${foundService.serviceName}, Type: ${foundService.serviceType}`);
            return true;
        } else {
            console.log('No service with the same name but different type found.');
            return false;
        }
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

    const handleDisabledClick = (isSubscribed, totalSubscribed, totalRequested, hasSameNameService) => {
        if (isSubscribed) {
            window.alert(`You have already subscribed to this service!!`);
        } else if (hasSameNameService) {
            window.alert(`You have already subscribed to a service with the same name but of a different type. Please upgrade or downgrade your existing service.`);
            navigate('/user/subscribed-services');
        } else {
            window.alert(`You have already availed ${totalSubscribed} services and requested ${totalRequested} services.\nIf you want a new service, please terminate a service or update an existing service.`);
        }
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={StyleServices}>
            <h1>Internet Services</h1>
            <div className="services-grid">
                {displayedInternetServices.map(service => (
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
                                countRequestedServices(true),
                                sameNameServiceSubscribed(service.serviceName, service.serviceType, true)
                            )}
                        />
                    )
                ))}
                <div 
          className="view-more-btn-container"
          onClick={handleViewMoreInternet}
          style={{ backgroundImage: `url(${InternetImage})` }}  // Ensure correct URL format
        >
          <button className="btn view-more-btn">
            {!showMoreInternetServices ? 'View More' : 'Show Less'}
          </button>
        </div>
            </div>

            <h1>TV Services</h1>
            <div className="services-grid">
                {displayedTvServices.map(service => (
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
                                countRequestedServices(false),
                                sameNameServiceSubscribed(service.serviceName, service.serviceType, false)
                            )}
                        />
                    )
                ))}
                <div 
          className="view-more-btn-container"
          onClick={handleViewMoreTv}
          style={{ backgroundImage: `url(${TvImage})` }}  // Ensure correct URL format
        >
          <button className="btn view-more-btn">
            {!showMoreTvServices ? 'View More' : 'Show Less'}
          </button>
        </div>
            </div>
     </div>
    );
}

export default Services;
