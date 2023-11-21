import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; 
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const requestBody = {
        username: username,
        password: password,
      };

      const response = await axios.post('https://stg.dhunjam.in/account/admin/login', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response Status:', response.status);
      console.log('Response:', response.data);

      if (response.data.status === 200) {
        console.log('Login successful');
        const loginId = response.data.data.id
        
        setIsLoggedIn(true);
        navigate(`/Dashboard/${loginId}`);
      } else {
        console.log('Login failed');
        setError('Invalid username or password');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error during login:', error.response);

      // Check if the error response contains more details
      if (error.response && error.response.data) {
        console.error('Error Details:', error.response.data);
      }

      setError('An error occurred during login');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Venue Admin Login</h1>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="password-input-container">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="password-toggle-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <button id="loginButton" className="save-button" onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
      <button type="button" id="newRegistrationButton">
        New Registration?
      </button>
      {error && <p>{error}</p>}
      {isLoggedIn && <p>Login successful!</p>}
    </form>
  );
};

export default LoginForm;
