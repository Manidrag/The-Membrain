"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NoteDetail from '../components/NoteDetails';
import Search from '../components/search';
import { PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef(null);
 
  
  




  const LINK=import.meta.env.VITE_API_URL;
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(LINK +'/protected', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUserData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(LINK +'/notes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch notes');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotes();
  }, []);

  const recentNotes = notes.slice(0, 3);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-bg-primary text-text-primary font-sans transition-all duration-500 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--accent-primary), transparent 8%)`
      }}
    >
      <Sidebar onSearchClick={() => setIsSearchOpen(true)} />
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Mesh grid background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full grid grid-cols-12 grid-rows-12">
          {Array(144).fill().map((_, i) => (
            <div key={i} className="border border-border-light"></div>
          ))}
        </div>
      </div>
      
      {/* Moving gradient orbs */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-accent-primary rounded-full mix-blend-screen filter blur-2xl opacity-5 animate-blob z-0 pointer-events-none"></div>
      <div className="fixed top-1/3 right-1/4 w-72 h-72 bg-accent-secondary rounded-full mix-blend-screen filter blur-2xl opacity-5 animate-blob animation-delay-2000 z-0 pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/3 w-80 h-80 bg-accent-tertiary rounded-full mix-blend-screen filter blur-2xl opacity-5 animate-blob animation-delay-4000 z-0 pointer-events-none"></div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-screen md:ml-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-8 md:ml-16 lg:ml-30 animate-fadeIn relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-clip-text  bg-gradient-to-r from-accent-primary to-accent-secondary">
              MemBrain
            </h1>
          </div>
          
          {userData && (
            <div className="overflow-hidden mb-12 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <p className="text-3xl text-center font-light transform transition-all duration-700 hover:scale-105">
                Welcome, <span className="font-bold bg-clip-text  bg-gradient-to-r from-accent-primary to-accent-secondary">{userData.user.email || userData.user.username}</span>!
              </p>
            </div>
          )}

          {/* Create Note Section */}
          <div className="flex flex-col items-center mb-16 group animate-slideInUp" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/create-note"
              className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full shadow-lg shadow-glow-color hover:shadow-xl transition-all duration-500 transform hover:scale-110 hover:rotate-3"
            >
              <PlusCircle className="text-white w-10 h-10 transition-transform duration-300 group-hover:scale-125" />
            </Link>
            <p className="mt-4 text-xl font-semibold transform transition duration-300 opacity-80 group-hover:opacity-100 text-text-secondary">Create Note</p>
          </div>

          {/* Recent Notes Section */}
          <div className="mb-16 transform transition-all duration-500 hover:translate-y-1 animate-slideInUp" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-accent-secondary to-accent-tertiary">Recent Notes</h2>
            {recentNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentNotes.map((note, index) => (
                  <div 
                    key={note._id} 
                    className="group p-5 bg-card-bg backdrop-filter backdrop-blur-md rounded-lg border border-card-border shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:rotate-1"
                    onClick={() => setSelectedNote(note)}
                    style={{ animationDelay: `${(index + 3) * 150}ms` }}
                  >
                    {/* Futuristic top bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full mb-4 transform origin-left transition-all duration-500 group-hover:scale-x-110"></div>
                    
                    <h3 className="text-xl font-bold mb-2 truncate text-text-primary">{note.title || "Untitled Note"}</h3>
                    <p className="text-text-tertiary text-sm mb-3">{new Date(note.timestamp).toLocaleString()}</p>
                    <div className="h-24 overflow-hidden relative">
                      <p className="text-text-secondary text-sm line-clamp-3">{note.text}</p>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card-bg to-transparent"></div>
                    </div>
                    
                    {/* Futuristic hover effect */}
                    <div className="absolute inset-0 rounded-lg border border-accent-primary opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card-bg backdrop-filter backdrop-blur-md rounded-lg p-8 text-center shadow-md transition-all duration-500 transform hover:scale-105 hover:shadow-lg border border-card-border">
                <p className="text-text-tertiary">No recent notes available.</p>
                <div className="mt-4 w-16 h-1 bg-gradient-to-r from-accent-tertiary to-accent-secondary mx-auto rounded-full"></div>
              </div>
            )}
            <div className="mt-8 text-center transform transition duration-500 hover:scale-105">
              <Link to="/all-notes" className="inline-block px-6 py-3 text-accent-secondary hover:text-accent-primary bg-bg-secondary hover:bg-bg-tertiary rounded-full text-lg transition-all duration-300 border border-border-light">
                See all notes →
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {selectedNote && (
        <NoteDetail 
          note={selectedNote} 
          onClose={() => setSelectedNote(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
