import noonCold from "./assets/noon-cold.jpg";
import noonHot from "./assets/noon-hot.jpg";
import "./App.css";
import Descriptions from "./components/Descriptions.jsx";
import { useEffect } from "react";
import { getFormattedWeatherData } from "./weatherService";
import { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";

function App() {
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [city, setCity] = useState("Kolkata");
  const [bg, setBg] = useState(noonCold);

  const handleOnChange = (e) => {
    if (e.keyCode === 13) {
      setCity(e.target.value);
      e.target.blur();
    }
  };
  const handleOnClick = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      const threshold = units === "metric" ? 20 : 60;

      if (data.temp <= threshold) setBg(noonCold);
      else setBg(noonHot);
    };

    fetchWeatherData();
  }, [city, units]);

  return (
    <div className="App" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <h2>What's the weather here?</h2>
            <div className="section-search">
              <div className="search-field">
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  onKeyDown={handleOnChange}
                />
                <FaSearchLocation size="1.9rem" />
              </div>
              <button onClick={handleOnClick}>{`${
                units === "metric" ? "°C" : "°F"
              }`}</button>
            </div>
            <div className="section-weather">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
