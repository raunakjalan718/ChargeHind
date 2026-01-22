// src/pages/StationsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './StationsPage.css';

// Import charging station service
import { getChargingStations } from '../services/ChargingStationService';

// Import station images
import atherStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/ather_station.jpg';
import chargegridStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/chargegrid_station.jpg';
import chargezoneStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/chargezone_station.jpg';
import EESLStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/EESL_station.jpg';
import HyundaiStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/Hyundai_station.jpg';
import IndianOilStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/IndianOil_Station.jpg';
import JioStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/Jio_station.jpg';
import OlaStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/Ola_Station.jpg';
import PlugGoStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/PlugGo_Station.jpg';
import qikchargeStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/qikcharge_station.jpg';
import TataStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/Tata_station.jpg';
import otherStationImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/other_station.jpg';
import BharatPetroleumImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/other_station.jpg';
import MagentaPowerImg from 'https://media.githubusercontent.com/media/raunakjalan718/ChargeHind/refs/heads/main/src/assets/Stations/other_station.jpg';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Company to image mapping
const stationImages = {
  'Ather Energy': atherStationImg,
  'chargegrid': chargegridStationImg,
  'chargezone': chargezoneStationImg,
  'EESL': EESLStationImg,
  'Hyundai': HyundaiStationImg,
  'IndianOil': IndianOilStationImg,
  'Jio': JioStationImg,
  'Ola': OlaStationImg,
  'PlugGo': PlugGoStationImg,
  'qikcharge': qikchargeStationImg,
  'Tata Power': TataStationImg,
  'Bharat Petroleum': BharatPetroleumImg,
  'Magenta Power': MagentaPowerImg
};

// Get station image based on operator
const getStationImage = (operator) => {
  if (!operator) return otherStationImg;
  
  // Check if any key in stationImages is contained within operator name
  for (const [key, image] of Object.entries(stationImages)) {
    if (operator.toLowerCase().includes(key.toLowerCase())) {
      return image;
    }
  }
  return otherStationImg;
};

// Custom icons for different marker types
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="location-symbol">
           <div class="location-dot"></div>
           <div class="location-ring"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createStationIcon = (distance) => {
  // Only use green for closest stations, orange for all others
  let color = distance <= 2 ? '#4caf50' : '#ff9800';
  
  return L.divIcon({
    className: 'charging-station-marker',
    html: `
      <div class="station-marker-container" style="border: 1px solid ${color};">
        <div class="station-marker-dot" style="background-color: ${color};"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Loading animation component
const LoadingAnimation = () => {
  return (
    <div className="gta-loading-animation">
      <div className="gta-loading-bar">
        <div className="gta-loading-progress"></div>
      </div>
      <div className="gta-loading-text">LOADING STATIONS</div>
      <div className="gta-loading-tip">TIP: You can plan your route based on charging station availability</div>
    </div>
  );
};

// Component to handle selected station centering
function MapController({ selectedStation }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedStation && selectedStation.AddressInfo) {
      const { Latitude, Longitude } = selectedStation.AddressInfo;
      map.flyTo([Latitude, Longitude], 15);
    }
  }, [selectedStation, map]);
  
  return null;
}

function StationsPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [stationsWithin6km, setStationsWithin6km] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [stationListVisible, setStationListVisible] = useState(false);
  
  // Format the station count with leading zeros
  const formatStationCount = (count) => {
    return count.toString().padStart(2, '0');
  };
  
  // Page entry animation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setPageLoaded(true);
      setTimeout(() => {
        setStationListVisible(true);
      }, 600);
    }, 2000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;  
    const dLon = (lon2 - lon1) * Math.PI / 180; 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance.toFixed(1);
  };

  // Request user location on page load
  useEffect(() => {
    requestUserLocation();
  }, []);

  // Request user's location
  const requestUserLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log("Current location obtained:", latitude, longitude);
        
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);
        
        // Fetch real charging stations from OpenChargeMap
        try {
          const stationsData = await getChargingStations(latitude, longitude);
          
          // Debugging output
          console.log("First 3 stations data:", stationsData.slice(0, 3));
          console.log("Sample address info:", stationsData[0]?.AddressInfo);
          console.log("Sample connection info:", stationsData[0]?.Connections);
          
          if (stationsData && stationsData.length > 0) {
            // Process station data
            const processedStations = stationsData.map(station => {
              const { AddressInfo, Connections } = station;
              
              // Calculate distance from user
              const distance = calculateDistance(
                latitude, longitude,
                AddressInfo.Latitude, AddressInfo.Longitude
              );
              
              return {
                ...station,
                distance: `${distance} km`,
                distanceValue: parseFloat(distance)
              };
            });
            
            // Sort stations by distance
            processedStations.sort((a, b) => a.distanceValue - b.distanceValue);
            
            setStations(processedStations);
            
            // Set 12 closest stations for sidebar
            setNearbyStations(processedStations.slice(0, 12));
            
            // Count stations within 6km
            const within6km = processedStations.filter(s => s.distanceValue <= 6);
            setStationsWithin6km(within6km);
          } else {
            setError('No charging stations found in your area');
          }
        } catch (err) {
          console.error('Error fetching stations:', err);
          setError('Failed to fetch charging stations');
        }
        
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(`Unable to retrieve your location: ${error.message}`);
        setIsLoading(false);
      },
      options
    );
  };
  
  // Helper function to get connector types
  const getConnectorTypes = (station) => {
    if (!station.Connections || !station.Connections.length) return 'CCS';
    
    // Get unique connector types
    const types = [...new Set(station.Connections.map(c => 
      c.ConnectionType ? c.ConnectionType.Title : 'CCS'
    ))];
    
    return types.join(', ');
  };
  
  // Helper function to get maximum power
  const getMaxPower = (station) => {
    if (!station.Connections || !station.Connections.length) return '80 kW';
    
    const powers = station.Connections
      .filter(c => c.PowerKW)
      .map(c => c.PowerKW);
    
    if (!powers.length) return '80 kW';
    
    const maxPower = Math.max(...powers);
    return `${maxPower} kW`;
  };
  
  // Helper function to get number of connectors
  const getConnectorCount = (station) => {
    if (!station.Connections) return '1/1';
    if (!station.Connections.length) return '1/1';
    return `${station.Connections.length}/${station.Connections.length}`;
  };
  
  // Helper function to get station hours
  const getStationHours = (station) => {
    if (!station.UsageCost) return 'Open 24 hours';
    if (station.UsageCost.includes('24/7')) return 'Open 24 hours';
    if (station.UsageCost.includes('Open')) return station.UsageCost;
    return 'Open 9AM - 10PM';
  };

  return (
    <div className={`stations-page ${pageLoaded ? 'page-visible' : ''}`}>
      <div className="stations-header">
        <h1 className="stations-title">STATIONS NEAR YOU</h1>
        <Link to="/" className="back-button">BACK</Link>
      </div>
      
      <div className="stations-container">
        <div className="map-container">
          {isLoading ? (
            <div className="loading-container">
              <LoadingAnimation />
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-text">{error}</div>
              <button className="retry-button" onClick={requestUserLocation}>RETRY</button>
            </div>
          ) : userLocation ? (
            <MapContainer 
              center={[userLocation.lat, userLocation.lng]} 
              zoom={14} 
              style={{ height: '100%', width: '100%' }}
              className="gta-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              
              <MapController selectedStation={selectedStation} />
              
              {/* User location marker */}
              <Marker 
                position={[userLocation.lat, userLocation.lng]}
                icon={userLocationIcon}
              >
                <Popup>Your current location</Popup>
              </Marker>
              
              {/* Station markers */}
              {stations.map(station => {
                if (!station.AddressInfo || !station.AddressInfo.Latitude || !station.AddressInfo.Longitude) {
                  return null;
                }
                
                const { Latitude, Longitude } = station.AddressInfo;
                
                return (
                  <Marker
                    key={station.ID}
                    position={[Latitude, Longitude]}
                    icon={createStationIcon(station.distanceValue)}
                    eventHandlers={{
                      click: () => setSelectedStation(station),
                    }}
                  >
                    <Popup>
                      <div className="station-popup">
                        <div className="station-popup-header">{station.AddressInfo.Title}</div>
                        <div className="station-popup-distance">{station.distance}</div>
                        <div className="station-popup-connectors">
                          {getConnectorTypes(station)} · {getMaxPower(station)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : null}
        </div>
        
        <div className={`stations-list-container ${stationListVisible ? 'list-visible' : ''}`}>
          <div className="stations-list-header">
            <div className="stations-count-header">
              <span className="station-count-number">{formatStationCount(stationsWithin6km.length)}</span>
              <span className="stations-count-text">STATIONS NEARBY</span>
            </div>
          </div>
          <div className="stations-list">
            {nearbyStations.map((station, index) => {
              // Extract data safely with fallbacks
              const AddressInfo = station.AddressInfo || {};
              const OperatorInfo = station.OperatorInfo || {};
              
              // Get operator name with fallback
              const operatorName = OperatorInfo.Title || 'Unknown Operator';
              
              return (
                <div 
                  key={station.ID || index} 
                  className={`station-card ${selectedStation?.ID === station.ID ? 'selected' : ''}`}
                  onClick={() => setSelectedStation(station)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="station-image">
                    <img src={getStationImage(operatorName)} alt={operatorName + " station"} />
                    <div className="station-distance">{station.distance}</div>
                  </div>
                  
                  <div className="station-details">
                    <h3 className="station-name">{AddressInfo.Title || `Charging Station ${index+1}`}</h3>
                    <p className="station-description">Electric vehicle charging station</p>
                    {/* Address line removed as requested */}
                    
                    <div className="station-info">
                      <div className={`station-hours ${getStationHours(station).includes('24') ? 'open-24' : 'open'}`}>
                        {getStationHours(station)}
                      </div>
                      
                      <div className="connector-info">
                        <span className="connector-type">
                          {getConnectorTypes(station)}
                        </span>
                        <span className="connector-power">
                          {getMaxPower(station)}
                        </span>
                        <span className="connector-availability">
                          {getConnectorCount(station)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StationsPage;
