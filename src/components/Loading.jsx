import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 mt-6 animate-fade-in">
      {/* Main card skeleton */}
      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="h-5 w-32 rounded-full shimmer-loading" />
            <div className="h-16 w-48 rounded-2xl shimmer-loading" />
            <div className="h-5 w-44 rounded-full shimmer-loading" />
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 rounded-2xl shimmer-loading" />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-28 h-28 rounded-full shimmer-loading" />
            <div className="h-5 w-24 rounded-full shimmer-loading" />
          </div>
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 space-y-3">
            <div className="h-4 w-12 rounded-full shimmer-loading mx-auto" />
            <div className="w-10 h-10 rounded-full shimmer-loading mx-auto" />
            <div className="h-4 w-14 rounded-full shimmer-loading mx-auto" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="glass rounded-3xl p-6">
        <div className="h-4 w-40 rounded-full shimmer-loading mb-4" />
        <div className="h-44 rounded-2xl shimmer-loading" />
      </div>
    </div>
  );
};

export default Loading;
