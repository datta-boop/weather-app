import React from 'react';
import './ExtraDetails.css';
import { FaEye, FaCloud, FaTint, FaWind } from 'react-icons/fa';

const AQI_COLORS = ['', '#00b894', '#fdcb6e', '#e17055', '#d63031', '#6c5ce7'];
const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_EMOJI  = ['', '😊', '🙂', '😐', '😷', '🤢'];

const AqiGauge = ({ airQuality }) => {
  if (!airQuality) return <p className="no-data">Air quality data unavailable</p>;

  const { aqi } = airQuality;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const filled = arc * ((aqi - 1) / 4);
  const color = AQI_COLORS[aqi] || '#00b894';

  return (
    <div className="aqi-content">
      <svg viewBox="0 0 100 65" className="aqi-svg">
        <circle
          cx="50" cy="52" r={r} fill="none"
          stroke="rgba(255,255,255,0.1)" strokeWidth="8"
          strokeDasharray={`${arc} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(135 50 52)"
        />
        <circle
          cx="50" cy="52" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform="rotate(135 50 52)"
        />
        <text x="50" y="50" textAnchor="middle" fontSize="18" fill="white" fontWeight="800">{aqi}</text>
        <text x="50" y="61" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)">/ 5</text>
      </svg>
      <div className="aqi-info">
        <span className="aqi-emoji">{AQI_EMOJI[aqi]}</span>
        <span className="aqi-label" style={{ color }}>{AQI_LABELS[aqi]}</span>
      </div>
      <div className="aqi-components">
        <span>PM2.5 <strong>{airQuality.pm2_5?.toFixed(1)}</strong></span>
        <span>PM10 <strong>{airQuality.pm10?.toFixed(1)}</strong></span>
        <span>NO₂ <strong>{airQuality.no2?.toFixed(1)}</strong></span>
        <span>O₃ <strong>{airQuality.o3?.toFixed(1)}</strong></span>
      </div>
    </div>
  );
};

const SunArc = ({ sunrise, sunset, timezone }) => {
  const fmt = (ts) => {
    const d = new Date((ts + timezone) * 1000);
    const h = d.getUTCHours().toString().padStart(2, '0');
    const m = d.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const nowSec = Date.now() / 1000;
  const total = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(total, nowSec - sunrise));
  const pct = total > 0 ? elapsed / total : 0;

  const sunX = 12 + pct * 76;
  const sunY = 62 - Math.sin(pct * Math.PI) * 52;

  return (
    <div className="sun-arc-wrap">
      <svg viewBox="0 0 100 68" className="sun-arc-svg">
        <path d="M 12 62 Q 50 8 88 62" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" />
        <path
          d="M 12 62 Q 50 8 88 62" fill="none"
          stroke="#ffd700" strokeWidth="2.5"
          strokeDasharray="200"
          strokeDashoffset={200 - pct * 200}
        />
        <circle cx={sunX} cy={sunY} r="5" fill="#ffd700" />
        <circle cx={sunX} cy={sunY} r="8" fill="rgba(255,215,0,0.2)" />
      </svg>
      <div className="sun-times">
        <div className="sun-time-item">
          <span className="sun-emoji">🌅</span>
          <span className="sun-label">Sunrise</span>
          <span className="sun-val">{fmt(sunrise)}</span>
        </div>
        <div className="sun-time-item">
          <span className="sun-emoji">🌇</span>
          <span className="sun-label">Sunset</span>
          <span className="sun-val">{fmt(sunset)}</span>
        </div>
      </div>
    </div>
  );
};

const ExtraDetails = ({ weather, airQuality }) => (
  <div className="extra-details">
    <div className="extra-top-row">
      <div className="extra-card aqi-card">
        <h4 className="extra-card-title">Air Quality Index</h4>
        <AqiGauge airQuality={airQuality} />
      </div>

      <div className="extra-card sun-card">
        <h4 className="extra-card-title">Sun Schedule</h4>
        <SunArc sunrise={weather.sunrise} sunset={weather.sunset} timezone={weather.timezone} />
      </div>
    </div>

    <div className="extra-stats-grid">
      {[
        { icon: <FaEye />, label: 'Visibility', value: weather.visibility !== null ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A' },
        { icon: <FaCloud />, label: 'Cloud Cover', value: `${weather.cloudiness}%` },
        { icon: <FaTint />, label: 'Rainfall', value: weather.rain > 0 ? `${weather.rain} mm/h` : 'None' },
        { icon: <FaWind />, label: 'Wind Speed', value: `${weather.speed.toFixed(1)} m/s` },
      ].map(({ icon, label, value }) => (
        <div key={label} className="extra-stat-card">
          <div className="es-icon">{icon}</div>
          <span className="es-label">{label}</span>
          <span className="es-value">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ExtraDetails;
