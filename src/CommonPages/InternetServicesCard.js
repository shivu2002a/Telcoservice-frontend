// src/components/InternetServiceCard.js
import React from 'react';
import './Styling_Components/App.css';

const InternetServicesCard = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={() => onClick(service.serviceId)}>
      <h3>{service.serviceName}</h3>
      <p>{service.description}</p>
      <p><strong>Type:</strong>{service.serviceType}</p>
      <p><strong>Benefits:</strong>{service.benefits}</p>
      <p><strong>Download Speed:</strong> {service.serviceDownloadSpeed} Mbps</p>
      <p><strong>Upload Speed:</strong> {service.serviceUploadSpeed} Mbps</p>
      <p><strong>Cost: </strong>Rs.{service.cost}</p>
      <p><strong>Validity:</strong> {service.validity} Days</p>
    </div>
  );
};

export default InternetServicesCard;
