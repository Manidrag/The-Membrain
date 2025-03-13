// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LINK=import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate               = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(LINK +'/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center transition duration-300">
    <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg text-white">
      <div className="flex justify-center mb-8">
        <a href='/' className="text-5xl font-bold">membrain</a>
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-black border border-white rounded focus:outline-none focus:ring-2 focus:ring-white transition duration-300 placeholder-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-black border border-white rounded focus:outline-none focus:ring-2 focus:ring-white transition duration-300 placeholder-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-black p-4 rounded hover:bg-gray-300 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-white hover:underline transition duration-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
