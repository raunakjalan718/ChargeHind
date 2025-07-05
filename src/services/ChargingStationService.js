// src/services/ChargingStationService.js
import axios from 'axios';
import { generateFallbackStations } from './FallbackStationService';

const API_URL = 'https://api.openchargemap.io/v3';
const API_KEY = '76f710a4-0875-42c2-b0b6-1880a355cc08';

export const getChargingStations = async (latitude, longitude, radius = 10) => {
  try {
    console.log(`Fetching stations near ${latitude}, ${longitude} with radius ${radius}km`);
    
    const response = await axios.get(`${API_URL}/poi`, {
      params: {
        output: 'json',
        maxresults: 100,
        compact: true,
        verbose: false,
        latitude: latitude,
        longitude: longitude,
        distance: radius,
        distanceunit: 'km',
      },
      headers: {
        'X-API-Key': API_KEY
      }
    });
    
    console.log(`API returned ${response.data?.length || 0} stations`);
    
    if (response.data && response.data.length > 5) {
      // If we got a good amount of data, use it
      return response.data;
    } else {
      // If data is sparse or empty, supplement with fallback
      console.log('Limited API data, using fallback stations');
      const fallbackData = generateFallbackStations(latitude, longitude);
      return [...(response.data || []), ...fallbackData];
    }
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    console.log('Using fallback data due to API error');
    return generateFallbackStations(latitude, longitude);
  }
};

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
    return response.data[0];
  } catch (error) {
    console.error('Error fetching station details:', error);
    return null;
  }
};
