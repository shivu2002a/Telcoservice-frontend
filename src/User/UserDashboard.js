import React from 'react';
import { Outlet, Link} from 'react-router-dom';
import './Styling_Components/UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <header className="user-dashboard-navbar">
        <nav>
          <ul className="dashboard-nav-links">
            {/* Remove the Services link */}
            <li>
              <Link to="/user/services">Services</Link>
            </li>
            <li>
              <Link to="/user/subscribed-services">My Services</Link>
            </li>
            <li>
              <Link to="/user/pending-requests">My Requests</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Directly render the Services component */}
       
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;


