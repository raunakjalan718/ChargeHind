import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GTALandingPage.css';
import backgroundVideo from '../assets/videos/city-drive.mp4';

function GTALandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
    
    // Simulate loading screen
    setTimeout(() => {
      setIsLoading(false);
      document.body.classList.add('loaded');
    }, 3000);
  }, [navigate, user]);
  
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
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
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
