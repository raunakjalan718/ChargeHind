// src/pages/StationsPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './StationsPage.css';

// Import OpenLayers
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Circle, Fill, Stroke, Text } from 'ol/style';

// Import charging station service
import { getChargingStations } from '../services/ChargingStationService';

// Import station images (keep your existing imports)
import atherStationImg from '../assets/Stations/ather_station.jpg';
import chargegridStationImg from '../assets/Stations/chargegrid_station.jpg';
import chargezoneStationImg from '../assets/Stations/chargezone_station.jpg';
import EESLStationImg from '../assets/Stations/EESL_station.jpg';
import HyundaiStationImg from '../assets/Stations/Hyundai_station.jpg';
import IndianOilStationImg from '../assets/Stations/IndianOil_Station.jpg';
import JioStationImg from '../assets/Stations/Jio_station.jpg';
import OlaStationImg from '../assets/Stations/Ola_Station.jpg';
import PlugGoStationImg from '../assets/Stations/PlugGo_Station.jpg';
import qikchargeStationImg from '../assets/Stations/qikcharge_station.jpg';
import TataStationImg from '../assets/Stations/Tata_station.jpg';
import otherStationImg from '../assets/Stations/other_station.jpg';

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
  'Tata Power': TataStationImg
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
  
  // OpenLayers map refs
  const mapRef = useRef(null);
  const mapElement = useRef(null);
  const userMarkerSource = useRef(new VectorSource()).current;
  const stationsSource = useRef(new VectorSource()).current;
  
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

  // Initialize map
  useEffect(() => {
    if (!userLocation || mapRef.current) return;
    
    // Create layers
    const darkBaseLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    });
    
    const userMarkerLayer = new VectorLayer({
      source: userMarkerSource,
      zIndex: 10
    });
    
    const stationsLayer = new VectorLayer({
      source: stationsSource,
      zIndex: 5
    });
    
    // Create map
    mapRef.current = new Map({
      target: mapElement.current,
      layers: [darkBaseLayer, stationsLayer, userMarkerLayer],
      view: new View({
        center: fromLonLat([userLocation.lng, userLocation.lat]),
        zoom: 14
      }),
      controls: []
    });
    
    // Add user location marker
    addUserLocationMarker(userLocation.lat, userLocation.lng);
    
    // Handle click on map features (stations)
    mapRef.current.on('click', (event) => {
      const feature = mapRef.current.forEachFeatureAtPixel(event.pixel, 
        (feature) => feature);
      
      if (feature && feature.get('type') === 'station') {
        const stationId = feature.get('id');
        const station = stations.find(s => s.ID === stationId);
        if (station) {
          setSelectedStation(station);
        }
      }
    });
    
    // Handle map movement to update visible stations
    mapRef.current.on('moveend', () => {
      // Get the current map view bounds
      const extent = mapRef.current.getView().calculateExtent(mapRef.current.getSize());
      const bottomLeft = toLonLat([extent[0], extent[1]]);
      const topRight = toLonLat([extent[2], extent[3]]);
      
      // This is where you would fetch new stations based on view bounds
      // For now we'll just use the stations we already have
    });
    
  }, [userLocation]);

  // Update station markers when stations change
  useEffect(() => {
    if (!mapRef.current || !stations.length) return;
    
    // Clear existing stations
    stationsSource.clear();
    
    // Add station markers
    stations.forEach(station => {
      addStationMarker(station);
    });
  }, [stations]);

  // Add user location marker to map
  const addUserLocationMarker = (lat, lng) => {
    userMarkerSource.clear();
    
    const userFeature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
      type: 'user'
    });
    
    userFeature.setStyle(new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: '#1e88e5' }),
        stroke: new Stroke({ color: '#ffffff', width: 2 })
      })
    }));
    
    userMarkerSource.addFeature(userFeature);
  };

  // Add station marker to map
  const addStationMarker = (station) => {
    if (!station.AddressInfo || !station.AddressInfo.Latitude || !station.AddressInfo.Longitude) return;
    
    const { Latitude, Longitude } = station.AddressInfo;
    
    // Calculate distance from user
    const distance = userLocation ? 
      calculateDistance(
        userLocation.lat, userLocation.lng, 
        Latitude, Longitude
      ) : 0;
    
    const distanceValue = parseFloat(distance);
    
    // Determine marker color based on distance
    const color = distanceValue <= 2 ? '#4caf50' : '#ff9800';
    
    const stationFeature = new Feature({
      geometry: new Point(fromLonLat([Longitude, Latitude])),
      type: 'station',
      id: station.ID
    });
    
    stationFeature.setStyle(new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: '#000000', width: 1 })
      })
    }));
    
    stationsSource.addFeature(stationFeature);
  };

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
    if (!station.Connections || !station.Connections.length) return 'Unknown';
    
    // Get unique connector types
    const types = [...new Set(station.Connections.map(c => 
      c.ConnectionType ? c.ConnectionType.Title : 'Unknown'
    ))];
    
    return types.join(', ');
  };
  
  // Helper function to get maximum power
  const getMaxPower = (station) => {
    if (!station.Connections || !station.Connections.length) return '';
    
    const powers = station.Connections
      .filter(c => c.PowerKW)
      .map(c => c.PowerKW);
    
    if (!powers.length) return '';
    
    const maxPower = Math.max(...powers);
    return `${maxPower} kW`;
  };
  
  // Helper function to get number of connectors
  const getConnectorCount = (station) => {
    if (!station.Connections) return '0/0';
    return `${station.Connections.length}/${station.Connections.length}`;
  };
  
  // Helper function to get station hours
  const getStationHours = (station) => {
    if (!station.UsageCost) return 'Open 24 hours';
    if (station.UsageCost.includes('24/7')) return 'Open 24 hours';
    return station.UsageCost || 'Open 24 hours';
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
          ) : (
            <div className="map-wrapper" ref={mapElement}></div>
          )}
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
              const { AddressInfo, OperatorInfo } = station;
              const operatorName = OperatorInfo ? OperatorInfo.Title : 'Unknown Operator';
              const address = AddressInfo ? 
                `${AddressInfo.AddressLine1 || ''}, ${AddressInfo.Town || ''}` : 'Address unknown';
              
              return (
                <div 
                  key={station.ID} 
                  className={`station-card ${selectedStation?.ID === station.ID ? 'selected' : ''}`}
                  onClick={() => setSelectedStation(station)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="station-image">
                    <img src={getStationImage(operatorName)} alt={operatorName + " station"} />
                    <div className="station-distance">{station.distance}</div>
                  </div>
                  
                  <div className="station-details">
                    <h3 className="station-name">{AddressInfo ? AddressInfo.Title : 'Unknown Station'}</h3>
                    <p className="station-description">Electric vehicle charging station</p>
                    <p className="station-address">{address}</p>
                    
                    <div className="station-info">
                      <div className="station-hours open-24">
                        {getStationHours(station)}
                      </div>
                      
                      <div className="connector-info">
                        <span className="connector-type">{getConnectorTypes(station)}</span>
                        <span className="connector-power">{getMaxPower(station)}</span>
                        <span className="connector-availability">{getConnectorCount(station)}</span>
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
