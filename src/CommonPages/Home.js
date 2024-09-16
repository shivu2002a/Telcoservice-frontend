import React from 'react';
import './Styling_Components/App.css';
import { Link,Outlet } from 'react-router-dom';
import TelstraLogo from '../Images/Telstra.jfif';
function Home()
{
    return(
        <>
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
      </>
    )
}
export default Home;