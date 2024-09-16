import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling_Components/Feedback.css'; // Import the CSS file for styling
import userImage from "../Images/User.jfif";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState({ internetServiceFeedbacks: [], tvServiceFeedbacks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentInternetIndex, setCurrentInternetIndex] = useState(0);
  const [currentTvIndex, setCurrentTvIndex] = useState(0);
  const [popupFeedback, setPopupFeedback] = useState(null);
  const [popupServiceName, setPopupServiceName] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8082/admin/api/feedbacks', { withCredentials: true });
        setFeedbacks(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleNextInternet = () => {
    setCurrentInternetIndex(prevIndex => (feedbacks.internetServiceFeedbacks.length === 0 ? 0 : (prevIndex + 1) % feedbacks.internetServiceFeedbacks.length));
  };

  const handlePreviousInternet = () => {
    setCurrentInternetIndex(prevIndex => (feedbacks.internetServiceFeedbacks.length === 0 ? 0 : (prevIndex - 1 + feedbacks.internetServiceFeedbacks.length) % feedbacks.internetServiceFeedbacks.length));
  };

  const handleNextTv = () => {
    setCurrentTvIndex(prevIndex => (feedbacks.tvServiceFeedbacks.length === 0 ? 0 : (prevIndex + 1) % feedbacks.tvServiceFeedbacks.length));
  };

  const handlePreviousTv = () => {
    setCurrentTvIndex(prevIndex => (feedbacks.tvServiceFeedbacks.length === 0 ? 0 : (prevIndex - 1 + feedbacks.tvServiceFeedbacks.length) % feedbacks.tvServiceFeedbacks.length));
  };

  const openPopup = (feedback, serviceName) => {
    setPopupFeedback(feedback);
    setPopupServiceName(serviceName);
  };

  const closePopup = () => {
    setPopupFeedback(null);
    setPopupServiceName(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Internet Feedback Slider */}
      <div id="internet-feedback">
        <h2>Internet Service Feedbacks</h2>
        {feedbacks.internetServiceFeedbacks.length === 0 ? (
          <div>No Internet Service Feedbacks available.</div>
        ) : (
          <div className="slider-container">
            <button className="control-button" onClick={handlePreviousInternet}>Previous</button>
            <div className="feedback-slider">
              <div className="feedback-wrapper" style={{ transform: `translateX(-${currentInternetIndex * 100}%)` }}>
                {feedbacks.internetServiceFeedbacks.map((feedback, index) => (
                  <div key={feedback.feedbackId} className="feedback-item">
                    <div className="feedback-summary">
                      <div className="user-info">
                        <img src={userImage} alt={`${feedback.username}'s avatar`} className="user-image" />
                        <p className="username"><strong>{feedback.username}</strong></p>
                      </div>
                      <p><strong>Service Name:</strong> {feedback.internetService ? feedback.internetService.serviceName : 'N/A'}</p>
                      <p>{feedback.feedback}</p>
                      <button onClick={() => openPopup(feedback, feedback.internetService ? feedback.internetService.serviceName : 'N/A')}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="control-button" onClick={handleNextInternet}>Next</button>
          </div>
        )}
      </div>

      {/* TV Feedback Slider */}
      <div id="tv-feedback">
        <h2>TV Service Feedbacks</h2>
        {feedbacks.tvServiceFeedbacks.length === 0 ? (
          <div>No TV Service Feedbacks available.</div>
        ) : (
          <div className="slider-container">
            <button className="control-button" onClick={handlePreviousTv}>Previous</button>
            <div className="feedback-slider">
              <div className="feedback-wrapper" style={{ transform: `translateX(-${currentTvIndex * 100}%)` }}>
                {feedbacks.tvServiceFeedbacks.map((feedback, index) => (
                  <div key={feedback.feedbackId} className="feedback-item">
                    <div className="feedback-summary">
                      <div className="user-info">
                        <img src={userImage} alt={`${feedback.username}'s avatar`} className="user-image" />
                        <p className="username"><strong>{feedback.username}</strong></p>
                      </div>
                      <p><strong>Service Name:</strong> {feedback.tvService ? feedback.tvService.serviceName : 'N/A'}</p>
                      <p>{feedback.feedback}</p>
                      <button onClick={() => openPopup(feedback, feedback.tvService ? feedback.tvService.serviceName : 'N/A')}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="control-button" onClick={handleNextTv}>Next</button>
          </div>
        )}
      </div>

      {/* Popup for feedback details */}
      {popupFeedback && (
        <div className="feedback-popup active">
          <div className="popup-content">
            <button className="popup-close" onClick={closePopup}>Close</button>
            <h2>Feedback Details</h2>
            <p><strong>Service Name:</strong> {popupServiceName}</p>
            <p><strong>Feedback:</strong> {popupFeedback.feedback}</p>
            <p><strong>Username:</strong> {popupFeedback.username}</p>
            <p><strong>Date:</strong> {new Date(popupFeedback.createdAt).toLocaleDateString()}</p>
            {popupFeedback.internetService && (
              <>
                <p><strong>Description:</strong> {popupFeedback.internetService.description}</p>
                <p><strong>Type:</strong> {popupFeedback.internetService.serviceType}</p>
                <p><strong>Speed (Download/Upload):</strong> {popupFeedback.internetService.serviceDownloadSpeed}/{popupFeedback.internetService.serviceUploadSpeed} Mbps</p>
                <p><strong>Cost:</strong> Rs.{popupFeedback.internetService.cost}</p>
              </>
            )}
            {popupFeedback.tvService && (
              <>
                <p><strong>Description:</strong> {popupFeedback.tvService.description}</p>
                <p><strong>Type:</strong> {popupFeedback.tvService.serviceType}</p>
                <p><strong>Cost:</strong> Rs.{popupFeedback.tvService.cost}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
