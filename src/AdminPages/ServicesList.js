import React from 'react';
import styles from './Styling_Components/Services.css';
import tvImage from '../Images/Tv.jpg';
import internetImage from '../Images/Internet.jfif';

function ServicesList({ services, onModify, onTerminate, handleServiceClick, onViewMore, onShowLess, hasMore, serviceType }) {
  // Determine the background image based on the service type
  const backgroundImage = serviceType === "internet" ? internetImage : tvImage;

  return (
    <div className={styles}>
      <div className="services-grid">
        {services.map(service => (
          <div
            className="service-box"
            key={service.serviceId}
            onClick={() => handleServiceClick(service)}
          >
            <h2>
              <strong>{service.serviceName}</strong>
              <p>({service.serviceType})</p>
            </h2>
            <p>{service.description}</p>
            <h2>
              <strong>Rs.{service.cost}</strong>
            </h2>
            <h2>
              <strong>{service.validity} Days</strong>
            </h2>
            <div className="service-buttons">
              <button onClick={() => onModify(service.serviceId)} className="btn modify-btn">
                Modify
              </button>
              <button onClick={() => onTerminate(service.serviceId)} className="btn terminate-btn">
                Terminate
              </button>
            </div>
          </div>
        ))}
        {/* View More / Show Less button */}
        <div 
          className="view-more-btn-container"
          onClick={hasMore ? onViewMore : onShowLess}
          style={{ backgroundImage: `url(${backgroundImage})` }}  // Ensure correct URL format
        >
          <button className="btn view-more-btn">
            {hasMore ? 'View More' : 'Show Less'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicesList;
