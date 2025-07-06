import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import backgroundVideo from '../assets/videos/city-drive.mp4';

function AboutPage() {
  return (
    <div className="about-page">
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      <div className="overlay"></div>
      
      <div className="about-header">
        <h1 className="about-title">HINDCHARGE</h1>
        <div className="nav-buttons">
          <Link to="/" className="nav-button">HOME</Link>
          <Link to="/login" className="nav-button">LOGIN</Link>
        </div>
      </div>
      
      <div className="about-content">
        <h2 className="about-heading">ABOUT US</h2>
        <p className="about-description">
          HindCharge is India's premier EV charging network, designed to make electric vehicle ownership seamless and convenient. 
          Our platform connects EV owners to the largest network of charging stations across the country, providing real-time information
          and innovative features to enhance your charging experience.
        </p>
        
        <div className="feature-section" id="find-stations">
          <h3 className="feature-heading">FIND STATIONS</h3>
          <div className="feature-details">
            <div className="feature-image"></div>
            <div className="feature-info">
              <p>Our station finder helps you locate the nearest charging stations with real-time availability information. Filter by:</p>
              <ul>
                <li>Connector types (CCS, CHAdeMO, Type 2)</li>
                <li>Power levels (Fast charging, Standard)</li>
                <li>Available amenities (Restrooms, Cafes, Wi-Fi)</li>
                <li>Distance from your location</li>
              </ul>
              <p>Get detailed information about each station including charging speeds, costs, and user reviews.</p>
              <Link to="/login" className="feature-cta">TRY IT NOW</Link>
            </div>
          </div>
        </div>
        
        <div className="feature-section" id="check-status">
          <h3 className="feature-heading">CHECK STATUS</h3>
          <div className="feature-details">
            <div className="feature-info">
              <p>Never arrive at a station to find it's already in use. With HindCharge, you can:</p>
              <ul>
                <li>View real-time availability of charging ports</li>
                <li>See estimated wait times</li>
                <li>Get notifications when stations become available</li>
                <li>Check if charging stations are operational</li>
              </ul>
              <p>Our live status updates ensure you always know which stations are available before you arrive.</p>
              <Link to="/login" className="feature-cta">TRY IT NOW</Link>
            </div>
            <div className="feature-image"></div>
          </div>
        </div>
        
        <div className="feature-section" id="reserve">
          <h3 className="feature-heading">RESERVE NOW</h3>
          <div className="feature-details">
            <div className="feature-image"></div>
            <div className="feature-info">
              <p>Plan ahead and secure your charging time with our reservation system:</p>
              <ul>
                <li>Book charging slots in advance</li>
                <li>Schedule recurring reservations for regular commuters</li>
                <li>Receive confirmation and reminders</li>
                <li>Cancel or reschedule with ease</li>
              </ul>
              <p>Skip the wait and ensure your EV gets charged when you need it most.</p>
              <Link to="/login" className="feature-cta">TRY IT NOW</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
