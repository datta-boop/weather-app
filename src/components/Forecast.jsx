import React from 'react';
import './Forecast.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Forecast = ({ daily, units }) => {
  return (
    <div className="forecast-section">
      <h3 className="section-title">5-Day Forecast</h3>
      <div className="forecast-cards">
        {daily.map((day, i) => {
          const date = new Date(day.time);
          const dayName = i === 0 ? 'Today' : DAYS[date.getDay()];
          const range = day.temp_max - day.temp_min;

          return (
            <div key={i} className="forecast-card">
              <span className="fc-day">{dayName}</span>
              <img src={day.icon} alt={day.description} className="fc-icon" />
              <span className="fc-desc">{day.description}</span>
              <div className="fc-temp-row">
                <span className="fc-high">{day.temp_max.toFixed()}°</span>
                <div className="fc-bar-wrap">
                  <div className="fc-bar" style={{ width: `${Math.min(100, range * 5)}%` }} />
                </div>
                <span className="fc-low">{day.temp_min.toFixed()}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
