// src/components/MapComponent.js (Leaflet version)
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapComponent({ userLocation, stations, selectedStation, setSelectedStation }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);
  
  // Initialize the map
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    
    // Create a new map instance if it doesn't exist
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        [userLocation.lat, userLocation.lng], 
        14
      );
      
      // Add dark-themed map tiles for GTA aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(leafletMapRef.current);
    } else {
      // Update view if map already exists
      leafletMapRef.current.setView([userLocation.lat, userLocation.lng], 14);
    }
    
    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add user marker with custom icon
    const userIcon = L.divIcon({
      className: 'user-marker-icon',
      html: '<div class="user-marker-dot"></div><div class="user-marker-pulse"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    
    const userMarker = L.marker([userLocation.lat, userLocation.lng], {icon: userIcon})
      .addTo(leafletMapRef.current);
    
    markersRef.current.push(userMarker);
    
    // Add station markers
    stations.forEach((station) => {
      // Simulate station positions around user location
      // In a real app, these would come from the API
      const lat = userLocation.lat + (Math.random() - 0.5) * 0.02;
      const lng = userLocation.lng + (Math.random() - 0.5) * 0.02;
      
      // Create station icon
      const stationIcon = L.divIcon({
        className: 'station-marker-icon',
        html: '<div class="station-marker-dot"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      // Create marker
      const marker = L.marker([lat, lng], {
        icon: stationIcon,
        title: station.name,
        stationId: station.id
      }).addTo(leafletMapRef.current);
      
      // Add click event
      marker.on('click', () => {
        setSelectedStation(station);
      });
      
      markersRef.current.push(marker);
      
      // Store position data for highlighting selected station
      station.mapPosition = { lat, lng };
    });
    
    return () => {
      // Cleanup not needed when using useRef and clearing markers above
    };
  }, [userLocation, stations, setSelectedStation]);
  
  // Update marker highlights when selected station changes
  useEffect(() => {
    if (!leafletMapRef.current) return;
    
    stations.forEach((station) => {
      if (station.id === (selectedStation?.id) && station.mapPosition) {
        // Find and update the selected marker
        markersRef.current.forEach(marker => {
          if (marker.options.stationId === station.id) {
            // Remove old marker
            marker.remove();
            
            // Add highlighted marker
            const highlightIcon = L.divIcon({
              className: 'station-marker-icon selected',
              html: '<div class="station-marker-dot selected"></div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });
            
            const newMarker = L.marker([station.mapPosition.lat, station.mapPosition.lng], {
              icon: highlightIcon,
              title: station.name,
              stationId: station.id
            }).addTo(leafletMapRef.current);
            
            // Update marker reference
            const index = markersRef.current.indexOf(marker);
            if (index > -1) {
              markersRef.current[index] = newMarker;
            }
            
            // Center map on selected marker
            leafletMapRef.current.panTo([station.mapPosition.lat, station.mapPosition.lng]);
          }
        });
      }
    });
  }, [selectedStation, stations]);
  
  return (
    <div ref={mapRef} className="map"></div>
  );
}

export default MapComponent;
