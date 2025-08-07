import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './DoctorDashboard.css';
import { FaUserCircle, FaStethoscope, FaCalendarAlt, FaPlus, FaSave } from 'react-icons/fa';

function DoctorDashboard() {
  const [profile, setProfile] = useState({});
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({ weekday: '', start_time: '', end_time: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const profileRes = await API.get('/users/profile/');
      setProfile(profileRes.data);
      setSelectedSpecialization(profileRes.data.specialization_id || '');

      const specRes = await API.get('/appointments/specializations/');
      setSpecializations(specRes.data);

      const availRes = await API.get('/appointments/availability/');
      setAvailability(availRes.data);
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSpecializationUpdate = async () => {
    try {
      await API.post('/appointments/set-specialization/', {
        specialization_id: selectedSpecialization
      });
      alert("Specialization updated successfully!");
      fetchDashboardData();
    } catch (err) {
      console.error("Error updating specialization:", err);
      alert("Failed to update specialization.");
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments/availability/', newSlot);
      setNewSlot({ weekday: '', start_time: '', end_time: '' });
      fetchDashboardData();
      alert("Availability slot added successfully!");
    } catch (err) {
      console.error("Error adding availability slot:", err);
      alert("Failed to add availability slot.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <div className="doctor-dashboard-v3">
        {/* The main dashboard content without the header */}
        <div className="dashboard-content">
          {/* Combined Profile and Specialization Card */}
          <div className="card-v3 profile-specialization-card">
            <div className="card-section">
              <div className="card-header">
                <FaUserCircle className="card-icon" />
                <h2>Profile Details</h2>
              </div>
              <div className="card-body">
                <p><strong>Username:</strong> {profile.username || 'N/A'}</p>
                <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
                <p><strong>Role:</strong> {profile.role || 'N/A'}</p>
              </div>
            </div>
            
            <div className="divider"></div>

            <div className="card-section">
              <div className="card-header">
                <FaStethoscope className="card-icon" />
                <h2>Update Specialization</h2>
              </div>
              <div className="card-body form-group">
                <div className="input-group">
                  <select value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}>
                    <option value="">-- Select Specialization --</option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                  <button onClick={handleSpecializationUpdate}><FaSave /> Update</button>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="card-v3 availability-card">
            <div className="card-header">
              <FaCalendarAlt className="card-icon" />
              <h2>Manage Availability</h2>
            </div>

            <div className="card-body">
              <form onSubmit={handleAddSlot} className="availability-form-v3">
                <select
                  name="weekday"
                  value={newSlot.weekday}
                  onChange={(e) => setNewSlot({ ...newSlot, weekday: e.target.value })}
                  required
                >
                  <option value="">Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="time-inputs">
                  <input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    required
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    required
                  />
                </div>
                <button type="submit"><FaPlus /> Add Slot</button>
              </form>

              <div className="availability-table-container">
                {availability.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availability.map((slot, idx) => (
                        <tr key={idx}>
                          <td>{slot.weekday}</td>
                          <td>{slot.start_time}</td>
                          <td>{slot.end_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-availability">No availability slots added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;
