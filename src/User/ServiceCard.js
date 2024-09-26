import React from 'react';
import './Styling_Components/ServiceCard.css';
const ServiceCard = ({ service, isSubscribed, isRequested, onSubscribe, isButtonDisabled, onDisabledClick }) => {
    const handleClick = () => {
        if (isButtonDisabled) {
            onDisabledClick(isSubscribed); // Pass the isSubscribed status to handleDisabledClick
        } else {
            onSubscribe(service.serviceId, service.serviceName, service.serviceType);
        }
    };

    return (
        <div className="service-box">
            <h2><strong>{service.serviceName}</strong></h2>
            <p><strong>Type:</strong> {service.serviceType}</p>
            <p><strong>Description:</strong> {service.description}</p>
            <p><strong>Benefits:</strong> {service.benefits}</p>
            {service.serviceDownloadSpeed && (
                <div className="speed-info">
                    <p><span className="icon">⬇️</span><strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps</p>
                    <p><span className="icon">⬆️</span><strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps</p>
                </div>
            )}
            <p className="plan-cost">Rs.{service.cost}</p>
            <p className='plan-validity'>{service.validity} Days</p>
            <div className="button-container">
                <button
                    className="subscribe-btn"
                    onClick={handleClick}
                    disabled={isButtonDisabled}
                >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
                {isButtonDisabled && (
                    <div
                        className="overlay"
                        onClick={handleClick}
                    />
                )}
            </div>
        </div>
    );
};
export default ServiceCard;