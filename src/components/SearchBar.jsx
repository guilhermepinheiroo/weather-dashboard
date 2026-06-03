import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, X, Trash2 } from "lucide-react";

const SearchBar = ({ onSearch, onGeolocate, searchHistory, onClearHistory, loading }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const filteredHistory = searchHistory.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase()) && city !== ""
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleHistoryClick = (city) => {
    setQuery(city);
    onSearch(city);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar cidade... (ex: São Paulo, London, Tokyo)"
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl glass text-white font-body text-sm transition-all duration-300 focus:ring-2 focus:ring-white/30 focus:border-white/30 placeholder-white/40"
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading || !query.trim()}
            className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-display font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap border border-white/20"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              "Buscar"
            )}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={onGeolocate}
            disabled={loading}
            title="Usar minha localização"
            className="p-3.5 rounded-2xl glass hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300 disabled:opacity-40 border border-white/10"
          >
            <MapPin size={18} />
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && filteredHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full rounded-2xl glass-dark overflow-hidden z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
              <span className="text-white/50 text-xs font-display font-medium tracking-widest uppercase flex items-center gap-1.5">
                <Clock size={11} /> Histórico
              </span>
              <button
                onClick={onClearHistory}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
            {filteredHistory.slice(0, 6).map((city, i) => (
              <motion.button
                key={city}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleHistoryClick(city)}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-left text-sm font-body"
              >
                <Clock size={13} className="text-white/30 flex-shrink-0" />
                {city}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
