// src/components/ServiceCard.js
import React from 'react';
import './Styling_Components/App.css';

const TvServicesCard = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={() => onClick(service.serviceId)}>
      <h3>{service.serviceName}</h3>
      <p>{service.description}</p>
      <p><strong>Type:</strong>{service.serviceType}</p>
      <p><strong>Benefits:</strong>{service.benefits}</p>
      <p><strong>Cost:</strong> Rs.{service.cost}</p>
      <p><strong>Validity:</strong>{service.validity} Days</p>
    </div>
  );
};

export default TvServicesCard;
