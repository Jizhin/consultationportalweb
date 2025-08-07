// MyPrescriptions.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './MyPrescriptions.css';

function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get('/prescriptions/patient/');
      setPrescriptions(res.data);
    } catch {
      alert('Failed to load prescriptions.');
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="prescriptions-page">
      <div className="prescriptions-container">
        <h2>My Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          prescriptions.map((pres, idx) => (
            <div key={idx} className="prescription-card">
              <p><strong>Doctor:</strong> {pres.doctor_name}</p>
              <p><strong>Date:</strong> {pres.date}</p>
              <p><strong>Notes:</strong> {pres.notes}</p>
              {pres.pdf && (
                <a href={pres.pdf} target="_blank" rel="noreferrer">
                  Download PDF
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyPrescriptions;
