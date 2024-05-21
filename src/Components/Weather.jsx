import { useState, useEffect } from "react";
import * as TiIcons from 'react-icons/ti';
import './Weather.css';

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForecast, setShowForecast] = useState(false); // State to toggle between current weather and forecast

  const api = {
    key: "bbf8f01a167651a276d3de876de8172b",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!query) {
        // Get user's current location if query is empty
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherData(latitude, longitude);
        });
      } else {
        // Fetch weather data based on user's search query
        await fetchWeatherDataByQuery(query);
      }
    };

    fetchData();
  }, [query]); // Run effect when query changes

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`);
      const result = await response.json();
      setWeather(result);

      // Fetch 7-day forecast for current location
      const forecastResponse = await fetch(`${api.base}forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`);
      const forecastResult = await forecastResponse.json();
      setForecast(forecastResult.list.filter((item, index) => index % 8 === 0)); // Filter for one forecast per day
    } catch (error) {
      setError("Error fetching weather data. Please try again later.");
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherDataByQuery = async (query) => {
    try {
      const response = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
      const result = await response.json();
      setWeather(result);

      // Fetch 7-day forecast for the searched location
      const forecastResponse = await fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`);
      const forecastResult = await forecastResponse.json();
      setForecast(forecastResult.list.filter((item, index) => index % 8 === 0)); // Filter for one forecast per day
    } catch (error) {
      // setError("Error fetching weather data. Please try again later.");
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const dateBuilder = (d) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[d.getDay()];
    const date = d.getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case 'Clear':
        return <TiIcons.TiWeatherSunny />;
      case 'Clouds':
        return <TiIcons.TiWeatherCloudy />;
      case 'Rain':
        return <TiIcons.TiWeatherRain />;
      case 'Snow':
        return <TiIcons.TiWeatherSnow />;
      case 'Drizzle':
        return <TiIcons.TiWeatherPartlySunny />;
      case 'Thunderstorm':
        return <TiIcons.TiWeatherStormy />;
      default:
        return <TiIcons.TiWeatherPartlySunny />;
    }
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  return (
    <div className={`weather-app ${weather.main && weather.main.temp > 16 ? 'warm' : ''}`}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setQuery(e.target.value);
              }
            }}
          />
          <button className="menu-button" onClick={toggleForecast}>
            {showForecast ? 'Show Current Weather' : 'Check 7-Day Forecast'}
          </button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {showForecast ? (
          <div className="forecast-box">
            <h2>5-Day Forecast</h2>
            <div className="forecast">
              {forecast.map((item, index) => (
                <div className="forecast-item" key={index}>
                  <div className="forecast-date">{dateBuilder(new Date(item.dt * 1000))}</div>
                  <div className="forecast-icon">{getWeatherIcon(item.weather[0].main)}</div>
                  <div className="forecast-temp">{Math.round(item.main.temp)}°C</div>
                  <div className="forecast-weather">{item.weather[0].description}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {weather.name && (
              <div className="weather-container">
                <div className="location-box">
                  <div className="location">
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className="date">{dateBuilder(new Date())}</div>
                </div>
                <div className="weather-box">
                  <div className="temp">{Math.round(weather.main.temp)}°C</div>
                  <div className="weather">{weather.weather[0].description}</div>
                  <div className="details">
                    <div className="detail">Humidity: {weather.main.humidity}%</div>
                    <div className="detail">Wind Speed: {weather.wind.speed} m/s</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Weather;
