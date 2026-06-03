import { useState, useCallback } from "react";
import {
  fetchCurrentWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
  processForecast,
  getHourlyForecast,
} from "../services/weatherApi";

const MAX_HISTORY = 8;

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weather_history") || "[]");
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weather_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const addToHistory = useCallback((city) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem("weather_history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem("weather_history");
  }, []);

  const searchCity = useCallback(async (city, currentUnit = unit) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, currentUnit),
        fetchForecast(city, currentUnit),
      ]);
      setWeather(weatherData);
      setForecast(processForecast(forecastData));
      setHourly(getHourlyForecast(forecastData));
      addToHistory(weatherData.name);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Cidade não encontrada. Verifique o nome e tente novamente.");
      } else if (err.response?.status === 401) {
        setError("Chave de API inválida. Configure sua VITE_OPENWEATHER_API_KEY.");
      } else {
        setError("Erro ao buscar dados. Verifique sua conexão.");
      }
      setWeather(null);
      setForecast([]);
      setHourly([]);
    } finally {
      setLoading(false);
    }
  }, [unit, addToHistory]);

  const searchByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada neste navegador.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const [weatherData, forecastData] = await Promise.all([
            fetchWeatherByCoords(coords.latitude, coords.longitude, unit),
            fetchForecastByCoords(coords.latitude, coords.longitude, unit),
          ]);
          setWeather(weatherData);
          setForecast(processForecast(forecastData));
          setHourly(getHourlyForecast(forecastData));
          addToHistory(weatherData.name);
        } catch {
          setError("Erro ao buscar clima da sua localização.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permissão de localização negada.");
        setLoading(false);
      }
    );
  }, [unit, addToHistory]);

  const toggleUnit = useCallback(() => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (weather) searchCity(weather.name, newUnit);
  }, [unit, weather, searchCity]);

  const toggleFavorite = useCallback((city) => {
    setFavorites((prev) => {
      const exists = prev.some((c) => c.toLowerCase() === city.toLowerCase());
      const updated = exists
        ? prev.filter((c) => c.toLowerCase() !== city.toLowerCase())
        : [...prev, city];
      localStorage.setItem("weather_favorites", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (city) => favorites.some((c) => c.toLowerCase() === city?.toLowerCase()),
    [favorites]
  );

  return {
    weather, forecast, hourly, loading, error, unit,
    searchHistory, favorites, searchCity, searchByLocation,
    toggleUnit, toggleFavorite, isFavorite, clearHistory,
  };
};
