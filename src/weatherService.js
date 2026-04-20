const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org';

const makeIconURL = (iconId) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch weather data');
  return data;
};

const formatCurrent = (data) => ({
  description: data.weather[0].description,
  iconURL: makeIconURL(data.weather[0].icon),
  weatherId: data.weather[0].id,
  temp: data.main.temp,
  feels_like: data.main.feels_like,
  temp_min: data.main.temp_min,
  temp_max: data.main.temp_max,
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  speed: data.wind.speed,
  visibility: data.visibility ?? null,
  rain: data.rain?.['1h'] ?? 0,
  cloudiness: data.clouds?.all ?? 0,
  country: data.sys.country,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  name: data.name,
  timezone: data.timezone,
  lat: data.coord.lat,
  lon: data.coord.lon,
});

const formatForecast = (data) => {
  const hourly = data.list.slice(0, 8).map((item) => ({
    time: item.dt * 1000,
    temp: item.main.temp,
    icon: makeIconURL(item.weather[0].icon),
    description: item.weather[0].description,
    humidity: item.main.humidity,
  }));

  const dayMap = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    const hour = new Date(item.dt * 1000).getHours();
    if (
      !dayMap[date] ||
      Math.abs(hour - 12) < Math.abs(new Date(dayMap[date].time).getHours() - 12)
    ) {
      dayMap[date] = {
        time: item.dt * 1000,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        icon: makeIconURL(item.weather[0].icon),
        description: item.weather[0].description,
      };
    }
  });

  return { hourly, daily: Object.values(dayMap).slice(0, 5) };
};

export const getWeatherByCity = async (city, units = 'metric') => {
  const res = await fetch(
    `${BASE}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`
  );
  return formatCurrent(await handleResponse(res));
};

export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  const res = await fetch(
    `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  );
  return formatCurrent(await handleResponse(res));
};

export const getForecast = async (city, units = 'metric') => {
  const res = await fetch(
    `${BASE}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`
  );
  return formatForecast(await handleResponse(res));
};

export const getForecastByCoords = async (lat, lon, units = 'metric') => {
  const res = await fetch(
    `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
  );
  return formatForecast(await handleResponse(res));
};

export const getAirQuality = async (lat, lon) => {
  try {
    const res = await fetch(
      `${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await handleResponse(res);
    const { aqi } = data.list[0].main;
    const components = data.list[0].components;
    const labels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const colors = ['', '#00b894', '#fdcb6e', '#e17055', '#d63031', '#6c5ce7'];
    return { aqi, label: labels[aqi], color: colors[aqi], ...components };
  } catch {
    return null;
  }
};
