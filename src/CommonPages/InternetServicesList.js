// src/components/InternetServicesList.js
import React from 'react';
import InternetServicesCard from './InternetServicesCard';
import './Styling_Components/App.css';

const internetServicesData = [
  {
    serviceId: 1,
    serviceName: "Basic Plan 1",
    description: "Affordable plan with basic features",
    serviceType: "BASIC",
    serviceDownloadSpeed: 50,
    serviceUploadSpeed: 10,
    benefits: "Basic browsing",
    criteria: "Basic Eligibility",
    active: true,
    cost: 19.99,
    validity: 30,
  },
  {
    serviceId: 2,
    serviceName: "Premium Plan 1",
    description: "High-speed plan with additional features",
    serviceType: "PREMIUM",
    serviceDownloadSpeed: 200,
    serviceUploadSpeed: 50,
    benefits: "HD Streaming, No data cap",
    criteria: "Premium Eligibility",
    active: true,
    cost: 49.99,
    validity: 30,
  },
  {
    serviceId: 4,
    serviceName: "Basic Plan 2",
    description: "Economical plan for light users",
    serviceType: "BASIC",
    serviceDownloadSpeed: 60,
    serviceUploadSpeed: 15,
    benefits: "Email, Social media",
    criteria: "Basic Usage",
    active: true,
    cost: 21.99,
    validity: 60,
  },
  {
    serviceId: 5,
    serviceName: "Premium Plan 2",
    description: "Premium features with faster speeds",
    serviceType: "PREMIUM",
    serviceDownloadSpeed: 300,
    serviceUploadSpeed: 100,
    benefits: "4K Streaming, No latency",
    criteria: "Heavy Usage",
    active: true,
    cost: 59.99,
    validity: 30,
  },
  {
    serviceId: 6,
    serviceName: "Standard Plan 2",
    description: "Balanced plan for moderate use",
    serviceType: "STANDARD",
    serviceDownloadSpeed: 120,
    serviceUploadSpeed: 25,
    benefits: "Video calls, HD streaming",
    criteria: "Moderate Usage",
    active: true,
    cost: 35.99,
    validity: 60,
  },
];

const InternetServicesList = ({ onServiceClick, onViewMoreClick }) => {
  return (
    <div className="services-preview">
      <h2>Internet Services</h2>
      <div className="services-list">
        {internetServicesData.map(service => (
          <InternetServicesCard 
            key={service.serviceId} 
            service={service} 
            onClick={onServiceClick} 
          />
        ))}
        {/* Add View More Card */}
        <div className="service-card view-more" onClick={onViewMoreClick}>
          <h3>View More</h3>
        </div>
      </div>
    </div>
  );
};

export default InternetServicesList;
