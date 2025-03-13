// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';


const LINK=import.meta.env.VITE_API_URL;
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Define validation schema with Zod
  const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
  });

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach(err => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      const response = await fetch(LINK +'/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success animation before redirect
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setServerError(data.error || 'Registration failed');
      }
    } catch (err) {
      setServerError('Server connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center transition duration-300">
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-lg text-white">
        <div className="text-center mb-6">
          <a href='/' className="text-5xl font-bold mb-2 font-kkgghhtt">membrain</a>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
        </div>
        
        {serverError && 
          <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {serverError}
          </div>
        }
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-white font-medium">USERNAME</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full p-4 bg-black border ${errors.username ? 'border-red-500' : 'border-white'} rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300 transform focus:scale-105`}
                placeholder="Enter your username"
              />
              {errors.username && 
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              }
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white font-medium">EMAIL</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-4 bg-black border ${errors.email ? 'border-red-500' : 'border-white'} rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300 transform focus:scale-105`}
                placeholder="Enter your email"
              />
              {errors.email && 
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              }
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-white font-medium">PASSWORD</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-4 bg-black border ${errors.password ? 'border-red-500' : 'border-white'} rounded-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white transition duration-300 transform focus:scale-105`}
                placeholder="Create a password"
              />
              {errors.password && 
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              }
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-white text-black p-4 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : 'SIGN UP'}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-white text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:underline transition-colors duration-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
