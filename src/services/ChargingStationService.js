import axios from 'axios';

const API_URL = 'https://api.openchargemap.io/v3';
const API_KEY = 'YOUR_API_KEY'; // Replace with your API key from OpenChargeMap

// Get charging stations by latitude and longitude
export const getChargingStations = async (latitude, longitude, radius = 10) => {
  try {
    const response = await axios.get(`${API_URL}/poi`, {
      params: {
        output: 'json',
        countrycode: 'IN', // India specific
        maxresults: 100,
        compact: true,
        verbose: false,
        latitude: latitude,
        longitude: longitude,
        distance: radius, // Radius in KM
        distanceunit: 'km',
        includecomments: false,
      },
      headers: {
        'X-API-Key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    return [];
  }
};

// Get station details by ID
export const getStationDetails = async (stationId) => {
  try {
    const response = await axios.get(`${API_URL}/poi/${stationId}`, {
      params: {
        output: 'json',
        includecomments: true,
      },
      headers: {
        'X-API-Key': API_KEY
      }
    });
    return response.data[0]; // API returns array, but we need first item
  } catch (error) {
    console.error('Error fetching station details:', error);
    return null;
  }
};
