import React from 'react';
import './HourlyChart.css';

const HourlyChart = ({ hourly, units }) => {
  if (!hourly?.length) return null;

  const W = 820;
  const H = 150;
  const PAD = { top: 28, right: 20, bottom: 46, left: 15 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const temps = hourly.map((h) => h.temp);
  const minT = Math.min(...temps) - 1.5;
  const maxT = Math.max(...temps) + 1.5;

  const xPos = (i) => PAD.left + (i / (hourly.length - 1)) * iW;
  const yPos = (t) => PAD.top + ((maxT - t) / (maxT - minT)) * iH;

  const linePoints = hourly.map((h, i) => `${xPos(i)},${yPos(h.temp)}`).join(' ');
  const areaPoints =
    `${xPos(0)},${H - PAD.bottom} ` + linePoints + ` ${xPos(hourly.length - 1)},${H - PAD.bottom}`;

  return (
    <div className="hourly-chart">
      <h3 className="section-title">24-Hour Temperature Trend</h3>

      <div className="chart-scroll-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="var(--weather-primary)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--weather-primary)" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          <polygon points={areaPoints} fill="url(#areaGrad)" />

          <polyline
            points={linePoints}
            fill="none"
            stroke="var(--weather-primary)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {hourly.map((h, i) => (
            <g key={i}>
              <circle
                cx={xPos(i)} cy={yPos(h.temp)} r="4"
                fill="white" stroke="var(--weather-primary)" strokeWidth="2"
              />
              <text
                x={xPos(i)} y={yPos(h.temp) - 10}
                textAnchor="middle" fontSize="11" fill="white" fontWeight="700"
              >
                {h.temp.toFixed()}°
              </text>
              <text
                x={xPos(i)} y={H - PAD.bottom + 16}
                textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)"
              >
                {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="hourly-cards-row">
        {hourly.map((h, i) => (
          <div key={i} className="hourly-mini-card">
            <span className="hmc-time">
              {new Date(h.time).toLocaleTimeString([], { hour: '2-digit' })}
            </span>
            <img src={h.icon} alt={h.description} className="hmc-icon" />
            <span className="hmc-temp">{h.temp.toFixed()}°</span>
            <span className="hmc-humid">{h.humidity}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyChart;
