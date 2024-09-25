import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Styling_Components/UpdateServices.css';

function UpdateInternetServices() {
    const [internetService, setInternetService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { serviceId } = location.state;

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL+`/api/internet-services/${serviceId}`, { withCredentials: true })
            .then(response => {
                setInternetService(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the service details!", error);
                setError(error.message);
                setLoading(false);
            });
    }, [serviceId]);

    const handleSaveInternetService = () => {
        const updatedData = {
            serviceId,
            serviceName: internetService.serviceName,
            description: internetService.description,
            serviceType: internetService.serviceType,
            serviceDownloadSpeed: internetService.serviceDownloadSpeed,
            serviceUploadSpeed: internetService.serviceUploadSpeed,
            benefits: internetService.benefits,
            cost: internetService.cost,
            criteria: internetService.criteria,
            validity: internetService.validity,
        };
        axios.patch(process.env.REACT_APP_BACKEND_URL+`/admin/api/internet-service`, updatedData, { withCredentials: true })
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
                {internetService && (
                    <form>
                        <label>
                            Service Name:
                            <input 
                                type="text"
                                value={internetService.serviceName}
                                onChange={(e) => setInternetService({ ...internetService, serviceName: e.target.value })} disabled />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={internetService.description}
                                onChange={(e) => setInternetService({ ...internetService, description: e.target.value })} />
                        </label>
                        <label>
                            Service Type:
                            <textarea
                                value={internetService.serviceType}
                                onChange={(e) => setInternetService({ ...internetService, serviceType: e.target.value })} disabled />
                        </label>
                        <label>
                            Download Speed (Mbps):
                            <textarea
                                value={internetService.serviceDownloadSpeed}
                                onChange={(e) => setInternetService({ ...internetService, serviceDownloadSpeed: e.target.value })} />
                        </label>
                        <label>
                            Upload Speed (Mbps):
                            <textarea
                                value={internetService.serviceUploadSpeed}
                                onChange={(e) => setInternetService({ ...internetService, serviceUploadSpeed: e.target.value })} />
                        </label>
                        <label>
                            Cost: Rs.
                            <textarea
                                value={internetService.cost}
                                onChange={(e) => setInternetService({ ...internetService, cost: e.target.value })} />
                        </label>
                        <label>
                            Benefits:
                            <textarea
                                value={internetService.benefits}
                                onChange={(e) => setInternetService({ ...internetService, benefits: e.target.value })} />
                        </label>
                        <label>
                            Criteria:
                            <textarea
                                value={internetService.criteria}
                                onChange={(e) => setInternetService({ ...internetService, criteria: e.target.value })} />
                        </label>
                        <label>
                            Validity (in days):
                            <textarea
                                value={internetService.validity}
                                onChange={(e) => setInternetService({ ...internetService, validity: e.target.value })} />
                        </label>
                        <button type="button" onClick={handleSaveInternetService}>Save Changes</button>
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

export default UpdateInternetServices;
