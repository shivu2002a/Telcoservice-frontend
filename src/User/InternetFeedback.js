import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InternetFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { service = {} } = location.state || {};
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');

    const handleFeedbackChange = (e) => setFeedback(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feedback.trim()) {
            alert('Please enter your feedback.');
            return;
        }

        try {
            await axios.post('http://localhost:8082/user/api/internet-service/feedback', null, {
                params: { availedServiceId: service.serviceId, feedback },
                withCredentials: true
            });

            // Call a separate function to handle service deactivation
            await handleServiceDeactivation(service);

        } catch (err) {
            console.error('Error submitting feedback or terminating service:', err);
            setError('Failed to submit feedback or terminate the service.');
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
            await axios.delete('http://localhost:8082/user/api/internet-service', {
                params: { availedServiceId: service.serviceId ,startDate: formattedDate.toISOString().split('T')[0] },
                withCredentials: true
            });
            window.confirm('Do you want to submit feedback and terminate the service?');
            alert('Feedback submitted successfully and service got terminated successfully!!!');
            console.log('Internet service terminated successfully.');
            navigate('/user/services');
        } catch (err) {
            console.error('Error terminating Internet service:', err);
            setError('Failed to terminate Internet service.');
        }
    };

    return (
        <div>
            <h2>Provide Feedback for {service.internetService?.serviceName || 'Loading...'}</h2>
            <form onSubmit={handleSubmit}>
                <textarea value={feedback} onChange={handleFeedbackChange} placeholder="Enter feedback" />
                <button type="submit">Submit Feedback</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default InternetFeedback;
