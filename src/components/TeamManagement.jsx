// src/pages/TeamManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


const TeamManagement = () => {
  // State to hold the current team and input value.
  const [team, setTeam] = useState("");
  const [inputTeam, setInputTeam] = useState("");
  const navigate = useNavigate();
  const LINK=import.meta.env.VITE_API_URL;

  // On mount, read the stored team from localStorage (if any)
  useEffect(() => {
    const storedTeam = localStorage.getItem("userTeam");
    if (storedTeam) {
      setTeam(storedTeam);
      setInputTeam(storedTeam);
    }
  }, []);

  // Handle the form submission to update the team value.
  const handleSaveTeam = (e) => {
    e.preventDefault();
    if (inputTeam.trim()) {
      localStorage.setItem("userTeam", inputTeam.trim());
      setTeam(inputTeam.trim());
      alert("Team updated successfully!");
    }
  };

  // Option to clear the team.
  const handleClearTeam = () => {
    localStorage.removeItem("userTeam");
    setTeam("");
    setInputTeam("");
    alert("Team cleared.");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Team Management</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <form onSubmit={handleSaveTeam} className="space-y-4">
            <label htmlFor="teamInput" className="block text-lg font-medium">
              {team ? "Change Your Team" : "Join a Team"}
            </label>
            <input
              id="teamInput"
              type="text"
              placeholder="Enter team name or code"
              value={inputTeam}
              onChange={(e) => setInputTeam(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300 text-white placeholder-gray-400"
              required
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
              >
                Save Team
              </button>
              {team && (
                <button
                  type="button"
                  onClick={handleClearTeam}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300"
                >
                  Clear Team
                </button>
              )}
            </div>
          </form>
          {team && (
            <div className="mt-4">
              <p className="text-lg">
                Current Team:{" "}
                <span className="font-bold text-cyan-400">{team}</span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
