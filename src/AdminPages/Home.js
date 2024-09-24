import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import './Styling_Components/App.css';
import TelstraLogo from '../Images/Telstra.jfif';
import BackgroundImage from '../Images/Background.jpg';
import AutoLogout from '../CommonPages/AutoLogout';
import Services from '../Images/Services.jfif';
import UpgradeDowngrade from '../Images/UpgradeDowngrade.jfif';
import Terminate from '../Images/Terminate.jpg';
import TvServicesList from './TvServicesList'; 
import InternetServicesList from './InternetServicesList';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import FastInternetImage from '../Images/FastInternet.jpg';
import UpdateImage from '../Images/Update.jfif';
import TvPlans from '../Images/TvPlans.jfif';
import Compare from '../Images/Compare.jpg';
import Choose from '../Images/Choose.jfif';
import Login from '../Images/Login.jfif';
import Explore from '../Images/Explore.jfif';
import Confirmation from '../Images/Confirmation.jpg';
import Request from '../Images/Request.jfif';

function Home() {
  const backgroundStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100%',
    width: '100%',
  };

  const location = useLocation();
  const navigate = useNavigate();

  // Store last visited page
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  // Redirect to last visited page
  useEffect(() => {
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage && lastPage !== location.pathname) {
      navigate(lastPage);
    }
  }, [location, navigate]);

  const handleServiceClick = () => {
    navigate('/admin/manageServices');
  };

  const handleViewMoreClick = () => {
    navigate('/admin/manageServices');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: false,  // Ensure lazy load is disabled
    arrows:false,
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    position: 'relative',
    bottom: '0',
    width: '100%',
  };

  const logoStyle = {
    height: '30px', // Smaller icon size
    marginRight: '10px', // Add spacing between the logo and email
  };

  const emailStyle = {
    fontSize: '20px',
    color: '#333',
  };

  return (
    <>
      <AutoLogout />
      <div style={backgroundStyle} className='background'>
        <Outlet />

        {/* Sliding Cards Section */}
        <Slider {...sliderSettings} className="slider-container">
          <div className="slider-card">
            <img src={FastInternetImage} alt="Fast Internet" className="slider-image" />
            <div className="slider-content">
              <h3>Enjoy Blazing Fast Internet</h3>
              <p>Experience unparalleled internet speed and reliability with our service plans tailored to meet your needs.</p>
            </div>
          </div>
          <div className="slider-card">
            <img src={TvPlans} alt="TV Plans" className="slider-image" />
            <div className="slider-content">
              <h3>Flexible TV Plans</h3>
              <p>Get access to the best TV plans with a wide variety of channels, including basic, standard content, and premium options.</p>
            </div>
          </div>
          <div className="slider-card">
            <img src={UpdateImage} alt="Upgrade" className="slider-image" />
            <div className="slider-content">
              <h3>Upgrade or Downgrade Anytime</h3>
              <p>Our plans are flexible, and you can upgrade or downgrade them as per your convenience, without any hassle.</p>
            </div>
          </div>
        </Slider>

        {/* Services Section */}
        <div className='services'>
          <h2>Our Services</h2>
          <InternetServicesList onServiceClick={handleServiceClick} onViewMoreClick={handleViewMoreClick} />
          <TvServicesList onServiceClick={handleServiceClick} onViewMoreClick={handleViewMoreClick} />
        </div>

        {/* How To Subscribe Flowchart Section */}
        <div className='how'>
          <h2 className='titleHow'>Ready to subscribe? Here's how:</h2>
          <div className="flowchart">
            <div className="step">
              <img src={Explore} alt="Explore Plans" className="step-image" />
              <h3>Step 1: Explore Our Plans</h3>
              <p>Browse through our various plans to find one that suits your needs. Each plan comes with detailed information about the features and benefits.</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <img src={Compare} alt="Compare Plans" className="step-image" />
              <h3>Step 2: Compare and Select</h3>
              <p>Compare the different plans based on your requirements and budget. Check the plan details, pricing, and included services to make an informed decision.</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <img src={Login} alt="Sign Up or Log In" className="step-image" />
              <h3>Step 3: Sign Up or Log In</h3>
              <p>Create an account or log in if you already have one. You'll need to do this before subscribing to a plan.</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <img src={Choose} alt="Choose Plan" className="step-image" />
              <h3>Step 4: Choose Your Plan</h3>
              <p>After logging in, navigate to the plans section and select the plan you want to subscribe to.</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <img src={Request} alt="Send Request" className="step-image" />
              <h3>Step 5: Send Request</h3>
              <p>Click 'Subscribe' to send a request to the admin. Once approved, your plan will be activated.</p>
            </div>
            <div className="arrow">→</div>
            <div className="step">
              <img src={Confirmation} alt="Confirm Subscription" className="step-image" />
              <h3>Step 6: Confirmation</h3>
              <p>You will receive a confirmation email with your subscription details. Contact support if you need any assistance.</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us">
          <h2>Why Choose Us?</h2>
          <div className="reasons-row">
            <div className="reason">
              <img src={Services} alt="Fast Internet" className="reason-image" />
              <h3>Fast Internet and a Vast Range of Services</h3>
              <p>Experience blazing fast internet speeds. We offer a variety of services tailored to your needs.</p>
            </div>
            <div className="reason">
              <img src={UpgradeDowngrade} alt="Upgrade/Downgrade Plans" className="reason-image" />
              <h3>Upgrade and Downgrade Plans</h3>
              <p>Our flexible plans allow you to upgrade or downgrade anytime, ensuring you get the best value.</p>
            </div>
            <div className="reason">
              <img src={Terminate} alt="Terminate Plan" className="reason-image" />
              <h3>Terminate Plan</h3>
              <p>We offer 24/7 support for plan termination if needed.</p>
            </div>
          </div>
        </div>
        <footer style={footerStyle}>
          <img src={TelstraLogo} alt="Logo" style={logoStyle} />
          <span style={emailStyle}>© 2024 Telecomservice Provisioning. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}

export default React.memo(Home);
