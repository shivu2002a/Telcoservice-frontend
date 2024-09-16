import React, { useEffect, useState } from 'react';
import MostAvailedServices from './MostAvailedServices';
import RequestsHistory from './RequestsHistory';
import Feedback from './Feedback';
import './Styling_Components/AdminDashboard.css';

function AdminDashboard() {
  const [highlightedId, setHighlightedId] = useState(null);
  useEffect(() => {
    if (highlightedId) {
      const section = document.getElementById(highlightedId);
      if (section) {
        // Scroll to the section
        section.scrollIntoView({ behavior: 'smooth' });

        // Add highlight class
        section.classList.add('highlight');

        // Remove highlight class after 10 seconds
        const timer = setTimeout(() => {
          section.classList.remove('highlight');
        }, 1500); //1.5 sec

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
      }
    }
  }, [highlightedId]);

  const handleNavClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    const targetId = e.target.getAttribute('href').substring(1); // Get target section ID
    setHighlightedId(targetId); // Set the highlighted section ID
  };

  return (
    <div className="admin-home-container">
      <nav className="dashboard-navbar">
        <ul>
          <li><a href="#top-navbar">Back to Top</a></li>
          <li><a href="#internet" onClick={handleNavClick}>Most Availed Internet Services</a></li>
          <li><a href="#tv" onClick={handleNavClick}>Most Availed TV Services</a></li>
          <li><a href="#requests-history" onClick={handleNavClick}>Requests History</a></li>
          <li><a href="#internet-feedback" onClick={handleNavClick}>Internet Services Feedback</a></li>
          <li><a href="#tv-feedback" onClick={handleNavClick}>TV Services Feedback</a></li>
        </ul>
      </nav>

      <div id="most-availed" className="section">
        <MostAvailedServices />
      </div>
      
      <div id="requests-history" className="section">
        <h1><strong>Requests History</strong> </h1>
        <RequestsHistory />
      </div>
      
      <div id="feedback" className="section">
        <h1><strong>User Feedbacks</strong></h1>
        <Feedback />
      </div>
    </div>
  );
}

export default AdminDashboard;
