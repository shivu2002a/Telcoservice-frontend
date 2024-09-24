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
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [serviceToTerminate, setServiceToTerminate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Fetching internet services
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

  // Fetching TV services
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

  const handleModifyTvService = serviceId => {
    navigate(`/admin/updateTv`, { state: { serviceId } });
  };

  const confirmTermination = serviceId => {
    setServiceToTerminate(serviceId);
    setShowConfirm(true);
  };

  const handleTerminateService = (serviceId, isTv) => {
    const apiEndpoint = isTv 
      ? `http://localhost:8082/admin/api/tv-service?id=${serviceId}`
      : `http://localhost:8082/admin/api/internet-service?id=${serviceId}`;

    axios
      .delete(apiEndpoint, { withCredentials: true })
      .then(() => {
        setAlertMessage('Service successfully terminated.');
        setShowAlert(true);
        if (isTv) {
          setTvServices(prevServices => prevServices.filter(service => service.serviceId !== serviceId));
        } else {
          setInternetServices(prevServices => prevServices.filter(service => service.serviceId !== serviceId));
        }
        setShowConfirm(false);
      })
      .catch(() => {
        setAlertMessage('Error terminating service.');
        setShowAlert(true);
        setShowConfirm(false);
      });
  };

  const handleTerminateInternetService = serviceId => {
    confirmTermination(serviceId);
  };

  const handleTerminateTvService = serviceId => {
    confirmTermination(serviceId);
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

  const closeAlert = () => {
    setShowAlert(false);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setServiceToTerminate(null);
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

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to terminate this service?</p>
            <div className="button-container">
              <button onClick={() => handleTerminateService(serviceToTerminate, false)} className="btn btn-danger">Yes</button>
              <button onClick={closeConfirm} className="btn btn-secondary">No</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlert && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{alertMessage}</p>
            <button onClick={closeAlert}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageServices;
