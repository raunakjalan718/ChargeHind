import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header'; // Adjust the path as necessary
import './LandingPage.css';
import chargingVideo from '../assets/landingpage1.mp4';
import ev_home_charging from '../assets/ev_home_charging.jpeg';
import ev_public_station from '../assets/ev_public_station.jpeg';
import ev_workplace from '../assets/ev_workplace.jpg';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="main-heading">
            Find available charging 
            <br />ports in real-time.
          </h1>
          
          <h2 className="sub-heading">
            Just <span className="highlight">plug and go.</span>
          </h2>
          
          <p className="description">
            Access the largest network of EV charging ports with real-time 
            availability tracking. Never wait for a charging spot again with 
            our IoT-powered monitoring system that shows exactly which 
            ports are free, right when you need them.
          </p>
          
          <Link to="/signup" className="cta-button">
            Try for free
          </Link>
        </div>
        
        <div className="hero-visual">
          <div className="charging-illustration">
            <video 
              className="hero-video"
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src={chargingVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <h2>Real-time tracking for all charging needs</h2>
        <p>Across all locations.</p>
        
        <div className="feature-cards">
          <div className="feature-card">
            <div className="image-container">
              <img 
                src={ev_home_charging}
                alt="Home Charging"
              />
            </div>
            <h3>Home Charging</h3>
          </div>
          
          <div className="feature-card">
            <div className="image-container">
              <img 
                src={ev_public_station}
                alt="Public Stations"
              />
            </div>
            <h3>Public Stations</h3>
          </div>
          
          <div className="feature-card">
            <div className="image-container">
              <img 
                src={ev_workplace}
                alt="Workplace"
              />
            </div>
            <h3>Workplace</h3>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <h2>How It Works</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Find Stations Near You</h3>
            <p>Locate charging stations with available ports in your area</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Check Real-Time Availability</h3>
            <p>See which specific ports are available right now</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Navigate & Charge</h3>
            <p>Get directions and plug in without the wait</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;