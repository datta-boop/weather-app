import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import {
  getWeatherByCity,
  getWeatherByCoords,
  getForecast,
  getForecastByCoords,
  getAirQuality,
} from './weatherService';
import { useLocalStorage } from './hooks/useLocalStorage';
import WeatherAnimation from './components/WeatherAnimation';
import SearchBar      from './components/SearchBar';
import FavoriteCities from './components/FavoriteCities';
import CurrentWeather from './components/CurrentWeather';
import Descriptions   from './components/Descriptions';
import FunPanel       from './components/FunPanel';
import Forecast       from './components/Forecast';
import HourlyChart    from './components/HourlyChart';
import ExtraDetails   from './components/ExtraDetails';
import WeatherMap     from './components/WeatherMap';
import CityComparison from './components/CityComparison';
import Toast          from './components/Toast';

const getWeatherTheme = (id) => {
  if (!id) return 'clear';
  if (id >= 200 && id < 300) return 'storm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800) return 'clear';
  return 'cloudy';
};

let toastId = 0;

function App() {
  const [weather,        setWeather]        = useState(null);
  const [forecast,       setForecast]       = useState(null);
  const [airQuality,     setAirQuality]     = useState(null);
  const [units,          setUnits]          = useLocalStorage('units', 'metric');
  const [theme,          setTheme]          = useLocalStorage('theme', 'dark');
  const [favorites,      setFavorites]      = useLocalStorage('favorites', []);
  const [searchHistory,  setSearchHistory]  = useLocalStorage('searchHistory', []);
  const [streak,         setStreak]         = useLocalStorage('streak', { count: 0, lastDate: null });
  const [city,           setCity]           = useState('');
  const [loading,        setLoading]        = useState(false);
  const [activeTab,      setActiveTab]      = useState('today');
  const [compareCity,    setCompareCity]    = useState('');
  const [compareWeather, setCompareWeather] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [toasts,         setToasts]         = useState([]);
  const searchRef = useRef(null);

  const weatherTheme = weather ? getWeatherTheme(weather.weatherId) : 'clear';

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const bumpStreak = useCallback(() => {
    const today = new Date().toDateString();
    setStreak((prev) => {
      if (prev.lastDate === today) return prev;
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      const count = prev.lastDate === yesterday ? prev.count + 1 : 1;
      return { count, lastDate: today };
    });
  }, [setStreak]);

  const addToHistory = useCallback((cityName) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      return [cityName, ...filtered].slice(0, 6);
    });
  }, [setSearchHistory]);

  const fetchAll = useCallback(async (cityName, u = units) => {
    setLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(cityName, u),
        getForecast(cityName, u),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.name);
      addToHistory(weatherData.name);
      bumpStreak();
      getAirQuality(weatherData.lat, weatherData.lon).then(setAirQuality);
    } catch (err) {
      addToast(err.message || 'City not found', 'error');
    } finally {
      setLoading(false);
    }
  }, [units, addToHistory, bumpStreak, addToast]);

  const fetchByCoords = useCallback(async (lat, lon, u = units) => {
    setLoading(true);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(lat, lon, u),
        getForecastByCoords(lat, lon, u),
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.name);
      bumpStreak();
      getAirQuality(lat, lon).then(setAirQuality);
    } catch (err) {
      addToast(err.message || 'Location error', 'error');
    } finally {
      setLoading(false);
    }
  }, [units, bumpStreak, addToast]);

  // Auto-detect location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        ()    => fetchAll('London'),
        { timeout: 6000 }
      );
    } else {
      fetchAll('London');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch on unit change
  useEffect(() => {
    if (!city) return;
    fetchAll(city, units);
  }, [units]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'm' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        setUnits((u) => (u === 'metric' ? 'imperial' : 'metric'));
      }
      if (e.key === 't' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setUnits, setTheme]);

  const toggleFavorite = (cityName) => {
    setFavorites((prev) => {
      if (prev.includes(cityName)) {
        addToast(`Removed ${cityName} from favorites`, 'info');
        return prev.filter((c) => c !== cityName);
      }
      addToast(`Added ${cityName} to favorites ⭐`, 'success');
      return [...prev, cityName];
    });
  };

  const handleShare = async () => {
    if (!weather) return;
    const text = `Weather in ${weather.name}, ${weather.country}: ${weather.temp.toFixed()}°${units === 'metric' ? 'C' : 'F'}, ${weather.description}. Powered by WeatherVibe!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Weather Update', text });
      } else {
        await navigator.clipboard.writeText(text);
        addToast('Weather info copied to clipboard!', 'success');
      }
    } catch {
      addToast('Could not share', 'error');
    }
  };

  const handleCompare = async (cmpCity) => {
    setCompareLoading(true);
    try {
      const data = await getWeatherByCity(cmpCity, units);
      setCompareWeather(data);
    } catch (err) {
      addToast(`Compare: ${err.message}`, 'error');
    } finally {
      setCompareLoading(false);
    }
  };

  const TABS = [
    { id: 'today',    label: '🌤 Today'    },
    { id: 'forecast', label: '📅 Forecast' },
    { id: 'details',  label: '🔬 Details'  },
    { id: 'map',      label: '🗺 Map'      },
    { id: 'compare',  label: '⚖️ Compare'  },
  ];

  return (
    <div className="App" data-theme={theme} data-weather={weatherTheme}>
      {weather && <WeatherAnimation weatherId={weather.weatherId} />}

      <div className="app-overlay">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-left">
            <span className="app-logo">⛅</span>
            <h1 className="app-title">WeatherVibe</h1>
          </div>
          <div className="header-right">
            {streak.count > 1 && (
              <div className="streak-badge" title="Daily check-in streak">
                🔥 {streak.count} day streak
              </div>
            )}
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              title="Toggle theme (T)"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* ── Favorites Bar ── */}
        {favorites.length > 0 && (
          <FavoriteCities
            favorites={favorites}
            currentCity={city}
            onSelect={fetchAll}
            onRemove={toggleFavorite}
          />
        )}

        {/* ── Search Bar ── */}
        <SearchBar
          searchRef={searchRef}
          onSearch={fetchAll}
          onGeolocate={fetchByCoords}
          units={units}
          onToggleUnits={() => setUnits((u) => (u === 'metric' ? 'imperial' : 'metric'))}
          searchHistory={searchHistory}
          loading={loading}
        />

        {/* ── Loading ── */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Fetching weather data…</p>
          </div>
        )}

        {/* ── Main Content ── */}
        {weather && !loading && (
          <>
            <CurrentWeather
              weather={weather}
              units={units}
              isFavorite={favorites.includes(weather.name)}
              onToggleFavorite={() => toggleFavorite(weather.name)}
              onShare={handleShare}
            />

            {/* Tab Nav */}
            <nav className="tab-nav" aria-label="Weather sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'today' && (
                <div className="today-tab">
                  <Descriptions weather={weather} units={units} />
                  <FunPanel weather={weather} units={units} streak={streak} />
                </div>
              )}

              {activeTab === 'forecast' && forecast && (
                <div className="forecast-tab">
                  <HourlyChart hourly={forecast.hourly} units={units} />
                  <Forecast daily={forecast.daily} units={units} />
                </div>
              )}

              {activeTab === 'details' && (
                <ExtraDetails weather={weather} airQuality={airQuality} />
              )}

              {activeTab === 'map' && (
                <WeatherMap lat={weather.lat} lon={weather.lon} city={weather.name} />
              )}

              {activeTab === 'compare' && (
                <CityComparison
                  currentWeather={weather}
                  compareWeather={compareWeather}
                  compareCity={compareCity}
                  setCompareCity={setCompareCity}
                  onCompare={handleCompare}
                  compareLoading={compareLoading}
                  units={units}
                />
              )}
            </div>

            {/* Keyboard shortcuts hint */}
            <p className="kbd-hint">
              <kbd>/</kbd> search · <kbd>M</kbd> units · <kbd>T</kbd> theme
            </p>
          </>
        )}

        {/* ── Empty / Error State ── */}
        {!weather && !loading && (
          <div className="empty-state">
            <span>🌧️</span>
            <h2>No weather data</h2>
            <p>Search for a city above to get started.</p>
          </div>
        )}
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
