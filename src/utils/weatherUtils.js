export const getWeatherBackground = (weatherData) => {
  if (!weatherData) return "bg-default";
  const id = weatherData.weather[0].id;
  const icon = weatherData.weather[0].icon;
  const isNight = icon.endsWith("n");

  if (isNight) return "bg-night";
  if (id >= 200 && id < 300) return "bg-stormy";
  if (id >= 300 && id < 600) return "bg-rainy";
  if (id >= 600 && id < 700) return "bg-snowy";
  if (id >= 700 && id < 800) return "bg-foggy";
  if (id === 800) return "bg-sunny";
  if (id > 800) return "bg-cloudy";
  return "bg-default";
};

export const formatTemp = (temp, unit) => {
  const rounded = Math.round(temp);
  return unit === "imperial" ? `${rounded}°F` : `${rounded}°C`;
};

export const formatDate = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const formatTime = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

export const formatDayOfWeek = (dateStr) => {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === tomorrow.toDateString()) return "Amanhã";
  return date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").charAt(0).toUpperCase() + date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").slice(1);
};

export const formatWindSpeed = (speed, unit) => {
  if (unit === "imperial") return `${Math.round(speed)} mph`;
  return `${Math.round(speed * 3.6)} km/h`;
};

export const getUVLabel = (uv) => {
  if (uv <= 2) return { label: "Baixo", color: "text-green-400" };
  if (uv <= 5) return { label: "Moderado", color: "text-yellow-400" };
  if (uv <= 7) return { label: "Alto", color: "text-orange-400" };
  if (uv <= 10) return { label: "Muito Alto", color: "text-red-400" };
  return { label: "Extremo", color: "text-purple-400" };
};

export const getWindDirection = (deg) => {
  const dirs = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
};

export const capitalizeFirst = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);
