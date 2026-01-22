import React from 'react';
import './UserDashboard.css';
import backgroundVideo from '../assets/videos/city-drive.mp4';

// If you plan to use these later, uncomment them and add them to the JSX below.
// import { Link, useNavigate } from 'react-router-dom';
// import mapIcon from '../assets/icons/map-icon.png';
// import routeIcon from '../assets/icons/route-icon.png';
// import slotIcon from '../assets/icons/slot-icon.png';

function UserDashboard() {
  return (
    <div className="dashboard-page">
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
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
