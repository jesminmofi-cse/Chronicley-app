import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login','https://chronicley-app.onrender.com/api/auth/login'
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = res.data?.token;
      if (!token) throw new Error('Token missing');

      login(token);

      if (res.data.username) {
        localStorage.setItem('username', res.data.username);
      }

      // ✅ ONLY navigation happens here
      navigate('/home', { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back to Chroniclely</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="auth-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="auth-input"
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        Don’t have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
