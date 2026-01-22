import React from 'react'; // Removed unused { useEffect }
// Removed unused imports from 'react-router-dom'
import './UserDashboard.css';
// Removed unused icon imports (mapIcon, routeIcon, slotIcon)
import backgroundVideo from '../assets/videos/city-drive.mp4';

function UserDashboard() {
  return (
    <div className="dashboard-page">
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      {/* If you have other content in your dashboard, 
          make sure it goes here. 
      */}
      
    </div>
  );
}

export default UserDashboard;
