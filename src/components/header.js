// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">ChargeTrack</Link>
      </div>
      
      <nav className="main-nav">
        <ul>
          <li><Link to="/stations">Stations</Link></li>
          <li><Link to="/map">Live Map</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/how-it-works">How it works</Link></li>
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      
      <div className="auth-buttons">
        <Link to="/login" className="login-button">Log in</Link>
        <Link to="/signup" className="signup-button">Try for free</Link>
      </div>
    </header>
  );
}

export default Header;