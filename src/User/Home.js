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
import FastInternetImage from '../Images/FastInternet.jpg'; // Add image paths for slides
import UpdateImage from '../Images/Update.jfif';
import TvPlans from '../Images/TvPlans.jfif';
import Compare from '../Images/Compare.jpg'
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

  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      localStorage.setItem('lastVisitedPage', location.pathname);
    }
  }, [location]);

  useEffect(() => {
    const lastPage = localStorage.getItem('lastVisitedPage');
    if (lastPage && lastPage !== location.pathname) {
      navigate(lastPage);
    }
  }, [location, navigate]);

  const handleServiceClick = () => {
    navigate('/user/home');
  };

  const handleViewMoreClick = () => {
    navigate('/user/home');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
              <p>Get access to the best TV plans with a wide variety of channels, including basic,standerd content and premium options.</p>
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

        <div className='services'>
          <h2>Our Services</h2>
          <InternetServicesList onServiceClick={handleServiceClick} onViewMoreClick={handleViewMoreClick}/>
          <TvServicesList onServiceClick={handleServiceClick} onViewMoreClick={handleViewMoreClick}/> 
        </div>
<div className='how'>
  <div><h2 className='titleHow'>Ready to subscribe!! Here's how?</h2></div>
        <div class="flowchart">
  <div class="step">
    <img src={Explore} alt="Choose a Plan" class="step-image" />
    <h3>Step 1: Explore Our Plans</h3>
    <p>Browse through our various plans to find one that suits your needs. Each plan comes with detailed information about the features and benefits.</p>
  </div>
  <div class="arrow">→</div>
  <div class="step">
    <img src={Compare} alt="Fill in Details" class="step-image" />
    <h3>Step 2: Compare and Select</h3>
    <p>Compare the different plans based on your requirements and budget. You can check the plan details, pricing, and included services to make an informed decision.</p>
  </div>
  <div class="arrow">→</div>
  <div class="step">
    <img src={Login} alt="Sign up or Login" class="step-image" />
    <h3>Step 3:  Sign Up or Log In</h3>
    <p>To subscribe to a plan, you'll need to sign up or log in to your account. If you don't have an account, create one using our registration form.</p>
  </div>
  <div class="arrow">→</div>
  <div class="step">
    <img src={Choose}alt="Choose plan" class="step-image" />
    <h3>Step 4: Choose Your Plan</h3>
    <p>After logging in, navigate to the plans section and select the plan you want to subscribe to. Follow the on-screen instructions to complete your subscription.</p>
  </div>
  <div class="arrow">→</div>
  <div class="step">
    <img src={Request}alt="Send Request" class="step-image" />
    <h3>Step 5: Send Request</h3>
    <p>On choosing a plan that suits you on clicking subscrive request is sent to admin and plan activates once admin approves it.</p>
  </div>
  <div class="arrow">→</div>
  <div class="step">
    <img src={Confirmation} alt="Confirm Subscription" class="step-image" />
    <h3>Step 6: Confirmation</h3>
    <p>You will receive a confirmation email with the details of your subscription. If you have any questions or need assistance, feel free to contact our support team.</p>
  </div>
</div>
</div>


        <div className="why-choose-us">
          <h2>Why Choose Us?</h2>
          <div className="reasons-row">
            <div className="reason">
              <img src={Services} alt="Fast Internet" className="reason-image" />
              <h3>Fast Internet and Vast Range of Services</h3>
              <p>Experience blazing fast internet with speeds that keep you connected. We provide various range of services.</p>
            </div>
            <div className="reason">
              <img src={UpgradeDowngrade} alt="Can Upgrade/Downgrade" className="reason-image" />
              <h3>Upgrade and Downgrade Plans</h3>
              <p>Our plans are designed to be cost-effective and to meet your needs we provide various types of upgradation or degradation options.</p>
            </div>
            <div className="reason">
              <img src={Terminate} alt="Can Terminate" className="reason-image" />
              <h3>Terminate Plan</h3>
              <p>We're here for you around the clock to terminate the existing plan if you want to.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;