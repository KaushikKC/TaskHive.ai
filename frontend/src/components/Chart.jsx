import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

const Chart = () => {
  const chartRef = useRef(null);

  // Initialize chartData with default empty structure
  const [chartData, setChartData] = React.useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const chart = chartRef.current?.ctx;

    if (chart) {
      // Gradient for BTC
      const gradient1 = chart.createLinearGradient(0, 0, 0, 400);
      gradient1.addColorStop(0, "rgba(255, 99, 132, 0.6)");
      gradient1.addColorStop(1, "rgba(255, 99, 132, 0)");

      // Gradient for SOL
      const gradient2 = chart.createLinearGradient(0, 0, 0, 400);
      gradient2.addColorStop(0, "rgba(54, 162, 235, 0.6)");
      gradient2.addColorStop(1, "rgba(54, 162, 235, 0)");

      // Gradient for LTC
      const gradient3 = chart.createLinearGradient(0, 0, 0, 400);
      gradient3.addColorStop(0, "rgba(255, 206, 86, 0.6)");
      gradient3.addColorStop(1, "rgba(255, 206, 86, 0)");

      setChartData({
        labels: ["11:59PM", "12:59AM", "1:59AM", "2:59AM", "3:59AM", "4:59AM"],
        datasets: [
          {
            label: "BTC",
            data: [3000, 3500, 4000, 4500, 5000, 5500],
            borderColor: "#FF6384",
            backgroundColor: gradient1,
            tension: 0.4,
            fill: true,
          },
          {
            label: "ETH",
            data: [3200, 3600, 3900, 4200, 4800, 5000],
            borderColor: "#36A2EB",
            backgroundColor: gradient2,
            tension: 0.4,
            fill: true,
          },
          {
            label: "LTC",
            data: [3100, 3400, 3800, 4000, 4700, 5300],
            borderColor: "#FFCE56",
            backgroundColor: gradient3,
            tension: 0.4,
            fill: true,
          },
        ],
      });
    }
  }, []);

  return (
    <div className="w-full h-[300px] max-w-4xl mx-auto p-4 bg-black rounded-lg shadow-lg">
      <Line
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#FFFFFF",
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#AAAAAA" },
              grid: { display: false },
            },
            y: {
              ticks: { color: "#AAAAAA" },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;
