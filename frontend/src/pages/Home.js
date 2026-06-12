import { useEffect, useState } from "react";
import { getLowStock, getAnalytics } from "../api/api";

export default function Home() {

  const [lowStock, setLowStock] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const load = async () => {
    const a = await getAnalytics();
    setAnalytics(a.data);

    const l = await getLowStock();
    setLowStock(l.data);
  };

  useEffect(() => {
    load();

    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statTitle">Revenue</div>
          <div className="statValue">${analytics?.revenue?.toFixed(2) || 0}</div>
        </div>

        <div className="statCard">
          <div className="statTitle">Profit</div>
          <div className="statValue">${analytics?.profit?.toFixed(2) || 0}</div>
        </div>

        <div className="statCard">
          <div className="statTitle">Products</div>
          <div className="statValue">{analytics?.totalProducts || 0}</div>
        </div>

        <div className="statCard">
          <div className="statTitle">Quantity</div>
          <div className="statValue">{analytics?.totalQuantity || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>🔔 Low Stock Alerts</h2>

        {lowStock.length === 0 ? (
          <p>All stock healthy ✅</p>
        ) : (
          lowStock.map(p => (
            <div key={p.id}>
              ⚠️ {p.name} ({p.quantity} left)
            </div>
          ))
        )}
      </div>

    </div>
  );
}