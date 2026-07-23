import { useCallback, useEffect, useState } from "react";
import MetricCard from "../components/MetricCard";
import { ErrorState, LoadingState } from "../components/PageState";
import { getAnalytics, getApiError, getLowStock } from "../api/api";
import { formatCurrency, formatNumber } from "../utils/format";

export default function Home() {
  const [lowStock, setLowStock] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [analyticsResponse, lowStockResponse] = await Promise.all([
        getAnalytics(),
        getLowStock()
      ]);
      setAnalytics(analyticsResponse.data);
      setLowStock(lowStockResponse.data);
    } catch (requestError) {
      setError(getApiError(requestError, "Check that the backend service is running."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error && !analytics) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!analytics) {
    return <LoadingState />;
  }

  const healthyProducts = Math.max(
    analytics.totalProducts - analytics.lowStockProducts - analytics.outOfStockProducts,
    0
  );

  return (
    <div className="pageStack">
      <section className="heroPanel">
        <div>
          <p className="eyebrow">Stock health at a glance</p>
          <h1>Inventory overview</h1>
          <p>Monitor the metrics that need attention before they affect operations.</p>
        </div>
        <div className="livePill"><span /> Live data</div>
      </section>

      <section className="statsGrid" aria-label="Inventory summary">
        <MetricCard
          label="Inventory value"
          value={formatCurrency(analytics.totalInventoryValue)}
          detail="Current on-hand value"
          tone="blue"
        />
        <MetricCard
          label="Units in stock"
          value={formatNumber(analytics.totalQuantity)}
          detail={`Across ${formatNumber(analytics.totalProducts)} products`}
          tone="violet"
        />
        <MetricCard
          label="Healthy products"
          value={formatNumber(healthyProducts)}
          detail="More than 5 units available"
          tone="green"
        />
        <MetricCard
          label="Needs attention"
          value={formatNumber(analytics.lowStockProducts + analytics.outOfStockProducts)}
          detail={`${analytics.outOfStockProducts} out of stock`}
          tone="orange"
        />
      </section>

      <section className="card">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Replenishment queue</p>
            <h2>Low-stock products</h2>
          </div>
          <span className="countBadge">{lowStock.length} products</span>
        </div>

        {lowStock.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">✓</div>
            <h3>Stock levels look healthy</h3>
            <p>No products are at or below the five-unit threshold.</p>
          </div>
        ) : (
          <div className="alertList">
            {lowStock.map((product) => (
              <div className="alertRow" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.sku} · {product.category}</span>
                </div>
                <span className={`stockBadge ${product.quantity === 0 ? "out" : "low"}`}>
                  {product.quantity === 0 ? "Out of stock" : `${product.quantity} left`}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
