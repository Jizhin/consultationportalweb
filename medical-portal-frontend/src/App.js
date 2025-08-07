import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookAppointment from './pages/BookAppointment';
import MyAppointmentsWithPrescriptions from './pages/CreatePrescription';
import UploadReport from './pages/UploadReport';
import MyReports from './pages/MyReports';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Header from './pages/Header';
import DoctorAppointments from './pages/DoctorAppointments';
import MyPrescriptions from './pages/MyPrescriptions';
import PatientDashboard from './pages/PatientDashboard';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/book' element={<ProtectedRoute allowedRoles={['patient']} element={<BookAppointment />} />} />
        {/* <Route path='/appointments' element={<ProtectedRoute allowedRoles={['patient', 'doctor']} element={<MyAppointments />} />} /> */}
        <Route path='/upload-report' element={<ProtectedRoute allowedRoles={['patient']} element={<UploadReport />} />} />
        <Route path='/reports' element={<ProtectedRoute allowedRoles={['patient']} element={<MyReports />} />} />
        <Route path='/doctor-dashboard' element={<ProtectedRoute allowedRoles={['doctor']} element={<DoctorDashboard />} />} />
        <Route path='/admin-dashboard' element={<ProtectedRoute allowedRoles={['patient']} element={<AdminDashboard />} />} />
        <Route
  path="/dashboard"
  element={<ProtectedRoute allowedRoles={['patient']} element={<PatientDashboard />} />}
/>
        <Route
  path="/appointments"
  element={<ProtectedRoute allowedRoles={['doctor']} element={<DoctorAppointments />} />}
/>
<Route
  path="/prescribe"
  element={<ProtectedRoute allowedRoles={['doctor']} element={<MyAppointmentsWithPrescriptions />} />}
/>

<Route
  path="/my-prescriptions"
  element={<ProtectedRoute allowedRoles={['patient']} element={<MyPrescriptions />} />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
