// src/pages/GTALandingPage.js
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './GTALandingPage.css';
import vid4 from '../assets/vid4.mp4';

function GTALandingPage() {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null); // Ref to store the timeout ID

  useEffect(() => {
    // Add entrance animation on mount
    const entranceTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const video1 = videoRef1.current;
    const video2 = videoRef2.current;

    // --- Guard Clause: Ensure videos are mounted ---
    if (!video1 || !video2) {
      console.warn("GTALandingPage: Video refs not ready on mount.");
      return; // Exit useEffect if refs aren't set yet
    }

    // Initial setup
    video1.playbackRate = 0.75;
    video2.playbackRate = 0.75;

    // Determine which video should be initially active based on state
    const initiallyActiveVideo = activeVideoIndex === 0 ? video1 : video2;
    const initiallyInactiveVideo = activeVideoIndex === 0 ? video2 : video1;

    // Ensure only the correct video starts playing and is visible
    initiallyActiveVideo.play().catch(error => console.error("Error playing initial video:", error));
    initiallyActiveVideo.classList.add('active');
    initiallyInactiveVideo.classList.remove('active'); // Ensure the other is inactive

    // Handle video ending and transition
    const handleVideoEnded = () => {
      // --- Guard Clause: Check refs inside the handler ---
      const currentVideoEl = activeVideoIndex === 0 ? videoRef1.current : videoRef2.current;
      const nextVideoEl = activeVideoIndex === 0 ? videoRef2.current : videoRef1.current;

      // --- More Guard Clauses ---
      if (isTransitioning || !currentVideoEl || !nextVideoEl) {
        console.warn("handleVideoEnded: Aborting transition (already transitioning or refs lost).");
        return; // Prevent multiple transitions or errors if refs become null
      }

      setIsTransitioning(true);

      // Reset and play the next video
      nextVideoEl.currentTime = 0;
      nextVideoEl.play().catch(error => console.error("Error playing next video:", error));

      // Start the crossfade
      currentVideoEl.classList.add('fade-out');
      nextVideoEl.classList.add('fade-in');
      nextVideoEl.classList.add('active'); // Make next active immediately for transition

      // --- Clear previous timeout if one exists ---
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Wait for transition to complete, then reset
      timeoutRef.current = setTimeout(() => {
        // --- Check refs *again* inside the timeout callback ---
        const currentVideoAfterTimeout = videoRef1.current === currentVideoEl ? videoRef1.current : videoRef2.current;
        const nextVideoAfterTimeout = videoRef1.current === nextVideoEl ? videoRef1.current : videoRef2.current;

        if (currentVideoAfterTimeout) {
          currentVideoAfterTimeout.classList.remove('fade-out', 'active');
        }
        if (nextVideoAfterTimeout) {
          nextVideoAfterTimeout.classList.remove('fade-in');
          // Note: 'active' class remains on the next video
        }

        // Toggle active video index state *after* visual transition is mostly done
        setActiveVideoIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
        setIsTransitioning(false);
        timeoutRef.current = null; // Clear the ref

      }, 2000); // Match this to the CSS transition duration
    };

    // Listen for the 'ended' event on both videos
    video1.addEventListener('ended', handleVideoEnded);
    video2.addEventListener('ended', handleVideoEnded);

    // Cleanup
    return () => {
      clearTimeout(entranceTimeout); // Clear entrance animation timeout

      // --- Clear transition timeout on unmount ---
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // --- Check refs before removing listeners ---
      if (video1) {
        video1.removeEventListener('ended', handleVideoEnded);
      }
      if (video2) {
        video2.removeEventListener('ended', handleVideoEnded);
      }
    };
    // Dependencies: Re-run effect if the active index *logic* changes,
    // but the core setup depends only on mount. We handle state changes inside.
    // Adding isTransitioning avoids potential race conditions if state updates quickly.
  }, [activeVideoIndex, isTransitioning]); // Keep dependencies minimal but relevant

  return (
    <div className={`gta-landing-page ${isVisible ? 'visible' : ''}`}>
      <div className="video-container">
        {/* Add preload="auto" and maybe error handling */}
        <video
          ref={videoRef1}
          className="background-video" /* Removed 'active' class initially */
          src={vid4}
          muted
          playsInline
          preload="auto"
          onError={(e) => console.error("Video 1 load error:", e)}
        ></video>
        <video
          ref={videoRef2}
          className="background-video" /* Removed 'active' class initially */
          src={vid4}
          muted
          playsInline
          preload="auto"
          onError={(e) => console.error("Video 2 load error:", e)}
        ></video>
      </div>

      {/* --- Rest of your component (content-overlay, header, main-content, footer) --- */}
      <div className="content-overlay">
         <header className="gta-header">
           <div className="logo">CHARGETRACK</div>
           <nav className="gta-nav">
             <Link to="/stations" className="nav-item">STATIONS</Link>
             <Link to="/map" className="nav-item">LIVE MAP</Link>
             <Link to="/pricing" className="nav-item">PRICING</Link>
             <Link to="/about" className="nav-item">ABOUT</Link>
           </nav>
           <div className="auth-buttons">
             <Link to="/login" className="login-button">LOG IN</Link>
             <Link to="/signup" className="signup-button">SIGN UP</Link>
           </div>
         </header>

         <div className="main-content">
           <div className="title-container">
             <h1 className="gta-title">CHARGE TRACK</h1>
             <div className="subtitle">FIND YOUR POWER</div>
           </div>

           <div className="feature-boxes">
             <div className="feature-box">
               <h3>FIND STATIONS</h3>
               <p>Locate the nearest charging station with real-time availability.</p>
               <Link to="/stations" className="feature-button">EXPLORE</Link>
             </div>
             <div className="feature-box">
               <h3>LIVE STATUS</h3>
               <p>Check if charging ports are available before you arrive.</p>
               <Link to="/map" className="feature-button">VIEW MAP</Link>
             </div>
             <div className="feature-box">
               <h3>RESERVE NOW</h3>
               <p>Book your charging spot ahead of time and skip the wait.</p>
               <Link to="/booking" className="feature-button">RESERVE</Link>
             </div>
           </div>
         </div>

         <footer className="gta-footer">
           <div className="footer-content">
             <div className="footer-text">© 2025 CHARGETRACK - ALL RIGHTS RESERVED</div>
             <div className="rockstar-parody">A POWER SOLUTIONS PRODUCTION</div>
           </div>
         </footer>
       </div>
    </div>
  );
}

export default GTALandingPage;