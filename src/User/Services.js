import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ServiceCard from './ServiceCard.js';
import StyleServices from './Styling_Components/Services.css';
import { useNavigate } from 'react-router-dom';
import TvImage from '../Images/Tv.jpg';
import InternetImage from '../Images/Internet.jfif';
import AlertModal from './AlertModal.js';

function Services() {
    const [internetServices, setInternetServices] = useState([]);
    const [tvServices, setTvServices] = useState([]);
    const [subscribedInternetServices, setSubscribedInternetServices] = useState([]);
    const [subscribedTvServices, setSubscribedTvServices] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showMoreInternetServices, setShowMoreInternetServices] = useState(false); // New state for Internet services
    const [showMoreTvServices, setShowMoreTvServices] = useState(false); // New state for TV services
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [onAlertOk, setOnAlertOk] = useState(null);
    

const handleAlertOk = () => {
    setShowAlert(false);  // Close the alert
    if (onAlertOk) {
         
        onAlertOk();  // Execute the callback (navigate)
        setOnAlertOk(null);  // Reset callback to avoid repeated execution
    }
};

const handleAlertCancel = () => {
    setShowAlert(false);  // Just close the alert
};
    const navigate = useNavigate();

    // Fetch services data
    const fetchServices = useCallback(async () => {
        try {
            
            const [internetResponse, tvResponse] = await Promise.all([
                axios.get(process.env.REACT_APP_BACKEND_URL+'/api/internet-services/', { withCredentials: true }),
                axios.get(process.env.REACT_APP_BACKEND_URL+'/api/tv-services/', { withCredentials: true }),
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
                ? process.env.REACT_APP_BACKEND_URL+`/api/internet-services/${serviceId}`
                : process.env.REACT_APP_BACKEND_URL+`/api/tv-services/${serviceId}`;
            const response = await axios.get(endpoint, { withCredentials: true });
            return response.data; // Assuming response data includes serviceName
        } catch (error) {
            console.error(`Error fetching service details for ID ${serviceId}:`, error);
            return null;
        }
    };
    
    const fetchSubscribedServices = useCallback(async () => {
        try {
            
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL+'/user/api/subscribed-services', { withCredentials: true });
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
            
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL+'/user/api/pending-request', { withCredentials: true });
            

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

        
        return requestedCount;
    };

    const handleSubscribe = async (serviceId, serviceName, serviceType, isInternetService) => {
        const apiUrl = isInternetService
            ? process.env.REACT_APP_BACKEND_URL+'/user/api/internet-service'
            : process.env.REACT_APP_BACKEND_URL+'/user/api/tv-service';
    
        try {
            
            await axios.post(apiUrl, null, {
                params: { serviceId },
                withCredentials: true,
            });
            
    
            const service = isInternetService ? internetServices.find(s => s.serviceId === serviceId) : tvServices.find(s => s.serviceId === serviceId);
            
            let alertMessage;
            let redirectPath;
    
            if (service && !service.criteria) {
                alertMessage = 'You have been subscribed directly! Redirecting to subscribed services...';
                redirectPath = '/user/subscribed-services';
            } else {
                alertMessage = 'Request sent successfully! Redirecting to pending requests...';
                redirectPath = '/user/pending-requests';
            }
    
            setAlertMessage(alertMessage);
            setShowAlert(true);
            setOnAlertOk(() => () => {
                navigate(redirectPath);
            });
    
        } catch (err) {
            setAlertMessage('Error sending request.');
            setShowAlert(true);
            console.error('Error sending request:', err);
        }
    };
    
    const handleButtonClick = async (serviceId, serviceName, serviceType, isInternetService) => {
        const totalSubscribed = countSubscribedServices(isInternetService);
        const totalRequested = countRequestedServices(isInternetService);
        const combinedTotal = totalSubscribed + totalRequested;
        const isSubscribed = isUserSubscribed(serviceId, isInternetService);
        const hasSameNameService = sameNameServiceSubscribed(serviceName, serviceType, isInternetService);
    
        const service = isInternetService ? internetServices.find(s => s.serviceId === serviceId) : tvServices.find(s => s.serviceId === serviceId);
    
        if (service && !service.criteria) {
            setAlertMessage(`For ${serviceName} service, there is no need to send a request for subscribing. You will be subscribed directly.`);
            setShowAlert(true);
            setTimeout(() => {
                handleSubscribe(serviceId, serviceName, serviceType, isInternetService);
            }, 2000); // Delay of 2 seconds
            return;
        }
    
        if (hasSameNameService) {
            setAlertMessage(`You have a subscribed service with the name "${serviceName}" but of a different type (${serviceType}). If you want a new service, please upgrade or terminate the existing service!`);
            setShowAlert(true);
            setOnAlertOk(() => () => {
                navigate('/user/subscribed-services');
            });
        } else if (combinedTotal < 2) {
            await handleSubscribe(serviceId, serviceName, serviceType, isInternetService);
        } else if (combinedTotal === 2) {
            setAlertMessage('You have 2 availed services. If you want a new service, please update or terminate an existing service!');
            setShowAlert(true);
            setOnAlertOk(() => () => {
                navigate('/user/subscribed-services');
            });
        } else {
            handleDisabledClick(isSubscribed, totalSubscribed, totalRequested, hasSameNameService);
        }
    };
    
    

    const sameNameServiceSubscribed = (serviceName, serviceType, isInternetService) => {
        
    
        // Combine internet and TV subscribed services
        const allSubscribedServices = [
            ...subscribedInternetServices,
            ...subscribedTvServices
        ];
    
        // Log subscribed services for debugging
        allSubscribedServices.forEach(service => {
            
        });
    
        // Check if any service has the same name but a different type
        const foundService = allSubscribedServices.find(service =>
            service.serviceName === serviceName && service.serviceType !== serviceType && service.active
        );
    
        if (foundService) {
            
            return true;
        } else {
            
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
        let message = '';
    
        if (isSubscribed) {
            message = 'You have already subscribed to this service!!';
        } else if (hasSameNameService) {
            message = 'You have already subscribed to a service with the same name but of a different type. Please upgrade or downgrade your existing service.';
        } else if(totalSubscribed===0){
            message=`You have already requested ${totalRequested} services and wait for the request approval. Check for the request status..`;
        }else {
            message = `You have already availed ${totalSubscribed} services and requested ${totalRequested} services.\nIf you want a new service, please terminate a service or update an existing service.`;
        }
    
        // Set the alert message and show the modal
        setAlertMessage(message);
        setShowAlert(true);
    
        // Set the callback for navigation if needed
        setOnAlertOk(() => () => {
            if(!isSubscribed)
            {
                if(totalSubscribed===0)
                    navigate('/user/pending-requests');
                else{
                 
                navigate('/user/subscribed-services');
                }
            }
        });
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
            {showAlert && (
            <AlertModal
                message={alertMessage}
                onOk={handleAlertOk}     // Triggered when OK is clicked
                onCancel={handleAlertCancel} // Triggered when Cancel or close is clicked
            />
        )}
     </div>
    );
}

export default Services;
