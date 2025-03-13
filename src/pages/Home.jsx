import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
const LINK=import.meta.env.VITE_API_URL;

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
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

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(75, 75, 75, 0.15) 0%, rgba(0, 0, 0, 0) 60%)`
      }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-80"></div>
      
      {/* Mesh grid background - Hidden on mobile */}
      <div className="absolute inset-0 opacity-10 hidden sm:block">
        <div className="w-full h-full grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 grid-rows-12">
          {Array(144).fill().map((_, i) => (
            <div key={i} className="border border-gray-800"></div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative text-center px-4 w-full max-w-6xl mx-auto z-10">
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-4 tracking-tighter leading-tight">
          <div className="relative flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0">
            <span className="text-black fill-black stroke-white hover:text-white transition-all duration-300 transform hover:scale-105 px-2 py-1 hover:bg-black cursor-default" 
                  style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)' }}>
              Mem
            </span>
            <span className="text-black fill-black stroke-white hover:text-white transition-all duration-300 transform hover:scale-105 px-2 py-1 hover:bg-black cursor-default" 
                  style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)' }}>
              brain
            </span>
          </div>
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto font-light tracking-wide">
          <span className="text-black" style={{ WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.3)' }}>
            Extend your mind with intelligent note-taking
          </span>
        </p>
        
        <div className="mt-8 sm:mt-16 mb-8 sm:mb-12 w-full max-w-xl mx-auto px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-30"></div>
        </div>
        
        <p className="text-lg sm:text-xl text-gray-500 mb-8 sm:mb-12 max-w-lg mx-auto font-light px-4">
          <span className="text-black" style={{ WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.2)' }}>
            Capture ideas, organize thoughts, and access your notes anywhere.
          </span>
        </p>
      </div>
      
      {/* Bottom CTA Section */}
      <div className="relative w-full py-8 sm:py-12 transition-all duration-500 z-10 mt-8 sm:mt-0">
        <div className="text-center px-4">
          <Link 
            to="/register" 
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-transparent border border-gray-800 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white transition duration-300 ease-out hover:border-gray-600 w-full sm:w-auto"
          >
            <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-purple-600 to-white transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
            <span className="relative flex items-center justify-center transition-all duration-300 group-hover:text-black">
              Get Started
              <svg className="ml-2 h-4 sm:h-5 w-4 sm:w-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
          
          <p className="mt-6 text-sm sm:text-base">
            <span className="text-black" style={{ WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.2)' }}>
              Already have an account?{' '}
            </span>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Moving gradient orbs - Adjusted for mobile */}
      <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob z-0"></div>
      <div className="absolute top-1/3 right-1/4 w-36 sm:w-72 h-36 sm:h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob animation-delay-2000 z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-40 sm:w-80 h-40 sm:h-80 bg-pink-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-blob animation-delay-4000 z-0"></div>
    </div>
  );
};

export default Home;