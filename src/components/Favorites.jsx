import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Star } from "lucide-react";

const Favorites = ({ favorites, onSelect, onRemove, currentCity }) => {
  if (!favorites.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <Heart size={13} className="text-red-400 fill-red-400" />
        <h2 className="text-white/60 text-xs font-display font-semibold tracking-widest uppercase">
          Cidades Favoritas
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {favorites.map((city) => {
            const isActive = city.toLowerCase() === currentCity?.toLowerCase();
            return (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl text-sm font-body transition-all duration-200 group cursor-pointer
                  ${isActive
                    ? "bg-white/20 text-white border border-white/30"
                    : "glass text-white/70 hover:text-white glass-hover"
                  }`}
              >
                <button onClick={() => onSelect(city)} className="flex items-center gap-1.5">
                  {isActive && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
                  <span>{city}</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(city); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400 ml-1"
                >
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Favorites;
