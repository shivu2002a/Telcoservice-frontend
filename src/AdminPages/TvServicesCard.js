// src/components/ServiceCard.js
import React from 'react';
import './Styling_Components/App.css';

const TvServicesCard = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={() => onClick(service.serviceId)}>
      <h3>{service.serviceName}</h3>
      <p>Type:{service.serviceType}</p>
      <p>{service.description}</p>
      <p>Benefits:{service.benefits}</p>
      <p>Cost:  Rs.{service.cost}</p>
      <p>Validity:{service.validity} Days</p>
    </div>
  );
};

export default TvServicesCard;
