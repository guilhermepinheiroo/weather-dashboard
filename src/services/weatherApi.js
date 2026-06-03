import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const api = axios.create({ baseURL: BASE_URL });

export const fetchCurrentWeather = async (city, units = "metric") => {
  const { data } = await api.get("/weather", {
    params: { q: city, appid: API_KEY, units, lang: "pt_br" },
  });
  return data;
};

export const fetchWeatherByCoords = async (lat, lon, units = "metric") => {
  const { data } = await api.get("/weather", {
    params: { lat, lon, appid: API_KEY, units, lang: "pt_br" },
  });
  return data;
};

export const fetchForecast = async (city, units = "metric") => {
  const { data } = await api.get("/forecast", {
    params: { q: city, appid: API_KEY, units, cnt: 40, lang: "pt_br" },
  });
  return data;
};

export const fetchForecastByCoords = async (lat, lon, units = "metric") => {
  const { data } = await api.get("/forecast", {
    params: { lat, lon, appid: API_KEY, units, cnt: 40, lang: "pt_br" },
  });
  return data;
};

export const getWeatherIconUrl = (icon, size = "2x") =>
  `https://openweathermap.org/img/wn/${icon}@${size}.png`;

export const processForecast = (forecastData) => {
  const dailyMap = {};
  forecastData.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(item);
  });
  return Object.entries(dailyMap)
    .slice(0, 6)
    .map(([date, items]) => {
      const temps = items.map((i) => i.main.temp);
      const middle = items[Math.floor(items.length / 2)];
      return {
        date,
        tempMin: Math.min(...temps),
        tempMax: Math.max(...temps),
        icon: middle.weather[0].icon,
        description: middle.weather[0].description,
        humidity: middle.main.humidity,
        pop: Math.max(...items.map((i) => i.pop || 0)),
        hourly: items,
      };
    });
};

export const getHourlyForecast = (forecastData) => {
  return forecastData.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000),
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    pop: item.pop || 0,
  }));
};
