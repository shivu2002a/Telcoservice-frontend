import React, { useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styling_Components/FeedbackForm.css'; // Import the CSS file

const TvFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { service = {} } = location.state || {};
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State to control confirmation modal
    const [isAlertOpen, setIsAlertOpen] = useState(false); // State to control success alert modal
    const [alertMessage, setAlertMessage] = useState(''); // State to hold alert message
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal after termination

    const handleFeedbackChange = (e) => setFeedback(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feedback.trim()) {
            setAlertMessage('Please enter your feedback.');
            setIsAlertOpen(true);
            return;
        }

        // Open confirmation modal before proceeding
        setIsConfirmModalOpen(true);
    };

    const handleConfirm = async () => {
        try {
            // Close the confirmation modal
            setIsConfirmModalOpen(false);

            // Submit feedback
            await axios.post('http://localhost:8082/user/api/tv-service/feedback', null, {
                params: { availedServiceId: service.serviceId, feedback },
                withCredentials: true
            });

            // Call a separate function to handle service deactivation
            await handleServiceDeactivation(service);
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback.');
        }
    };

    const handleServiceDeactivation = async (service) => {
        if (!service.serviceId || !service.startDate) {
            console.error('Service ID or Start Date is missing.');
            setError('Service ID or Start Date is missing.');
            return;
        }

        const formattedDate = new Date(service.startDate);
        if (isNaN(formattedDate.getTime())) {
            console.error('Invalid Start Date:', service.startDate);
            setError('Invalid Start Date.');
            return;
        }

        try {
            await axios.delete('http://localhost:8082/user/api/tv-service', {
                params: { availedServiceId: service.serviceId, startDate: formattedDate.toISOString().split('T')[0] },
                withCredentials: true
            });

            // Show success modal after successful termination
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error('Error terminating TV service:', err);
            setError('Failed to terminate TV service.');
        }
    };

    return (
        <div className='feedback'>
            <h2>Provide Feedback for {service.tvService?.serviceName || 'Loading...'}</h2>
            <form onSubmit={handleSubmit}>
                <textarea value={feedback} onChange={handleFeedbackChange} placeholder="Enter feedback" />
                <button type="submit">Submit Feedback</button>
                {error && <p className="error-message">{error}</p>}
            </form>

            {/* Custom Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Action</h3>
                        <p>Do you want to submit feedback and terminate the service?</p>
                        <button onClick={handleConfirm}>Yes</button>
                        <button onClick={() => setIsConfirmModalOpen(false)}>No</button>
                    </div>
                </div>
            )}

            {/* Custom Alert Modal */}
            {isAlertOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Notification</h3>
                        <p>{alertMessage}</p>
                        <button onClick={() => setIsAlertOpen(false)}>OK</button>
                    </div>
                </div>
            )}

            {/* Custom Success Modal */}
            {isSuccessModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Success</h3>
                        <p>Feedback submitted successfully, and the service has been terminated.</p>
                        <button onClick={() => {
                            setIsSuccessModalOpen(false);
                            navigate('/user/services');
                        }}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TvFeedback;
