import { motion } from "framer-motion";
import { Droplets, CloudRain } from "lucide-react";
import { getWeatherIconUrl } from "../services/weatherApi";
import { formatTemp, formatDayOfWeek, capitalizeFirst } from "../utils/weatherUtils";

const ForecastCard = ({ day, index, unit }) => {
  const dayLabel = formatDayOfWeek(day.date);
  const isToday = dayLabel === "Hoje";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`glass rounded-2xl p-4 flex flex-col items-center gap-2 glass-hover cursor-default ${
        isToday ? "ring-1 ring-white/30" : ""
      }`}
    >
      <span className={`font-display font-semibold text-sm ${isToday ? "text-white" : "text-white/60"}`}>
        {dayLabel}
      </span>

      <img
        src={getWeatherIconUrl(day.icon)}
        alt={day.description}
        className="w-12 h-12 drop-shadow-lg"
      />

      <p className="text-white/50 text-xs text-center font-body capitalize leading-tight">
        {capitalizeFirst(day.description)}
      </p>

      <div className="flex flex-col items-center gap-0.5 w-full mt-1">
        <span className="text-white font-display font-bold text-base">
          {formatTemp(day.tempMax, unit)}
        </span>
        <span className="text-blue-300/70 font-display text-sm">
          {formatTemp(day.tempMin, unit)}
        </span>
      </div>

      {day.pop > 0.05 && (
        <div className="flex items-center gap-1 text-blue-300/70 text-xs font-body">
          <CloudRain size={11} />
          <span>{Math.round(day.pop * 100)}%</span>
        </div>
      )}

      <div className="flex items-center gap-1 text-white/40 text-xs font-body">
        <Droplets size={10} />
        <span>{day.humidity}%</span>
      </div>
    </motion.div>
  );
};

const ForecastSection = ({ forecast, unit }) => {
  if (!forecast.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="w-full"
    >
      <h2 className="text-white/60 text-xs font-display font-semibold tracking-widest uppercase mb-3 px-1">
        Previsão para 5 dias
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {forecast.slice(0, 6).map((day, i) => (
          <ForecastCard key={day.date} day={day} index={i} unit={unit} />
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastSection;
