import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import { FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const SearchBar = ({ searchRef, onSearch, onGeolocate, units, onToggleUnits, searchHistory, loading }) => {
  const [value, setValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (city) => {
    if (!city.trim()) return;
    onSearch(city.trim());
    setValue('');
    setShowHistory(false);
    searchRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit(value);
    if (e.key === 'Escape') { setShowHistory(false); searchRef.current?.blur(); }
  };

  const handleGeo = async () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { onGeolocate(pos.coords.latitude, pos.coords.longitude); setGeoLoading(false); },
      () => setGeoLoading(false)
    );
  };

  return (
    <div className="search-bar-wrap" ref={wrapperRef}>
      <div className="search-input-group">
        <FaSearch className="search-prefix-icon" />
        <input
          ref={searchRef}
          type="text"
          className="search-input"
          placeholder="Search city…  (press / to focus)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search city"
          autoComplete="off"
        />
        {value && (
          <button className="search-clear-btn" onClick={() => setValue('')} aria-label="Clear">
            <FaTimes />
          </button>
        )}

        {showHistory && searchHistory.length > 0 && !value && (
          <div className="search-history-dropdown">
            <span className="history-label">Recent</span>
            {searchHistory.map((c) => (
              <button key={c} className="history-item" onClick={() => submit(c)}>
                <FaSearch className="history-icon" />
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="search-action-btn geo-btn"
        onClick={handleGeo}
        disabled={geoLoading || loading}
        title="Use my location"
        aria-label="Use my location"
      >
        {geoLoading ? <span className="btn-spinner" /> : <FaMapMarkerAlt />}
      </button>

      <button
        className="search-action-btn unit-btn"
        onClick={onToggleUnits}
        title="Toggle units (M)"
        aria-label="Toggle temperature units"
      >
        {units === 'metric' ? '°C' : '°F'}
      </button>
    </div>
  );
};

export default SearchBar;
