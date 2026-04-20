import React from 'react';
import './Descriptions.css';
import { FaArrowUp, FaArrowDown, FaWind, FaEye } from 'react-icons/fa';
import { BiHappy } from 'react-icons/bi';
import { MdCompress, MdOutlineWaterDrop, MdCloud } from 'react-icons/md';

const Descriptions = ({ weather, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  const cards = [
    { icon: <FaArrowDown />, title: 'Min Temp', data: `${weather.temp_min.toFixed()}${tempUnit}`, color: '#74b9ff' },
    { icon: <FaArrowUp />, title: 'Max Temp', data: `${weather.temp_max.toFixed()}${tempUnit}`, color: '#fd79a8' },
    { icon: <BiHappy />, title: 'Feels Like', data: `${weather.feels_like.toFixed()}${tempUnit}`, color: '#fdcb6e' },
    { icon: <MdCompress />, title: 'Pressure', data: `${weather.pressure} hPa`, color: '#a29bfe' },
    { icon: <MdOutlineWaterDrop />, title: 'Humidity', data: `${weather.humidity}%`, color: '#55efc4' },
    { icon: <FaWind />, title: 'Wind Speed', data: `${weather.speed.toFixed(1)} ${windUnit}`, color: '#81ecec' },
    { icon: <MdCloud />, title: 'Cloud Cover', data: `${weather.cloudiness}%`, color: '#dfe6e9' },
    {
      icon: <FaEye />,
      title: 'Visibility',
      data: weather.visibility !== null ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A',
      color: '#ffeaa7',
    },
  ];

  return (
    <div className="descriptions-grid">
      {cards.map((card, i) => (
        <div key={i} className="desc-card" style={{ '--card-accent': card.color }}>
          <div className="desc-icon" style={{ color: card.color }}>{card.icon}</div>
          <div className="desc-info">
            <span className="desc-title">{card.title}</span>
            <span className="desc-data">{card.data}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Descriptions;
