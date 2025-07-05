// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import GTALandingPage from './pages/GTALandingPage';
import StationsPage from './pages/StationsPage';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if this is a direct page load or navigation
    const path = window.location.pathname;
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    
    // If user is going directly to stations page or has already seen loading screen, skip it
    if (path !== '/' || hasSeenLoading === 'true') {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    // Mark loading as complete in session storage
    sessionStorage.setItem('hasSeenLoading', 'true');
    setIsLoading(false);
  };

  return (
    <Router>
      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <Routes>
          <Route path="/" element={<GTALandingPage />} />
          <Route path="/stations" element={<StationsPage />} />
          {/* Add more routes as needed */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
