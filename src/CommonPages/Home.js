import React from 'react';
import './Styling_Components/App.css';
import { Link,Outlet } from 'react-router-dom';
import TelstraLogo from '../Images/Telstra.jfif';
import BackgroundImage from '../Images/Background.jpg';
function Home()
{
  const backgroundStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh', // Ensure the background covers the full viewport height
    width: '100vw',  // Ensure the background covers the full viewport width
};
    return(
        <>
        <div style={backgroundStyle}>
        <nav class="navbar">
          <div className='logo'>
        <img src={TelstraLogo} alt="Logo" className="navbar-image" />
        <h1 class="title">Telcoservice Provisioning</h1>
        </div>
        <ul class="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Create an account</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
      </div>
      </>
    )
}
export default Home;