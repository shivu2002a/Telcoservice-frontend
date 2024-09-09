import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './CommonPages/App.js';
import UpdateTvServices from './AdminPages/UpdateTvServices.js';
import UpdateInternetServices from './AdminPages/UpdateInternetServices.js';
import TerminateServices from './AdminPages/TerminateServices.js';
import PendingRequests from './AdminPages/PendingRequests.js';
import RequestsValidation from './AdminPages/RequestsValidation.js';
import ManageServices from './AdminPages/ManageServices.js';
import Login from './CommonPages/Login.js';
import Home from './CommonPages/Home.js';
import AdminApp from './AdminPages/AdminApp.js';
import AdminHome from './AdminPages/AdminHome.js';
import AddTvService from './AdminPages/AddTvService.js';
import AddInternetService from './AdminPages/AddInternetService.js';
import ProtectedRoute from './CommonPages/ProtectedRoute.js';
import SignUp from './CommonPages/SignUp.js';
import Logout from './CommonPages/Logout.js';

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status from localStorage when app loads
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route path="signup" element={<SignUp/>}/>
        <Route path="logout" element={<Logout setIsAdmin={setIsAdmin} />} />
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
          <Route path="addTvService" element={<AddTvService/>}/>
          <Route path="addInternetService" element={<AddInternetService/>}/>
          <Route path="updateInternet" element={<UpdateInternetServices />} />
          <Route path="updateTv" element={<UpdateTvServices />} />
          <Route path="terminate" element={<TerminateServices />} />
          <Route path="requests" element={<PendingRequests />} />
          <Route path="validation" element={<RequestsValidation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
