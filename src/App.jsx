// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateNote from './pages/CreateNote';
import ProtectedRoute from './components/ProtectedRoute';
import Insights from './pages/Insights';
import NoteDetails from './components/NoteDetails';
import './i18n'
import AllNotes from './components/AllNotes';
import VisualMemoryTimeline from './components/VisualMemoryTimeline';

import Settings from './components/Setting';
import TeamManagement from './components/TeamManagement';
import GalaxyBackground from './components/css/Galaxyhhh';
import ThemeProvider from './components/css/ThemeProvider';
import SharedBackground from './components/SharedBackground';
import useAuthInterceptor from './hooks/useAuthInterceptor';

function App() {
  
  return (
    
    <Router>
     <ThemeProvider>
     <div className="relative min-h-screen">
          <SharedBackground />
          <div className="relative z-10">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/create-note" element={
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        } />
        <Route path="/timeline" element={
          <ProtectedRoute>
            <VisualMemoryTimeline/>
          </ProtectedRoute>
        } />
        <Route path="/notes/:id" element={
          <ProtectedRoute>
            <NoteDetails />
          </ProtectedRoute>
        } />
        <Route path="/insights" element={
          <ProtectedRoute>
            <Insights />
          </ProtectedRoute>
        } />
        <Route path="/all-notes" element={
          <ProtectedRoute>
            <AllNotes />
            {/* Replace with <AllNotes /> if you want to use the AllNotes page */}
          </ProtectedRoute>
          
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
 <Route path="/team" element={
    <ProtectedRoute>
      <TeamManagement />
    </ProtectedRoute>
  } />

      </Routes> 
      </div>
      </div>
      
      </ThemeProvider>
      <AuthInterceptor/>
      
    </Router>
   
  );

 
  
}
const AuthInterceptor = () => {
  useAuthInterceptor();
  return null;
};

export default App;
