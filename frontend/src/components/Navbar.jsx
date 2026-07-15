import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let themeIcon = '☀️';
  if (theme === 'light') {
    themeIcon = '🌙';
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Task Manager</span>
      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {themeIcon}
        </button>

        {user && (
          <span className="navbar-user">Hi, {user.username}</span>
        )}

        {user && (
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;