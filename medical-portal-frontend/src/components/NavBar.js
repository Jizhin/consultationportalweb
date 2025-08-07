import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function Navbar() {
  const navigate = useNavigate();
  const access = localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Medical Portal</h1>
      <div className="navbar-links">
        {access ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/prescriptions">Prescriptions</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;


// Add to App.js
// import Navbar at top
// import './pages/Auth.css'; // optional shared style

// In return(), place <Navbar /> before <Routes />
