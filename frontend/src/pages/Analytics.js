import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getAnalytics } from "../api/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        console.log("Analytics error:", err);
      }
    };

    load();
  }, []);

  if (!analytics) {
    return <div className="card">Loading analytics...</div>;
  }

  const chartData = {
    labels: ["Products", "Quantity", "Inventory Value", "Avg Price"],
    datasets: [
      {
        label: "Inventory Overview",
        data: [
          analytics.totalProducts,
          analytics.totalQuantity,
          analytics.totalInventoryValue,
          analytics.averagePrice
        ],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb"
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" }
      }
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="card">
        <h2>Analytics Overview</h2>
        <p>Live inventory insights powered by backend data</p>
      </div>

      {/* STATS GRID */}
      <div className="statsGrid">
        <div className="statCard">
          <div className="statTitle">Total Products</div>
          <div className="statValue">{analytics.totalProducts}</div>
        </div>

        <div className="statCard">
          <div className="statTitle">Total Quantity</div>
          <div className="statValue">{analytics.totalQuantity}</div>
        </div>

        <div className="statCard">
          <div className="statTitle">Inventory Value</div>
          <div className="statValue">
            ${analytics.totalInventoryValue.toFixed(2)}
          </div>
        </div>

        <div className="statCard">
          <div className="statTitle">Average Price</div>
          <div className="statValue">
            ${analytics.averagePrice.toFixed(2)}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="card">
        <h3>📈 Growth Trend</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}