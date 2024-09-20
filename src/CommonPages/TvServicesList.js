// src/components/ServicesList.js
import React from 'react';
import TvServicesCard from './TvServicesCard'; // Correct import statement
import './Styling_Components/App.css';

const servicesData = [
  {
    serviceId: 1,
    serviceName: "Basic TV Plan 1",
    description: "Basic channels with limited features",
    benefits: "Basic channels",
    criteria: "Basic Eligibility",
    serviceType: "BASIC",
    cost: 15.99,
    validity: 30,
  },
  {
    serviceId: 2,
    serviceName: "Premium TV Plan 1",
    description: "Premium channels with HD streaming",
    benefits: "HD Channels, Premium Content",
    criteria: "Premium Eligibility",
    serviceType: "PREMIUM",
    cost: 49.99,
    validity: 30,
  },
  {
    serviceId: 3,
    serviceName: "Standard TV Plan 1",
    description: "Standard channels with some HD content",
    benefits: "HD Channels, News",
    criteria: "Standard Eligibility",
    serviceType: "STANDARD",
    cost: 29.99,
    validity: 30,
  },
  {
    serviceId: 4,
    serviceName: "Standard TV Plan 2",
    description: "Standard channel package",
    benefits: "Sports and News channels",
    criteria: "Standard Eligibility",
    serviceType: "STANDARD",
    cost: 34.99,
    validity: 60,
  },
  {
    serviceId: 5,
    serviceName: "Premium TV Plan 3",
    description: "High-definition premium channels",
    benefits: "All HD channels, No ads",
    criteria: "Premium Viewers",
    serviceType: "PREMIUM",
    cost: 69.99,
    validity: 90,
  },
];

const TvServicesList = ({ onServiceClick, onViewMoreClick }) => {
  return (
    <div className="services-preview">
      <h2>TV Services</h2>
      <div className="services-list">
        {servicesData.map(service => (
          <TvServicesCard 
            key={service.serviceId} 
            service={service} 
            onClick={onServiceClick} 
          />
        ))}
        {/* Add View More Card */}
        <div className="tv service-card view-more" onClick={onViewMoreClick}>
          <h3>View More</h3>
        </div>
      </div>
    </div>
  );
};

export default TvServicesList;
