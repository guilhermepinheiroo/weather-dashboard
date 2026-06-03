import { motion } from "framer-motion";
import { Heart, Wind, Droplets, Eye, Gauge, Thermometer, Sunrise, Sunset, Navigation } from "lucide-react";
import { getWeatherIconUrl, } from "../services/weatherApi";
import {
  formatTemp, formatDate, formatTime, capitalizeFirst, formatWindSpeed, getWindDirection
} from "../utils/weatherUtils";

const StatCard = ({ icon, label, value, sub }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass rounded-2xl p-4 glass-hover cursor-default"
  >
    <div className="flex items-center gap-2 text-white/50 text-xs font-display font-medium tracking-wide uppercase mb-2">
      {icon}
      {label}
    </div>
    <div className="text-white font-display font-bold text-lg">{value}</div>
    {sub && <div className="text-white/40 text-xs mt-0.5 font-body">{sub}</div>}
  </motion.div>
);

const WeatherCard = ({ weather, unit, onToggleFavorite, isFavorite, onToggleUnit }) => {
  if (!weather) return null;

  const { name, sys, main, wind, visibility, weather: conditions, dt, timezone } = weather;
  const condition = conditions[0];
  const feelsLike = formatTemp(main.feels_like, unit);
  const temp = formatTemp(main.temp, unit);
  const tempMin = formatTemp(main.temp_min, unit);
  const tempMax = formatTemp(main.temp_max, unit);
  const windSpeed = formatWindSpeed(wind.speed, unit);
  const windDir = getWindDirection(wind.deg);
  const visibilityKm = visibility ? `${(visibility / 1000).toFixed(1)} km` : "—";
  const sunriseTime = formatTime(sys.sunrise, timezone);
  const sunsetTime = formatTime(sys.sunset, timezone);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 md:p-8 w-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-white/60 text-sm font-body mb-1">
            <Navigation size={13} />
            <span>{sys.country}</span>
          </div>
          <h1 className="text-white font-display font-bold text-3xl md:text-4xl leading-tight">{name}</h1>
          <p className="text-white/50 text-sm font-body mt-1">{formatDate(dt, timezone)}</p>
          <p className="text-white/70 text-base font-mono mt-0.5">{formatTime(dt, timezone)}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleFavorite(name)}
            className="p-2.5 rounded-xl glass-hover glass transition-all"
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              size={18}
              className={isFavorite ? "text-red-400 fill-red-400" : "text-white/50"}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleUnit}
            className="px-3 py-1.5 rounded-xl glass text-white/70 hover:text-white text-sm font-mono font-medium transition-all glass-hover"
          >
            °{unit === "metric" ? "C" : "F"}
          </motion.button>
        </div>
      </div>

      {/* Main temperature */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            src={getWeatherIconUrl(condition.icon, "4x")}
            alt={condition.description}
            className="w-24 h-24 drop-shadow-2xl"
          />
          <div>
            <div className="text-white font-display font-bold text-7xl md:text-8xl leading-none tracking-tight">
              {temp}
            </div>
            <p className="text-white/70 text-lg font-body mt-1 capitalize">{capitalizeFirst(condition.description)}</p>
            <p className="text-white/40 text-sm font-body">
              Sensação: <span className="text-white/60 font-medium">{feelsLike}</span>
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-wrap gap-2 md:justify-end">
          <div className="glass rounded-xl px-3 py-2 text-sm">
            <span className="text-white/40 font-body">Mín </span>
            <span className="text-blue-300 font-display font-semibold">{tempMin}</span>
          </div>
          <div className="glass rounded-xl px-3 py-2 text-sm">
            <span className="text-white/40 font-body">Máx </span>
            <span className="text-orange-300 font-display font-semibold">{tempMax}</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard
          icon={<Droplets size={13} />}
          label="Umidade"
          value={`${main.humidity}%`}
          sub={main.humidity > 70 ? "Alta" : main.humidity > 40 ? "Normal" : "Baixa"}
        />
        <StatCard
          icon={<Wind size={13} />}
          label="Vento"
          value={windSpeed}
          sub={`Dir: ${windDir}`}
        />
        <StatCard
          icon={<Eye size={13} />}
          label="Visibilidade"
          value={visibilityKm}
        />
        <StatCard
          icon={<Gauge size={13} />}
          label="Pressão"
          value={`${main.pressure} hPa`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Sunrise size={13} />}
          label="Nascer do Sol"
          value={sunriseTime}
        />
        <StatCard
          icon={<Sunset size={13} />}
          label="Pôr do Sol"
          value={sunsetTime}
        />
      </div>
    </motion.div>
  );
};

export default WeatherCard;
