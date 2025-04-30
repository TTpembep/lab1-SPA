import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    if (localStorage.getItem('isAuthenticated')) {
      onLogin();
      navigate('/home');
    }
  }, [onLogin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin') {
      localStorage.setItem('isAuthenticated', 'true');
      onLogin();
      navigate('/home');
    } else {
      alert('Неверный логин или пароль.');
    }
  };

  return (
    <div className="login-container">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;