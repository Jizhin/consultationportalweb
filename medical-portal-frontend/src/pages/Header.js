import React, { useEffect, useState } from 'react';
import './Header.css';
import API from '../services/api';

const Header = () => {
  const [role, setRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
        setRole(storedRole);
    }
}, []);

  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     try {
  //       const res = await API.get('/users/profile/');
  //       setRole(res.data.role);
  //     } catch (error) {
  //       console.error('Failed to fetch user profile:', error);
  //     }
  //   };
  //   fetchUserRole();
  // }, []);

  const handleLogout = async () => {
    try {
      await API.post('/users/logout/');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-container">
          <h1 className="logo-text">Medical Portal</h1>
        </div>
        <nav className={`main-nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    {role === 'doctor' && <a href="/doctor-dashboard">Home</a>}
          {role === 'patient' && <a href="/dashboard">Home</a>}
          {role === 'doctor' && <a href="/appointments">Appointments</a>}
          {role === 'patient' && <a href="/book">Book Appointments</a>}
          <a href="/reports">Reports</a>
          {role === 'doctor' && <a href="/prescribe">Prescriptions</a>}
          {role === 'patient' && <a href="/my-prescriptions">My Prescriptions</a>}
          <span className="logout-button" onClick={handleLogout}>Logout</span>
        </nav>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Header;