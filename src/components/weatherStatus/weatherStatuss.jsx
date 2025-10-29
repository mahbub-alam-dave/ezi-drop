'use client';
import React, { useState, useEffect } from 'react';

// --- Configuration ---
const API_KEY = "b9a29f7084a133e40fc16d06a5f22d6e";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Comprehensive list of major cities/districts in Bangladesh
const CITY_NAMES = [
    // Dhaka Division
    "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", 
    "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", 
    "Rajbari", "Shariatpur", "Tangail",
    
    // Chittagong Division
     "Comilla", "Cox's Bazar", "Brahmanbaria", "Chandpur", 
    "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati", 
    "Bandarban", 
    
    // Khulna Division
    "Khulna", "Jessore", "Bagerhat", "Chuadanga", "Jhenaidah", 
    "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
    
    // Rajshahi Division
    "Rajshahi", "Bogra",  "Joypurhat", "Naogaon", 
    "Natore", "Pabna", "Sirajganj", 
    
    // Rangpur Division
    "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", 
    "Nilphamari", "Panchagarh", "Thakurgaon", 
    
    // Sylhet Division
    "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj",
    
    // Barisal Division
    "Barisal", "Barguna", "Bhola", "Jhalokati", "Patuakhali", 
    "Pirojpur",
    
    // Mymensingh Division
    "Mymensingh", "Jamalpur", "Netrokona", "Sherpur"
];

// --- Weather Fetching Function ---
const fetchWeatherData = async (city) => {
  const query = `${city}, BD`;
  const url = `${BASE_URL}?q=${query}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      const { name, main, weather, wind, sys, visibility } = data;
      return {
        id: city,
        name: name,
        temp: main.temp,
        feels_like: main.feels_like,
        temp_min: main.temp_min,
        temp_max: main.temp_max,
        humidity: main.humidity,
        pressure: main.pressure,
        description: weather[0].description,
        icon: weather[0].icon,
        windSpeed: wind.speed,
        country: sys.country,
        sunrise: sys.sunrise,
        sunset: sys.sunset,
        visibility: visibility,
        error: null,
      };
    } else {
      return {
        id: city,
        name: city,
        error: data.message || `API Error: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      id: city,
      name: city,
      error: `Network Error: ${error.message}`,
    };
  }
};

// --- React Component ---
const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadAllWeather = async () => {
    setLoading(true);
    const promises = CITY_NAMES.map(city => fetchWeatherData(city));
    const results = await Promise.all(promises);
    
    setWeatherData(results);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    loadAllWeather();
  }, []);

  // Filter and sort data
  const filteredAndSortedData = weatherData
    .filter(data => 
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'temp') {
        return (b.temp || -999) - (a.temp || -999);
      } else if (sortBy === 'humidity') {
        return (b.humidity || -999) - (a.humidity || -999);
      }
      return 0;
    });

  const successfulRequests = weatherData.filter(data => !data.error).length;

  const getTemperatureColor = (temp) => {
    if (!temp) return 'text-gray-500';
    if (temp >= 30) return 'text-red-600';
    if (temp >= 25) return 'text-orange-500';
    if (temp >= 20) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleTimeString('en-BD', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Live Weather Data for Bangladesh</h2>
          <p className="text-gray-600">Fetching data for {CITY_NAMES.length} districts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🇧🇩</span>
            <h1 className="text-4xl font-bold text-gray-800">Live Weather Report for Rider</h1>
          </div>
          
          {/* Stats and Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{CITY_NAMES.length}</div>
                <div className="text-gray-600">Total Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{successfulRequests}</div>
                <div className="text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{weatherData.length - successfulRequests}</div>
                <div className="text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-700">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
                </div>
                <div className="text-gray-600">Last Updated</div>
              </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <input
                type="text"
                placeholder="Search districts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="temp">Sort by Temperature</option>
                <option value="humidity">Sort by Humidity</option>
              </select>

              <button
                onClick={loadAllWeather}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>🔄</span>
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Weather Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedData.map((data) => (
            <div 
              key={data.id} 
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
                data.error ? 'border-2 border-red-300 bg-red-50' : 'border border-gray-200'
              }`}
            >
              {data.error ? (
                // Error Card
                <div className="text-center">
                  <div className="text-red-500 text-4xl mb-3">⚠️</div>
                  <h3 className="text-lg font-bold text-red-700 mb-2">{data.name}</h3>
                  <p className="text-red-600 text-sm mb-2">{data.error}</p>
                  <p className="text-gray-500 text-xs">Could not retrieve data</p>
                </div>
              ) : (
                // Success Card
                <>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{data.name}</h3>
                      <p className="text-gray-500 text-sm">District: {data.id}</p>
                    </div>
                    <img 
                      src={getWeatherIcon(data.icon)} 
                      alt={data.description}
                      className="w-16 h-16 -mt-2"
                    />
                  </div>

                  {/* Main Temperature */}
                  <div className="mb-4">
                    <div className={`text-3xl font-bold ${getTemperatureColor(data.temp)}`}>
                      {Math.round(data.temp)}°C
                    </div>
                    <div className="text-gray-600 text-sm">
                      Feels like {Math.round(data.feels_like)}°C
                    </div>
                    <div className="flex gap-4 text-sm mt-1">
                      <span className="text-blue-600">↓ {Math.round(data.temp_min)}°</span>
                      <span className="text-red-600">↑ {Math.round(data.temp_max)}°</span>
                    </div>
                  </div>

                  {/* Weather Description */}
                  <div className="mb-4">
                    <p className="text-gray-700 capitalize text-lg">
                      {data.description}
                    </p>
                  </div>

                  {/* Weather Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">💧 Humidity:</span>
                      <span className="font-semibold">{data.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">💨 Wind:</span>
                      <span className="font-semibold">{data.windSpeed} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">📊 Pressure:</span>
                      <span className="font-semibold">{data.pressure} hPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">👁️ Visibility:</span>
                      <span className="font-semibold">{(data.visibility / 1000).toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>🌅 {formatTime(data.sunrise)}</span>
                      <span>🌇 {formatTime(data.sunset)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Data provided by OpenWeatherMap • 
            Showing {filteredAndSortedData.length} of {CITY_NAMES.length} locations • 
            {lastUpdated && ` Last updated: ${lastUpdated.toLocaleString()}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;