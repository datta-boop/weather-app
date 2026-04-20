import React, { useEffect, useRef, useState } from 'react';
import './WeatherMap.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const LAYERS = [
  { id: 'temp_new',          label: '🌡 Temperature' },
  { id: 'precipitation_new', label: '🌧 Precipitation' },
  { id: 'clouds_new',        label: '☁️ Clouds' },
  { id: 'wind_new',          label: '💨 Wind' },
];

const WeatherMap = ({ lat, lon, city }) => {
  const mapRef     = useRef(null);
  const mapInst    = useRef(null);
  const weatherTile = useRef(null);
  const [activeLayer, setActiveLayer] = useState('temp_new');

  useEffect(() => {
    if (!window.L || !mapRef.current) return;
    const L = window.L;

    if (mapInst.current) {
      mapInst.current.remove();
      mapInst.current = null;
    }

    const map = L.map(mapRef.current, { center: [lat, lon], zoom: 7, zoomControl: true });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    weatherTile.current = L.tileLayer(
      `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`,
      { opacity: 0.7, attribution: '© OpenWeatherMap' }
    ).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:var(--weather-primary,#74b9ff);border:3px solid white;width:16px;height:16px;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([lat, lon], { icon }).addTo(map).bindPopup(`<b>${city}</b>`).openPopup();

    mapInst.current = map;

    return () => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    };
  }, [lat, lon, city]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchLayer = (layerId) => {
    setActiveLayer(layerId);
    if (!mapInst.current || !window.L) return;
    if (weatherTile.current) mapInst.current.removeLayer(weatherTile.current);
    weatherTile.current = window.L.tileLayer(
      `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${API_KEY}`,
      { opacity: 0.7 }
    ).addTo(mapInst.current);
  };

  return (
    <div className="weather-map-container">
      <div className="map-layer-controls">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            className={`map-layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
            onClick={() => switchLayer(layer.id)}
          >
            {layer.label}
          </button>
        ))}
      </div>
      {!window.L && (
        <div className="map-fallback">
          <span>🗺️</span>
          <p>Map is loading... If it doesn't appear, please refresh the page.</p>
        </div>
      )}
      <div ref={mapRef} className="leaflet-map-div" />
    </div>
  );
};

export default WeatherMap;
