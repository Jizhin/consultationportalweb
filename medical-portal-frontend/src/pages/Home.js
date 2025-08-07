import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Home.css';

function Home() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    const userRole = localStorage.getItem('role');
    if (token && userRole) {
      setRole(userRole);
    } else {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  const goToDashboard = () => {
    if (role === 'doctor') navigate('/doctor-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'patient') navigate('/dashboard');
    else navigate('/');
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome to the Medical Consultation Portal</h1>
        {role ? (
          <>
            <p>You are logged in as: <strong>{role}</strong></p>
            <button onClick={goToDashboard}>Go to Dashboard</button>
          </>
        ) : (
          <p>Please log in to continue.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
