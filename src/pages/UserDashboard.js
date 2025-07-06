import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import mapIcon from '../assets/icons/map-icon.png';
import routeIcon from '../assets/icons/route-icon.png';
import slotIcon from '../assets/icons/slot-icon.png';
import backgroundVideo from '../assets/videos/city-drive.mp4';

function UserDashboard() {
  // Rest of your component remains the same, just make sure 
  // you're using city-drive.mp4 for the background video
  
  return (
    <div className="dashboard-page">
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      {/* Rest of your component */}
    </div>
  );
}

export default UserDashboard;
