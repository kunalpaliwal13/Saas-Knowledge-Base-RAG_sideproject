'use client';
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username) {
      setError('Username is required');
      return;
    }

    try {
      // Check or create user in DB
      const response = await axios.post('http://localhost:8000/api/login', {
        username,
        password
      });

      const { userId } = response.data;

      // Save to localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);

      alert('Logged in successfully!');
      // Redirect or navigate...
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('Login failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />
      <input
        type="text"
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
