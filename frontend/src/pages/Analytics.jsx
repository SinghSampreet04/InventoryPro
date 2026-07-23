import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { getAnalytics, getApiError, getCategoryAnalytics } from "../api/api";
import MetricCard from "../components/MetricCard";
import { ErrorState, LoadingState } from "../components/PageState";
import { formatCurrency, formatNumber } from "../utils/format";

const COLORS = ["#4f7cff", "#8b5cf6", "#23b899", "#f59e5b", "#e9658f", "#22a6e3"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [analyticsResponse, categoriesResponse] = await Promise.all([
        getAnalytics(),
        getCategoryAnalytics()
      ]);
      setAnalytics(analyticsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load analytics."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalCategoryValue = useMemo(
    () => categories.reduce((total, category) => total + Number(category.inventoryValue), 0),
    [categories]
  );

  if (error && !analytics) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!analytics) {
    return <LoadingState message="Calculating inventory analytics…" />;
  }

  return (
    <div className="pageStack">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Portfolio metrics</p>
          <h1>Inventory analytics</h1>
          <p>Understand catalog composition, pricing, and stock risk from current data.</p>
        </div>
      </section>

      <section className="statsGrid">
        <MetricCard
          label="Average product price"
          value={formatCurrency(analytics.averagePrice)}
          detail="Across the full catalog"
          tone="blue"
        />
        <MetricCard
          label="Catalog size"
          value={formatNumber(analytics.totalProducts)}
          detail={`${formatNumber(analytics.totalQuantity)} total units`}
          tone="violet"
        />
        <MetricCard
          label="Low stock"
          value={formatNumber(analytics.lowStockProducts)}
          detail="Between 1 and 5 units"
          tone="orange"
        />
        <MetricCard
          label="Out of stock"
          value={formatNumber(analytics.outOfStockProducts)}
          detail="Immediate action required"
          tone="red"
        />
      </section>

      <section className="analyticsGrid">
        <article className="card">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Catalog mix</p>
              <h2>Value by category</h2>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="emptyState">
              <h3>No analytics data yet</h3>
              <p>Add products to see category distribution.</p>
            </div>
          ) : (
            <div className="donutLayout">
              <div className="donutChart">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="inventoryValue"
                      nameKey="category"
                      innerRadius={68}
                      outerRadius={98}
                      paddingAngle={3}
                    >
                      {categories.map((entry, index) => (
                        <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#111d2f",
                        border: "1px solid rgba(148,163,184,.2)",
                        borderRadius: 10
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donutCenter">
                  <strong>{formatCurrency(totalCategoryValue)}</strong>
                  <span>Total value</span>
                </div>
              </div>

              <div className="legendList">
                {categories.map((category, index) => (
                  <div className="legendRow" key={category.category}>
                    <span style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <strong>{category.category}</strong>
                      <small>{category.productCount} products</small>
                    </div>
                    <b>{formatCurrency(category.inventoryValue)}</b>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="card insightCard">
          <p className="eyebrow">Operational insight</p>
          <h2>Stock risk summary</h2>
          <div className="riskMeter">
            <span
              style={{
                width: `${analytics.totalProducts
                  ? ((analytics.lowStockProducts + analytics.outOfStockProducts) /
                    analytics.totalProducts) * 100
                  : 0}%`
              }}
            />
          </div>
          <p>
            {analytics.totalProducts
              ? `${Math.round(((analytics.lowStockProducts + analytics.outOfStockProducts) /
                analytics.totalProducts) * 100)}% of products need replenishment attention.`
              : "Add products to calculate stock risk."}
          </p>
          <dl className="insightList">
            <div><dt>Total inventory value</dt><dd>{formatCurrency(analytics.totalInventoryValue)}</dd></div>
            <div><dt>Low-stock products</dt><dd>{analytics.lowStockProducts}</dd></div>
            <div><dt>Out-of-stock products</dt><dd>{analytics.outOfStockProducts}</dd></div>
          </dl>
        </article>
      </section>
    </div>
  );
}
