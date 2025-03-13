// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [aiPersonality, setAIPersonality] = useState('professional'); // default value
  const LINK=import.meta.env.VITE_API_URL;
  useEffect(() => {
    const storedPersonality = localStorage.getItem('aiPersonality');
    if (storedPersonality) {
      setAIPersonality(storedPersonality);
    }
  }, []);

  const handlePersonalityChange = (e) => {
    const selected = e.target.value;
    setAIPersonality(selected);
    localStorage.setItem('aiPersonality', selected);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="mb-4">
          <label htmlFor="aiPersonality" className="block text-lg font-medium mb-2">
            AI Personality
          </label>
          <select
            id="aiPersonality"
            value={aiPersonality}
            onChange={handlePersonalityChange}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
        <p className="text-gray-400">
          This setting customizes the tone of AI-generated summaries and insights.
        </p>
      </div>
    </div>
  );
};

export default Settings;
