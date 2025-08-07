// DoctorAppointments.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './DoctorAppointments.css'; // Using the provided DoctorDashboard.css for consistent styling

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/appointments/doctor-appointments/');
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await API.post(`/appointments/update-status/${appointmentId}/`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to update status', err);
      setError('Failed to update status. Please try again.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="appointments-section">
      <div className="section-header">
        <h3 className="section-title">Upcoming Appointments</h3>
      </div>
      {appointments.length === 0 ? (
        <p className="no-data-found">No appointments found.</p>
      ) : (
        <div className="appointments-list-container">
          {appointments.map((appt) => (
            <div key={appt.id} className={`appointment-entry ${appt.status}`}>
              <div className="appointment-main-details">
                <div className="patient-info-v4">
                  <span className="patient-name">{appt.patient.username || 'Patient Name'}</span>
                  <span className="patient-contact">{appt.patient.email || appt.patient.phone}</span>
                </div>
                <div className="appointment-datetime-v4">
                  <span className="appointment-date">{appt.date}</span>
                  <span className="appointment-time">{appt.time_slot}</span>
                </div>
              </div>
              <div className="appointment-extra-details">
                <span className={`status-pill ${appt.status}`}>{appt.status}</span>
                <span className="appointment-mode-v4">
                  <i className={`icon-${appt.mode === 'in_person' ? 'pin' : 'video'}`}></i>
                  {appt.mode.replace('_', ' ')}
                </span>
                {appt.status === 'pending' && (
                  <div className="appointment-actions-v4">
                    <button onClick={() => updateStatus(appt.id, 'completed')} className="btn-action-v4 btn-complete-v4">
                      Complete
                    </button>
                    <button onClick={() => updateStatus(appt.id, 'cancelled')} className="btn-action-v4 btn-cancel-v4">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;