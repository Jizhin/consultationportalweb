import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './CreatePrescription.css';

function MyAppointmentsWithPrescriptions() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState({});
  const [noteInput, setNoteInput] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [appointmentsRes, prescriptionsRes] = await Promise.all([
        API.get('/appointments/doctor-appointments/'),
        API.get('/prescriptions/my-doctor/'),
      ]);

      setAppointments(appointmentsRes.data);

      const groupedPrescriptions = {};
      prescriptionsRes.data.forEach((pres) => {
        groupedPrescriptions[pres.appointment_id] = pres;
      });
      setPrescriptions(groupedPrescriptions);

      const appointmentsToPrescribe = appointmentsRes.data.filter(
        (appt) => !appt.prescription_added
      );
      if (appointmentsToPrescribe.length > 0) {
        setSelectedAppointmentId(appointmentsToPrescribe[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!noteInput.trim() || !selectedAppointmentId) {
      alert('Please select an appointment and write prescription notes.');
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post('/prescriptions/create/', {
        appointment: selectedAppointmentId,
        notes: noteInput,
      });
      fetchData(); // Re-fetch data to show the new prescription
      setNoteInput('');
    } catch (err) {
      console.error('Error submitting prescription:', err);
      alert('Error submitting prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="prescription-container">
        <div className="message-container">
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescription-container">
        <div className="message-container">
          <p className="error-msg">{error}</p>
        </div>
      </div>
    );
  }

  const appointmentsToPrescribe = appointments.filter((appt) => !appt.prescription_added);
  const completedAppointments = appointments.filter((appt) => appt.prescription_added);
  const selectedAppointment = appointmentsToPrescribe.find(
    (appt) => appt.id === selectedAppointmentId
  );

  const filteredCompletedAppointments = completedAppointments.filter((appt) =>
    appt.patient.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="prescription-container">
      {/* Left Column: Prescription Form */}
      <div className="prescription-form-column">
        <h2 className="form-heading">Create Prescription</h2>

        {appointmentsToPrescribe.length > 0 ? (
          <>
            <div className="appointment-selector">
              <label htmlFor="appointment-select">Select an Appointment:</label>
              <select
                id="appointment-select"
                value={selectedAppointmentId}
                onChange={(e) => setSelectedAppointmentId(e.target.value)}
              >
                {appointmentsToPrescribe.map((appt) => (
                  <option key={appt.id} value={appt.id}>
                    {appt.patient.username} - {formatDate(appt.date)}
                  </option>
                ))}
              </select>
            </div>

            {selectedAppointment && (
              <div className="selected-appointment-details">
                <p>
                  <strong>Patient:</strong> {selectedAppointment.patient.username}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedAppointment.date)}
                </p>
                <p>
                  <strong>Time:</strong> {formatTime(selectedAppointment.time_slot)}
                </p>
                <p>
                  <strong>Mode:</strong> {selectedAppointment.mode}
                </p>
              </div>
            )}

            <div className="notes-input-group">
              <textarea
                placeholder="Write prescription notes here..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !noteInput.trim() || !selectedAppointmentId}
              className="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Prescription'}
            </button>
          </>
        ) : (
          <div className="no-items-message">
            <p>No new prescriptions to add.</p>
          </div>
        )}
      </div>

      {/* Right Column: Prescription History */}
      <div className="history-column">
        <h2 className="history-heading">Prescription History</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredCompletedAppointments.length > 0 ? (
          <ul className="completed-list">
            {filteredCompletedAppointments.map((appt) => {
              const prescription = prescriptions[appt.id];
              return (
                <li className="completed-item" key={appt.id}>
                  <div className="completed-item-header">
                    <h3>{appt.patient.username}</h3>
                    <span>
                      {formatDate(appt.date)} at {formatTime(appt.time_slot)}
                    </span>
                  </div>
                  {prescription ? (
                    <>
                      <p>
                        <strong>Notes:</strong>
                      </p>
                      <div className="notes-display">{prescription.notes}</div>
                      {prescription.pdf && (
                        <a
                          href={prescription.pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="download-link"
                        >
                          Download PDF
                        </a>
                      )}
                    </>
                  ) : (
                    <p>Prescription details not available.</p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-items-message">
            <p>No completed prescriptions match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAppointmentsWithPrescriptions;