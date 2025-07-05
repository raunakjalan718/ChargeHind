// src/services/FallbackStationService.js

// Indian cities for sample addresses
const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

// Indian street names
const indianStreetNames = [
  'MG Road', 'Station Road', 'Mall Road', 'Gandhi Road', 
  'Sadar Bazaar', 'Civil Lines', 'Cantonment Road', 'Nehru Place',
  'Connaught Place', 'Linking Road', 'Marine Drive', 'Park Street',
  'Ring Road', 'Outer Ring Road', 'Inner Ring Road', 'College Road',
  'Temple Road', 'Church Street', 'Brigade Road', 'Commercial Street',
  'Residency Road', 'Race Course Road', 'Parliament Street'
];

// EV companies in India
const indianCompanies = [
  'Tata Power', 'Ather Energy', 'Revolt Motors', 'Ola Electric', 
  'Fortum', 'Jio-bp', 'Statiq', 'Volttic', 'Magenta Power', 
  'EESL', 'Kazam', 'ChargeZone', 'Bharat Petroleum', 'Indian Oil'
];

// Generate fallback data
export const generateFallbackStations = (lat, lng, count = 50) => {
  const stations = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random location within ~10km
    const randomLat = lat + (Math.random() - 0.5) * 0.09;
    const randomLng = lng + (Math.random() - 0.5) * 0.09;
    
    // Calculate rough distance
    const R = 6371; 
    const dLat = (randomLat - lat) * Math.PI / 180;
    const dLon = (randomLng - lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat * Math.PI/180) * Math.cos(randomLat * Math.PI/180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = (R * c).toFixed(1);
    
    // Generate random address
    const streetNumber = Math.floor(Math.random() * 900) + 100;
    const streetName = indianStreetNames[Math.floor(Math.random() * indianStreetNames.length)];
    const city = indianCities[Math.floor(Math.random() * indianCities.length)];
    
    // Generate random company
    const company = indianCompanies[Math.floor(Math.random() * indianCompanies.length)];
    
    // Generate random connector count
    const connectorCount = Math.floor(Math.random() * 4) + 1;
    
    // Generate random power
    const powerOptions = [15, 25, 30, 50, 60, 80, 120];
    const power = powerOptions[Math.floor(Math.random() * powerOptions.length)];
    
    // Generate random hours
    const isOpen24 = Math.random() > 0.6;
    
    stations.push({
      ID: i + 1,
      AddressInfo: {
        ID: i + 1000,
        Title: `${company} Charging Station ${i+1}`,
        AddressLine1: `${streetNumber} ${streetName}`,
        Town: city,
        StateOrProvince: '',
        Postcode: `${Math.floor(Math.random() * 900000) + 100000}`,
        CountryID: 100,
        Country: { Title: 'India', ISOCode: 'IN' },
        Latitude: randomLat,
        Longitude: randomLng
      },
      Connections: Array(connectorCount).fill(0).map((_, j) => ({
        ID: i * 10 + j,
        ConnectionTypeID: j % 3 + 1,
        ConnectionType: {
          ID: j % 3 + 1,
          Title: j % 3 === 0 ? 'CCS' : j % 3 === 1 ? 'Type 2' : 'CHAdeMO'
        },
        PowerKW: power,
        Quantity: 1
      })),
      OperatorInfo: {
        Title: company
      },
      UsageCost: isOpen24 ? '24/7' : 'Open 9AM - 10PM',
      distance: `${distance} km`,
      distanceValue: parseFloat(distance)
    });
  }
  
  // Sort by distance
  stations.sort((a, b) => a.distanceValue - b.distanceValue);
  
  return stations;
};
