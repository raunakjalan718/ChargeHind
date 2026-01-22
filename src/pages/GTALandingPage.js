import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GTALandingPage.css';

// --- FIX: Use const instead of import for external URLs ---
// I updated the link to a CDN (jsdelivr) which is faster and prevents CORS errors
const backgroundVideo = 'https://cdn.jsdelivr.net/gh/raunakjalan718/ChargeHind@main/src/assets/city-drive.mp4';

function GTALandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Safe JSON parsing to prevent crash if 'user' is null/undefined
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      return null;
    }
  };
  const user = getUser();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
    
    // Simulate loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add class to body for transition effects if needed
      document.body.classList.add('loaded');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, user]); // Removed 'user' from dependency if it causes loops, but ok here.
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1 className="loading-title">HINDCHARGE</h1>
          <div className="loading-bar-container">
            <div className="loading-bar"></div>
          </div>
          <div className="loading-text">LOADING</div>
          <div className="loading-tip">TIP: Plan your routes to include charging stops for longer journeys</div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* muted and playsInline are required for autoPlay to work on most browsers */}
      <video autoPlay muted loop playsInline className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="overlay"></div>
      
      <div className="header">
        <h1 className="title">HINDCHARGE</h1>
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">LOGIN</Link>
          <Link to="/signup" className="signup-btn">SIGN UP</Link>
        </div>
      </div>
      
      <div className="hero-section">
        <h2 className="hero-title">FIND AND BOOK YOUR EV CHARGING SLOT NOW</h2>
        <p className="hero-subtitle">The ultimate platform for electric vehicle owners</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button">GET STARTED</Link>
          <Link to="/about" className="cta-button about-btn">ABOUT US</Link>
        </div>
      </div>
      
      <div className="about-section">
        <h2 className="section-title">WHY CHOOSE US</h2>
        <div className="feature-container">
          <div className="feature-card">
            <div className="feature-border"></div>
            <h3 className="feature-title">FIND STATIONS</h3>
            <p className="feature-description">Locate the nearest charging station with real-time availability.</p>
            <Link to="/about#find-stations" className="feature-btn">EXPLORE</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-border"></div>
            <h3 className="feature-title">LIVE STATUS</h3>
            <p className="feature-description">Check if charging ports are available before you arrive.</p>
            <Link to="/about#check-status" className="feature-btn">CHECK STATUS</Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-border"></div>
            <h3 className="feature-title">RESERVE NOW</h3>
            <p className="feature-description">Book your charging spot ahead of time and skip the wait.</p>
            <Link to="/about#reserve" className="feature-btn">RESERVE</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GTALandingPage;
