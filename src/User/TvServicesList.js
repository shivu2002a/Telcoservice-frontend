// src/components/ServicesList.js
import React from 'react';
import TvServicesCard from './TvServicesCard'; // Correct import statement
import './Styling_Components/App.css';

const servicesData = [
  {
    serviceId: 1,
    serviceName: "Disney+",
    description: "Get 3 months of Disney+ Standard for Rs.899",
    benefits: "Enjoy original movies, series, and documentaries only available on Disney+ where it has a vast library of content suitable for all ages, making it perfect for family viewing",
    serviceType: "STANDARD",
    cost: 899,
    validity: 90,
  },
  {
    serviceId: 2,
    serviceName: "Binge",
    description: "Get 2 months of BINGE streaming service.",
    benefits: "Access to all the best BINGE-worthy shows, including HBO Classics, with new content added regularly.",
    serviceType: "PREMIUM",
    cost: 799,
    validity: 60,
  },
  {
    serviceId: 3,
    serviceName: "Netflix",
    description: "Stream your favorite movies and TV shows with Netflix's Basic Plan.",
    benefits: "Access to a vast library of movies, series, and original content.",
    serviceType: "BASIC",
    cost: 699,
    validity: 30,
  },
  {
    serviceId: 4,
    serviceName: "Amazon Prime Video",
    description: "Enjoy unlimited access to thousands of movies and TV shows with Prime Video.",
    benefits: "Includes access to exclusive Amazon Originals and the ability to rent or buy new releases.",
    serviceType: "STANDARD",
    cost: 899,
    validity: 45,
  },
  {
    serviceId: 5,
    serviceName: "Apple TV+",
    description: "Watch award-winning Apple Originals and new movies and shows every month.",
    benefits: "Access to exclusive content and the ability to download shows for offline viewing.",
    serviceType: "PREMIUM",
    cost: 799,
    validity: 30,
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
