import { Outlet, Link } from "react-router-dom";

function AdminApp(){
  return (
    <>
      <nav class="navbar">
      <h1 class="title">Telcoservice Provisioning</h1>
        <ul class="nav-links">
          
        <li>
            <Link to="/admin/home">Home</Link>
          </li>
          <li>
            <Link to="/admin/manageServices">Manage Services</Link>
          </li>
          <li>
            <Link to="/admin/requests">Manage Requests</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
      </>
  );
};

export default AdminApp;
