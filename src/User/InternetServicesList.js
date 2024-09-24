// src/components/InternetServicesList.js
import React from 'react';
import InternetServicesCard from './InternetServicesCard';
import './Styling_Components/App.css';

const internetServicesData = [
  {
    serviceId: 1,
    serviceName: "5G Internet",
    description: "This affordable plan offers essential features for users who need reliable internet access at home.",
    serviceType: "BASIC",
    serviceDownloadSpeed: 300,
    serviceUploadSpeed: 30,
    benefits: "1000 GB Data, Suitable for 1-5 users online simultaneously, HD video streaming and smooth browsing experience",
    cost: 1999,
    validity: 30,
  },
  {
    serviceId: 2,
    serviceName: "Nbn",
    description: "A high-speed internet plan designed for larger households or users who need additional features and performance.",
    serviceType: "PREMIUM",
    serviceDownloadSpeed: 400,
    serviceUploadSpeed: 40,
    benefits: "Unlimited Data, Ideal for 6-9 users online at the same time, Perfect for HD video streaming and gaming without lag",
    cost: 4999,
    validity: 60,
  },
  {
    serviceId: 3,
    serviceName: "Lite Broadband",
    description: "An economical internet plan perfect for light users who need basic connectivity for everyday tasks.",
    serviceType: "BASIC",
    serviceDownloadSpeed: 100,
    serviceUploadSpeed: 25,
    benefits: "Unlimited Data, Best for 1-2 users online simultaneously, Suitable for basic video streaming and browsing",
    cost: 699,
    validity: 30,
  },
  {
    serviceId: 4,
    serviceName: "HyperSpeed Connect",
    description: "A high-performance internet plan offering premium features and ultra-fast speeds for households with demanding internet needs.",
    serviceType: "PREMIUM",
    serviceDownloadSpeed: 700,
    serviceUploadSpeed: 40,
    benefits: "Ideal for 6+ users with high-demand devices, Supports 8K streaming, serious gaming, and other bandwidth-intensive activities",
    cost: 1199,
    validity: 45,
  },
  {
    serviceId: 5,
    serviceName: "Blaze Internet",
    description: "A well-balanced internet plan designed for moderate use, providing reliable speeds for households with multiple devices.",
    serviceType: "STANDARD",
    serviceDownloadSpeed: 250,
    serviceUploadSpeed: 25,
    benefits: "Supports 6+ users on multiple devices, Ideal for Ultra HD video streaming and gaming",
    cost: 799,
    validity: 30,
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
