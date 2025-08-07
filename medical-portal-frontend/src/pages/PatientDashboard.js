// PatientDashboard.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './PatientDashboard.css';

function PatientDashboard() {
  const [profile, setProfile] = useState({});

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="patient-dashboard">
      <div className="dashboard-card">
        <h2>Welcome, {profile.username}</h2>

        <div className="profile-info">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>

        <div className="quick-links">
          <a href="/appointments">My Appointments</a>
          <a href="/upload-report">Upload Reports</a>
          <a href="/my-prescriptions">My Prescriptions</a>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
