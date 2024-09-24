import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styling_Components/RequestsValidation.css';

function RequestsValidation() {
    const location = useLocation();
    const { user, service, request } = location.state;
    const [remarks, setRemarks] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (status) => {
        if (!request.requestId || !service.serviceId || !request.userId) {
            setModalMessage("Missing necessary data. Please check request and service details.");
            setModalVisible(true);
            return;
        }

        try {
            const response = await axios.patch(process.env.REACT_APP_BACKEND_URL+'/admin/api/approval-requests', {
                requestId: request.requestId,
                requestStatus: status,
                remarks: remarks,
                serviceId: service.serviceId,
                userId: request.userId,
                serviceType: request.serviceType
            }, { withCredentials: true });

            if (response.status >= 200 && response.status < 300) {
                setModalMessage(`Request ${status.toLowerCase()} successfully!`);
                setModalVisible(true);
            } else {
                setModalMessage('Unexpected response status. Failed to update the request.');
                setModalVisible(true);
            }
        } catch (error) {
            if (error.response) {
                setModalMessage(`Failed to update the request: ${error.response.data.message || 'Server Error'}`);
            } else if (error.request) {
                setModalMessage('No response received from the server. Please try again.');
            } else {
                setModalMessage('Error setting up request.');
            }
            setModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        if (modalMessage.includes('successfully')) {
            navigate('/admin/requests');
        }
    };

    // Format the address
    const formattedAddress = user.address.split(', ').map((pair, index) => {
        const [key, value] = pair.split(': ');
        return <p key={index}><strong>{key}:</strong> {value}</p>;
    });

    return (
        <div className="request-details-container">
            <h1>Validate Request</h1>
            <h2>Service Details</h2>
            <p><strong>Service Name:</strong> {service.serviceName}</p>
            <p>
                <strong>Service Availability:</strong>
                <b>
                    <span style={{ color: service.active ? 'green' : 'red' }}>
                        {service.active ? 'Available' : 'Unavailable'}
                    </span>
                </b>
            </p>
            <p><strong>Service Type:</strong> {service.serviceType}</p>
            <p><strong>Criteria:<span style={{ color: 'red' }}>{service.criteria}</span></strong></p>

            {request.serviceType === 'INTERNET_SERVICE' && (
                <>
                    <p><strong>Description:</strong> {service.description}</p>
                    <p><strong>Download Speed(Mbps):</strong> {service.serviceDownloadSpeed} Mbps</p>
                    <p><strong>Upload Speed(Mbps):</strong> {service.serviceUploadSpeed} Mbps</p>
                    <p><strong>Validity:</strong> {service.validity} Days</p>
                    <p><strong>Cost(Rs.):</strong> {service.cost}</p>
                </>
            )}
            {request.serviceType === "TV_SERVICE" && (
                <>
                    <p><strong>Description:</strong> {service.description}</p>
                    <p><strong>Validity:</strong> {service.validity} Days</p>
                    <p><strong>Cost(Rs.):</strong> {service.cost}</p>
                </>
            )}

            <h2>User Details</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone number:</strong> {user.phonenumber}</p>
            <p><strong>Address</strong></p>
            <div className="address-container">{formattedAddress}</div>
            <div>
                <label htmlFor="remarks">Remarks: </label>
                <textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks here..."
                    rows="4"
                />
            </div>

            <div>
                <button className="approve-btn" onClick={() => handleSubmit('APPROVED')}>
                    Approve
                </button>
                <button
                    className="disapprove-btn"
                    onClick={() => handleSubmit('DISAPPROVED')}
                    disabled={remarks.trim() === ''}
                >
                    Disapprove
                </button>
            </div>

            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{modalMessage}</p>
                        <button onClick={handleCloseModal}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RequestsValidation;
