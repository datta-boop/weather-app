import React from 'react';
import './CityComparison.css';
import { FaSearch } from 'react-icons/fa';

const DiffBadge = ({ current, compare, unit = '', better = 'lower' }) => {
  const diff = compare - current;
  if (Math.abs(diff) < 0.5) return <span className="diff-badge same">≈ Same</span>;
  const isPositive = better === 'higher' ? diff > 0 : diff < 0;
  return (
    <span className={`diff-badge ${isPositive ? 'better' : 'worse'}`}>
      {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
    </span>
  );
};

const WeatherCard = ({ weather, units, side = 'left' }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  return (
    <div className={`compare-weather-card ${side}`}>
      <div className="cwc-city">{weather.name}, {weather.country}</div>
      <img src={weather.iconURL} alt={weather.description} className="cwc-icon" />
      <p className="cwc-desc">{weather.description}</p>
      <p className="cwc-temp">{weather.temp.toFixed()}{tempUnit}</p>
      <div className="cwc-stats">
        <div className="cwc-stat"><span className="cwc-stat-label">Feels Like</span><span>{weather.feels_like.toFixed()}{tempUnit}</span></div>
        <div className="cwc-stat"><span className="cwc-stat-label">Humidity</span><span>{weather.humidity}%</span></div>
        <div className="cwc-stat"><span className="cwc-stat-label">Wind</span><span>{weather.speed.toFixed(1)} m/s</span></div>
        <div className="cwc-stat"><span className="cwc-stat-label">Pressure</span><span>{weather.pressure} hPa</span></div>
      </div>
    </div>
  );
};

const CityComparison = ({
  currentWeather, compareWeather, compareCity, setCompareCity,
  onCompare, compareLoading, units,
}) => {
  const handleKey = (e) => {
    if (e.key === 'Enter' && compareCity.trim()) onCompare(compareCity.trim());
  };

  return (
    <div className="city-comparison">
      <div className="compare-search-bar">
        <FaSearch className="cs-icon" />
        <input
          type="text"
          className="cs-input"
          placeholder="Enter a city to compare…"
          value={compareCity}
          onChange={(e) => setCompareCity(e.target.value)}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        <button
          className="cs-btn"
          onClick={() => compareCity.trim() && onCompare(compareCity.trim())}
          disabled={compareLoading}
        >
          {compareLoading ? <span className="cs-spinner" /> : 'Compare'}
        </button>
      </div>

      {currentWeather && (
        <div className="comparison-layout">
          <WeatherCard weather={currentWeather} units={units} side="left" />

          <div className="vs-column">
            <div className="vs-badge">VS</div>
            {compareWeather && (
              <div className="diffs-list">
                <div className="diff-row">
                  <span className="diff-label">Temperature</span>
                  <DiffBadge current={currentWeather.temp} compare={compareWeather.temp} unit="°" better="higher" />
                </div>
                <div className="diff-row">
                  <span className="diff-label">Humidity</span>
                  <DiffBadge current={currentWeather.humidity} compare={compareWeather.humidity} unit="%" better="lower" />
                </div>
                <div className="diff-row">
                  <span className="diff-label">Wind</span>
                  <DiffBadge current={currentWeather.speed} compare={compareWeather.speed} unit=" m/s" better="lower" />
                </div>
                <div className="diff-row">
                  <span className="diff-label">Pressure</span>
                  <DiffBadge current={currentWeather.pressure} compare={compareWeather.pressure} unit=" hPa" better="higher" />
                </div>
              </div>
            )}
          </div>

          {compareWeather
            ? <WeatherCard weather={compareWeather} units={units} side="right" />
            : (
              <div className="compare-empty">
                <span className="compare-empty-icon">🌍</span>
                <p>Search a city to compare side-by-side</p>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
};

export default CityComparison;
