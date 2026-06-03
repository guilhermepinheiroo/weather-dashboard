import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Wind, CloudLightning } from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { getWeatherBackground } from "../utils/weatherUtils";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastSection from "../components/ForecastCard";
import Favorites from "../components/Favorites";
import Loading from "../components/Loading";
import TempChart from "../components/TempChart";

const EmptyState = ({ onGeolocate }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center"
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="mb-6"
    >
      <CloudLightning size={64} className="text-white/30" />
    </motion.div>
    <h2 className="text-white/80 font-display font-bold text-2xl mb-2">
      Bem-vindo ao Weath
    </h2>
    <p className="text-white/40 font-body text-sm max-w-xs leading-relaxed mb-6">
      Busque qualquer cidade do mundo ou use sua localização atual para ver o clima em tempo real.
    </p>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onGeolocate}
      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white/80 hover:text-white text-sm font-display font-medium transition-all border border-white/15"
    >
      <Wind size={16} />
      Usar minha localização
    </motion.button>
  </motion.div>
);

const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center gap-3 glass rounded-2xl p-4 text-red-300 mt-4 max-w-2xl mx-auto"
  >
    <AlertCircle size={18} className="flex-shrink-0" />
    <p className="font-body text-sm">{message}</p>
  </motion.div>
);

const Home = () => {
  const {
    weather, forecast, hourly, loading, error, unit,
    searchHistory, favorites, searchCity, searchByLocation,
    toggleUnit, toggleFavorite, isFavorite, clearHistory,
  } = useWeather();

  const bgClass = getWeatherBackground(weather);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${bgClass}`}>
      {/* Subtle overlay for depth */}
      <div className="min-h-screen bg-black/20">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-10"
          >
            <div className="flex items-center gap-2 mb-1">
              <CloudLightning size={20} className="text-white/70" />
              <span className="text-white/50 font-display text-xs tracking-widest uppercase font-semibold">
                Weath - Weather Dashboard
              </span>
            </div>
            <h1 className="text-white font-display font-bold text-3xl md:text-4xl">
              Clima ao Vivo
            </h1>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <SearchBar
              onSearch={searchCity}
              onGeolocate={searchByLocation}
              searchHistory={searchHistory}
              onClearHistory={clearHistory}
              loading={loading}
            />
          </motion.div>

          {/* Favorites */}
          <AnimatePresence>
            {favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Favorites
                  favorites={favorites}
                  onSelect={searchCity}
                  onRemove={toggleFavorite}
                  currentCity={weather?.name}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && <ErrorMessage message={error} />}
          </AnimatePresence>

          {/* Loading */}
          <AnimatePresence>
            {loading && <Loading />}
          </AnimatePresence>

          {/* Weather data */}
          <AnimatePresence>
            {!loading && weather && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 mt-2"
              >
                <WeatherCard
                  weather={weather}
                  unit={unit}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(weather?.name)}
                  onToggleUnit={toggleUnit}
                />
                <ForecastSection forecast={forecast} unit={unit} />
                <TempChart hourly={hourly} unit={unit} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          <AnimatePresence>
            {!loading && !weather && !error && (
              <EmptyState onGeolocate={searchByLocation} />
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-16 text-white/20 text-xs font-body"
          >
            Powered by OpenWeatherMap API
          </motion.footer>
        </div>
      </div>
    </div>
  );
};

export default Home;
