import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Styling_Components/Services.css';

// Lazy load the ServiceList and Popup components
const ServicesList = React.lazy(() => import('./ServicesList'));
const Popup = React.lazy(() => import('./Popup'));

function ManageServices() {
  const [internetServices, setInternetServices] = useState([]);
  const [tvServices, setTvServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedInternetCount, setDisplayedInternetCount] = useState(5);
  const [displayedTvCount, setDisplayedTvCount] = useState(5);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8082/admin/api/internet-service`, { withCredentials: true })
      .then(response => {
        setInternetServices(response.data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8082/admin/api/tv-service`, { withCredentials: true })
      .then(response => {
        setTvServices(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleModifyInternetService = serviceId => {
    navigate(`/admin/updateInternet`, { state: { serviceId } });
  };

  const handleTerminateInternetService = serviceId => {
    const confirmTermination = window.confirm('Are you sure you want to terminate this service?');
    if (confirmTermination) {
      axios
        .delete(`http://localhost:8082/admin/api/internet-service?id=${serviceId}`, { withCredentials: true })
        .then(() => {
          alert('Service successfully terminated.');
          setInternetServices(prevServices => prevServices.filter(service => service.serviceId !== serviceId));
        })
        .catch(() => {
          alert('Error terminating service.');
        });
    }
  };

  const handleModifyTvService = serviceId => {
    navigate(`/admin/updateTv`, { state: { serviceId } });
  };

  const handleTerminateTvService = serviceId => {
    const confirmTermination = window.confirm('Are you sure you want to terminate this service?');
    if (confirmTermination) {
      axios
        .delete(`http://localhost:8082/admin/api/tv-service?id=${serviceId}`, { withCredentials: true })
        .then(() => {
          alert('Service successfully terminated.');
          setTvServices(prevServices => prevServices.filter(service => service.serviceId !== serviceId));
        })
        .catch(() => {
          alert('Error terminating service.');
        });
    }
  };

  const handleAddService = serviceType => {
    if (serviceType === 'internet') navigate(`/admin/addInternetService`);
    if (serviceType === 'tv') navigate(`/admin/addTvService`);
  };

  const handleServiceClick = service => {
    setSelectedService(service);
  };

  const closePopup = () => {
    setSelectedService(null);
  };

  const activeInternetServices = internetServices.filter(service => service.active);
  const activeTvServices = tvServices.filter(service => service.active);

  const showMoreInternetServices = () => {
    setDisplayedInternetCount(activeInternetServices.length);
  };

  const showLessInternetServices = () => {
    setDisplayedInternetCount(5);
  };

  const showMoreTvServices = () => {
    setDisplayedTvCount(activeTvServices.length);
  };

  const showLessTvServices = () => {
    setDisplayedTvCount(5);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const displayedInternetServices = activeInternetServices.slice(0, displayedInternetCount);
  const displayedTvServices = activeTvServices.slice(0, displayedTvCount);

  return (
    <>
      <div className={styles}>
        <div className="container">
          <div className="add-service-container">
            <button onClick={() => handleAddService('internet')} className="btn btn-primary">
              Add Internet Service
            </button>
          </div>

          
          <div className="services-section">
          <h1>Available Internet Services</h1>
            <div className="services-container">
              <Suspense fallback={<div>Loading Services...</div>}>
                <ServicesList
                  services={displayedInternetServices}
                  onModify={handleModifyInternetService}
                  onTerminate={handleTerminateInternetService}
                  handleServiceClick={handleServiceClick}
                  onViewMore={showMoreInternetServices}
                  onShowLess={showLessInternetServices}
                  hasMore={displayedInternetCount < activeInternetServices.length}
                  serviceType="internet"
                />
              </Suspense>
            </div>
          </div>

          <div className="add-service-container">
            <button onClick={() => handleAddService('tv')} className="btn btn-primary">
              Add TV Service
            </button>
          </div>

          <div className="services-section">
          <h1>Available TV Services</h1>
            <div className="services-container">
              <Suspense fallback={<div>Loading Services...</div>}>
                <ServicesList
                  services={displayedTvServices}
                  onModify={handleModifyTvService}
                  onTerminate={handleTerminateTvService}
                  handleServiceClick={handleServiceClick}
                  onViewMore={showMoreTvServices}
                  onShowLess={showLessTvServices}
                  hasMore={displayedTvCount < activeTvServices.length}
                  serviceType="tv"
                />
              </Suspense>
            </div>
          </div>

          {/* Lazy Loaded Popup Component */}
          <Suspense fallback={<div>Loading Popup...</div>}>
            {selectedService && <Popup service={selectedService} closePopup={closePopup} />}
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default ManageServices;
