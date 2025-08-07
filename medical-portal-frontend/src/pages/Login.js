import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../services/auth';
import './Login.css'; // Updated CSS import

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('role', data.role);
      
      // Direct navigation to the dashboard based on the role
      if (data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'patient') {
        navigate('/dashboard');
      } else {
        navigate('/'); // Fallback
      }
      
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container"> {/* Updated class name */}
      <form className="login-form" onSubmit={handleLogin}> {/* Updated class name */}
        <h2>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <p>Don&apos;t have an account? <span onClick={() => navigate('/register')}>Register</span></p>
      </form>
    </div>
  );
}

export default Login;