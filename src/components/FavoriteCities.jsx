import React from 'react';
import './FavoriteCities.css';
import { FaStar, FaTimes } from 'react-icons/fa';

const FavoriteCities = ({ favorites, currentCity, onSelect, onRemove }) => (
  <div className="favorites-bar">
    <FaStar className="favorites-star-icon" />
    <div className="favorites-scroll">
      {favorites.map((city) => (
        <div
          key={city}
          className={`favorite-chip ${currentCity?.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
        >
          <button className="chip-name" onClick={() => onSelect(city)}>
            {city}
          </button>
          <button
            className="chip-remove"
            onClick={(e) => { e.stopPropagation(); onRemove(city); }}
            aria-label={`Remove ${city}`}
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default FavoriteCities;
