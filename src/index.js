import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './CommonPages/App.js';
import ProtectedRoute from './CommonPages/ProtectedRoute.js';
import SignUp from './CommonPages/SignUp.js';
import Logout from './CommonPages/Logout.js';
import Login from './CommonPages/Login.js';
import Home from './CommonPages/Home.js';
import UpdateTvServices from './AdminPages/UpdateTvServices.js';
import UpdateInternetServices from './AdminPages/UpdateInternetServices.js';
import PendingRequests from './AdminPages/PendingRequests.js';
import RequestsValidation from './AdminPages/RequestsValidation.js';
import ManageServices from './AdminPages/ManageServices.js';
import AdminApp from './AdminPages/AdminApp.js';
import AdminHome from './AdminPages/AdminHome.js';
import AddTvService from './AdminPages/AddTvService.js';
import AddInternetService from './AdminPages/AddInternetService.js';
import AdminDashboard from './AdminPages/AdminDashboard.js';
import UserDashboard from './User/UserDashboard';
import SubscribedServices from './User/SubscribedServices';
import Services from './User/Services';
import ModifyInternetSubscription from './User/ModifyInternetSubscription';
import ModifyTvSubscription from './User/ModifyTvSubscription';
import TvFeedback from './User/TvFeedback.js';
import InternetFeedback from './User/InternetFeedback.js';
import PendingRequestStatus from './User/PendingRequestStatus.js';

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);

  // Check admin status from localStorage when app loads
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  // Check user status from localStorage when app loads
  useEffect(() => {
    const userStatus = localStorage.getItem('isUser') === 'true';
    setIsUser(userStatus);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login setIsAdmin={setIsAdmin} setIsUser={setIsUser} />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="logout" element={<Logout setIsAdmin={setIsAdmin} setIsUser={setIsUser} />} />
        {/* Protected admin routes - grouped under /admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdmin={isAdmin}>
              <AdminApp />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<AdminHome />} />
          <Route path="manageServices" element={<ManageServices />} />
          <Route path="addTvService" element={<AddTvService />} />
          <Route path="addInternetService" element={<AddInternetService />} />
          <Route path="updateInternet" element={<UpdateInternetServices />} />
          <Route path="updateTv" element={<UpdateTvServices />} />
          <Route path="requests" element={<PendingRequests />} />
          <Route path="validation" element={<RequestsValidation />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        {/* Protected user routes - grouped under /user */}
        <Route
          path="/user"
          element={
            <ProtectedRoute isUser={isUser}>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="services" element={<Services />} />
          <Route path="subscribed-services" element={<SubscribedServices />} />
          <Route path="modify-internet-subscription" element={<ModifyInternetSubscription />} />
          <Route path="modify-tv-subscription" element={<ModifyTvSubscription />} />
          <Route path="tv-feedback" element={<TvFeedback/>}/>
          <Route path="internet-feedback" element={<InternetFeedback/>}/>
          <Route path="pending-requests" element={<PendingRequestStatus/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
