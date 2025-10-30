'use client';
import React, { useState, useEffect } from 'react';

// --- Configuration ---
const API_KEY = "b9a29f7084a133e40fc16d06a5f22d6e";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// --- City List ---
/* const CITY_NAMES = [
  "Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj",
  "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail", "Comilla", "Cox's Bazar",
  "Brahmanbaria", "Chandpur", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati",
  "Bandarban", "Khulna", "Jessore", "Bagerhat", "Chuadanga", "Jhenaidah", "Kushtia", "Magura",
  "Meherpur", "Narail", "Satkhira", "Rajshahi", "Bogra", "Joypurhat", "Naogaon", "Natore",
  "Pabna", "Sirajganj", "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari",
  "Panchagarh", "Thakurgaon", "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj", "Barisal",
  "Barguna", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur", "Mymensingh", "Jamalpur",
  "Netrokona", "Sherpur"
]; */

const CITY_NAMES = [
  "Dhaka", "Chittagong",
   "Khulna", "Rangpur", "Barisal",
 "Mymensingh", "Rajshahi", "Sylhet"
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
        name,
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
        visibility,
        error: null,
      };
    } else {
      return { id: city, name: city, error: data.message || `API Error: ${response.status}` };
    }
  } catch (error) {
    return { id: city, name: city, error: `Network Error: ${error.message}` };
  }
};

// --- Main Component ---
export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  );

  // --- Fetch all weather data ---
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const filteredAndSortedData = weatherData
    .filter(data =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'temp') return (b.temp || -999) - (a.temp || -999);
      if (sortBy === 'humidity') return (b.humidity || -999) - (a.humidity || -999);
      return 0;
    });

  const successfulRequests = weatherData.filter(data => !data.error).length;

  const getTemperatureColor = (temp) => {
    if (!temp) return 'text-gray-500';
    if (temp >= 30) return 'text-red-500';
    if (temp >= 25) return 'text-orange-400';
    if (temp >= 20) return 'text-yellow-500';
    return 'text-blue-400';
  };

  const getWeatherIcon = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatTime = (timestamp) =>
    timestamp
      ? new Date(timestamp * 1000).toLocaleTimeString('en-BD', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Loading Live Weather Data...
          </h2>
          <p className="text-base-content/70">
            Fetching {CITY_NAMES.length} districts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6 py-8 transition-colors duration-500">
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-4xl">🇧🇩</span>
            <h1 className="text-4xl font-bold">Live Weather Report for Rider</h1>
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-4 btn btn-sm border border-color rounded-sm"
            >
              {theme === 'dark' ? '🌞 Light Mode' : '🌙 Night Mode'}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-base-200 rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{CITY_NAMES.length}</div>
                <div className="text-base-content/70">Total Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{successfulRequests}</div>
                <div className="text-base-content/70">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">{weatherData.length - successfulRequests}</div>
                <div className="text-base-content/70">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'N/A'}
                </div>
                <div className="text-base-content/70">Last Updated</div>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <input
                type="text"
                placeholder="Search districts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full md:w-64"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered"
              >
                <option value="name">Sort by Name</option>
                <option value="temp">Sort by Temperature</option>
                <option value="humidity">Sort by Humidity</option>
              </select>
              <button onClick={loadAllWeather} className="btn btn-primary flex items-center gap-2">
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Weather Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedData.map((data) => (
            <div
              key={data.id}
              className={`card bg-base-200 shadow-xl hover:shadow-2xl transition-all ${
                data.error ? 'border border-error' : ''
              }`}
            >
              <div className="card-body">
                {data.error ? (
                  <div className="text-center">
                    <div className="text-error text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-bold mb-2">{data.name}</h3>
                    <p className="text-error text-sm mb-2">{data.error}</p>
                    <p className="text-base-content/60 text-xs">Could not retrieve data</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{data.name}</h3>
                        <p className="text-base-content/60 text-sm">District: {data.id}</p>
                      </div>
                      <img
                        src={getWeatherIcon(data.icon)}
                        alt={data.description}
                        className="w-16 h-16 -mt-2"
                      />
                    </div>

                    <div className="mb-4">
                      <div className={`text-3xl font-bold ${getTemperatureColor(data.temp)}`}>
                        {Math.round(data.temp)}°C
                      </div>
                      <div className="text-base-content/70 text-sm">
                        Feels like {Math.round(data.feels_like)}°C
                      </div>
                      <div className="flex gap-4 text-sm mt-1">
                        <span className="text-info">↓ {Math.round(data.temp_min)}°</span>
                        <span className="text-error">↑ {Math.round(data.temp_max)}°</span>
                      </div>
                    </div>

                    <p className="capitalize text-base-content/90 text-lg mb-3">
                      {data.description}
                    </p>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>💧 Humidity:</span>
                        <span>{data.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💨 Wind:</span>
                        <span>{data.windSpeed} m/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>📊 Pressure:</span>
                        <span>{data.pressure} hPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>👁️ Visibility:</span>
                        <span>{(data.visibility / 1000).toFixed(1)} km</span>
                      </div>
                      <div className="flex justify-between text-xs text-base-content/60">
                        <span>🌅 {formatTime(data.sunrise)}</span>
                        <span>🌇 {formatTime(data.sunset)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-base-content/60 text-sm">
          Data from OpenWeatherMap • Showing {filteredAndSortedData.length} of {CITY_NAMES.length} •{' '}
          {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
        </div>
      </div>
    </div>
  );
}
