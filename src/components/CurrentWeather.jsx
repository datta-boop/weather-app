import React from 'react';
import './CurrentWeather.css';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';

const CurrentWeather = ({ weather, units, isFavorite, onToggleFavorite, onShare }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="current-weather">
      <div className="cw-header">
        <div className="cw-location">
          <h2 className="cw-city">{weather.name}, {weather.country}</h2>
        </div>
        <div className="cw-actions">
          <button
            className={`cw-action-btn ${isFavorite ? 'favorited' : ''}`}
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button
            className="cw-action-btn"
            onClick={onShare}
            title="Share weather"
            aria-label="Share weather"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>

      <div className="cw-body">
        <div className="cw-icon-col">
          <img src={weather.iconURL} alt={weather.description} className="cw-icon" />
          <p className="cw-description">{weather.description}</p>
        </div>
        <div className="cw-temp-col">
          <h1 className="cw-temp">{weather.temp.toFixed()}{tempUnit}</h1>
          <p className="cw-feels">Feels like {weather.feels_like.toFixed()}{tempUnit}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
