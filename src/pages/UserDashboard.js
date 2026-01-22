import React from 'react';
import './UserDashboard.css';

// --- FIX: Use const instead of import for external video URLs ---
// I also updated this to use a CDN link which loads faster than raw GitHub
const backgroundVideo = 'https://cdn.jsdelivr.net/gh/raunakjalan718/ChargeHind@main/src/assets/city-drive.mp4';

// If you plan to use these later, uncomment them and add them to the JSX below.
// import { Link, useNavigate } from 'react-router-dom';
// import mapIcon from '../assets/icons/map-icon.png';
// import routeIcon from '../assets/icons/route-icon.png';
// import slotIcon from '../assets/icons/slot-icon.png';

function UserDashboard() {
  return (
    <div className="dashboard-page">
      <video autoPlay muted loop playsInline className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Add your dashboard buttons here when ready.
          Currently keeping this empty to pass the "Unused Variables" check.
      */}
      <div className="dashboard-content">
        <h1>Welcome to User Dashboard</h1>
      </div>
    </div>
  );
}

export default UserDashboard;
