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

    const handleFeedbackChange = (e) => setFeedback(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feedback.trim()) {
            alert('Please enter your feedback.');
            return;
        }

        try {
            await axios.post('http://localhost:8082/user/api/tv-service/feedback', null, {
                params: { availedServiceId: service.serviceId, feedback },
                withCredentials: true
            });

            // Call a separate function to handle service deactivation
            handleServiceDeactivation(service);
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
            window.confirm('Do you want to submit feedback and terminate the service?');
            alert('Feedback submitted successfully and service got terminated successfully!!!');
            console.log('TV service terminated successfully.');
            navigate('/user/services'); // Redirect to My Services page
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
        </div>
    );
};

export default TvFeedback;
