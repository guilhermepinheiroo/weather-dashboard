import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Chart, registerables } from "chart.js";
import { formatTemp } from "../utils/weatherUtils";

Chart.register(...registerables);

const TempChart = ({ hourly, unit }) => {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!hourly?.length || !chartRef.current) return;

    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const labels = hourly.map((h) =>
      h.time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
    const temps = hourly.map((h) => Math.round(h.temp));
    const pops = hourly.map((h) => Math.round(h.pop * 100));

    instanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `Temperatura (${unit === "metric" ? "°C" : "°F"})`,
            data: temps,
            borderColor: "rgba(251, 191, 36, 0.9)",
            backgroundColor: "rgba(251, 191, 36, 0.12)",
            borderWidth: 2.5,
            pointBackgroundColor: "rgba(251, 191, 36, 1)",
            pointBorderColor: "rgba(255,255,255,0.5)",
            pointBorderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
            yAxisID: "y",
          },
          {
            label: "Chuva (%)",
            data: pops,
            borderColor: "rgba(96, 165, 250, 0.7)",
            backgroundColor: "rgba(96, 165, 250, 0.08)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(96, 165, 250, 0.9)",
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.4,
            yAxisID: "y1",
            borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "rgba(255,255,255,0.5)",
              font: { family: "'DM Sans', sans-serif", size: 11 },
              boxWidth: 20,
              padding: 16,
            },
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.7)",
            titleColor: "rgba(255,255,255,0.9)",
            bodyColor: "rgba(255,255,255,0.7)",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            padding: 12,
            titleFont: { family: "'Syne', sans-serif", size: 12 },
            bodyFont: { family: "'DM Sans', sans-serif", size: 11 },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
            ticks: { color: "rgba(255,255,255,0.4)", font: { family: "'JetBrains Mono'", size: 11 } },
            border: { display: false },
          },
          y: {
            position: "left",
            grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
            ticks: {
              color: "rgba(251, 191, 36, 0.6)",
              font: { family: "'JetBrains Mono'", size: 11 },
              callback: (v) => `${v}${unit === "metric" ? "°C" : "°F"}`,
            },
            border: { display: false },
          },
          y1: {
            position: "right",
            min: 0,
            max: 100,
            grid: { display: false },
            ticks: {
              color: "rgba(96, 165, 250, 0.5)",
              font: { family: "'JetBrains Mono'", size: 11 },
              callback: (v) => `${v}%`,
            },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      if (instanceRef.current) instanceRef.current.destroy();
    };
  }, [hourly, unit]);

  if (!hourly?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass rounded-3xl p-6 w-full"
    >
      <h2 className="text-white/60 text-xs font-display font-semibold tracking-widest uppercase mb-4">
        Próximas 24 horas — Temperatura & Chuva
      </h2>
      <div className="h-48">
        <canvas ref={chartRef} />
      </div>
    </motion.div>
  );
};

export default TempChart;
