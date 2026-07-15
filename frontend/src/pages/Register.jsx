import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (err) => {
    if (!err.response || !err.response.data) {
      return 'Registration failed.';
    }

    const data = err.response.data;
    const fieldNames = Object.keys(data);

    if (fieldNames.length === 0) {
      return 'Registration failed.';
    }

    const firstFieldName = fieldNames[0];
    const firstFieldValue = data[firstFieldName];

    if (Array.isArray(firstFieldValue)) {
      return firstFieldValue[0];
    }

    if (firstFieldValue) {
      return firstFieldValue;
    }

    return 'Registration failed.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, email, password, password2);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }

    setLoading(false);
  };

  let buttonText = 'Register';
  if (loading) {
    buttonText = 'Creating account...';
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="auth-subtitle">Start organizing your tasks</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {buttonText}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;