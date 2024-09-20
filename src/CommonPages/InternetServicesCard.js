// src/components/InternetServiceCard.js
import React from 'react';
import './Styling_Components/App.css';

const InternetServicesCard = ({ service, onClick }) => {
  return (
    <div className="service-card" onClick={() => onClick(service.serviceId)}>
      <h3>{service.serviceName}</h3>
      <p>Type:{service.serviceType}</p>
      <p>{service.description}</p>
      <p>Benefits:{service.benefits}</p>
      <p>Download Speed: {service.serviceDownloadSpeed} Mbps</p>
      <p>Upload Speed: {service.serviceUploadSpeed} Mbps</p>
      <p>Cost: Rs.{service.cost}</p>
      <p>Validity: {service.validity} Days</p>
    </div>
  );
};

export default InternetServicesCard;
