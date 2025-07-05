// src/components/StationCard.js
import React from 'react';
import './StationCard.css';

function StationCard({ station, isSelected, onClick }) {
  // Placeholder image URL if station image is not available
  const placeholderImage = 'https://via.placeholder.com/100x80?text=EV+Station';
  
  return (
    <div 
      className={`station-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="station-image">
        <img src={station.image || placeholderImage} alt={station.name} />
        <div className="station-distance">{station.distance}</div>
      </div>
      
      <div className="station-details">
        <h3 className="station-name">{station.name}</h3>
        <p className="station-description">{station.description}</p>
        <p className="station-address">{station.address}</p>
        
        <div className="station-info">
          <div className="station-hours">{station.hours}</div>
          
          <div className="connector-info">
            <span className="connector-type">{station.connectorType}</span>
            <span className="connector-power">{station.power}</span>
            <span className="connector-availability">{station.availability}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationCard;
