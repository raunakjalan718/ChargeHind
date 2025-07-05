// src/components/StationsList.js
import React from 'react';
import './StationsList.css';
import StationCard from './StationCard';

function StationsList({ stations, selectedStation, setSelectedStation, isLoading }) {
  if (isLoading) {
    return (
      <div className="stations-list">
        <div className="stations-list-header">
          <h2>NEARBY STATIONS</h2>
        </div>
        <div className="stations-loading">LOADING STATIONS...</div>
      </div>
    );
  }

  return (
    <div className="stations-list">
      <div className="stations-list-header">
        <h2>NEARBY STATIONS</h2>
        <span className="stations-count">{stations.length} FOUND</span>
      </div>
      
      {stations.length === 0 ? (
        <div className="no-stations">
          <p>No charging stations found in your area.</p>
          <p>Try expanding your search radius.</p>
        </div>
      ) : (
        <div className="stations-list-content">
          {stations.map(station => (
            <StationCard 
              key={station.id}
              station={station}
              isSelected={selectedStation?.id === station.id}
              onClick={() => setSelectedStation(station)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StationsList;
