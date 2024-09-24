import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Styling_Components/UpdateServices.css';

function UpdateTvServices() {
    const [tvService, setTvService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { serviceId } = location.state;

    useEffect(() => {
        axios.get(`http://localhost:8082/api/tv-services/${serviceId}`, { withCredentials: true })
            .then(response => {
                setTvService(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the service details!", error);
                setError(error.message);
                setLoading(false);
            });
    }, [serviceId]);

    const handleSaveTvService = () => {
        const updatedData = {
            serviceId,
            serviceName: tvService.serviceName,
            cost: tvService.cost,
            benefits: tvService.benefits,
            description: tvService.description,
            criteria: tvService.criteria,
            serviceType: tvService.serviceType,
            validity: tvService.validity,
        };
        axios.patch(`http://localhost:8082/admin/api/tv-service`, updatedData, { withCredentials: true })
            .then(response => {
                console.log("Service updated:", response.data);
                setAlertMessage("Service updated successfully!");
                setShowAlert(true);
            })
            .catch(error => {
                console.error("There was an error updating the service!", error);
                setAlertMessage("Error updating the service.");
                setShowAlert(true);
            });
    };

    const handleAlertOk = () => {
        setShowAlert(false);
        navigate('/admin/manageServices'); // Redirect to the services page after updating
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="modify-container">
                <h1>Modify Service</h1>
                {tvService && (
                    <form>
                        <label>
                            Service Name:
                            <input
                                type="text"
                                value={tvService.serviceName}
                                onChange={(e) => setTvService({ ...tvService, serviceName: e.target.value })} disabled />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={tvService.description}
                                onChange={(e) => setTvService({ ...tvService, description: e.target.value })} />
                        </label>
                        <label>
                            Service Type:
                            <textarea
                                value={tvService.serviceType}
                                onChange={(e) => setTvService({ ...tvService, serviceType: e.target.value })} disabled />
                        </label>
                        <label>
                            Benefits:
                            <textarea
                                value={tvService.benefits}
                                onChange={(e) => setTvService({ ...tvService, benefits: e.target.value })} />
                        </label>
                        <label>
                            Criteria:
                            <textarea
                                value={tvService.criteria}
                                onChange={(e) => setTvService({ ...tvService, criteria: e.target.value })} />
                        </label>
                        <label>
                            Cost: Rs.
                            <textarea
                                value={tvService.cost}
                                onChange={(e) => setTvService({ ...tvService, cost: e.target.value })} />
                        </label>
                        <label>
                            Validity (in days):
                            <textarea
                                value={tvService.validity}
                                onChange={(e) => setTvService({ ...tvService, validity: e.target.value })} />
                        </label>
                        <button type="button" onClick={handleSaveTvService}>Save Changes</button>
                    </form>
                )}
            </div>

            {showAlert && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{alertMessage}</p>
                        <button onClick={handleAlertOk}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdateTvServices;
