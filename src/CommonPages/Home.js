import React from 'react';
import './Styling_Components/App.css';
import { Link,Outlet } from 'react-router-dom';
function Home()
{
    return(
        <>
        <nav class="navbar">
        <h1 class="title">Telcoservice Provisioning</h1>
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