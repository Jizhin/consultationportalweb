import React, { useEffect, useState } from 'react';
import API from '../services/api';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const res = await API.get('/appointments/my-appointments/');
    setAppointments(res.data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h2>My Appointments</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Mode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app.id}>
              <td>{app.doctor}</td>
              <td>{app.date}</td>
              <td>{app.time_slot}</td>
              <td>{app.mode}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyAppointments;
