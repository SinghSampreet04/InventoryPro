import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getApiError, getCategoryAnalytics } from "../api/api";
import { ErrorState, LoadingState } from "../components/PageState";
import { formatCurrency, formatNumber } from "../utils/format";

export default function Dashboard() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await getCategoryAnalytics();
      setCategories(response.data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load category performance."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error && !categories) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!categories) {
    return <LoadingState message="Building category dashboard…" />;
  }

  return (
    <div className="pageStack">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Category performance</p>
          <h1>Inventory dashboard</h1>
          <p>Compare on-hand value and unit volume across your product catalog.</p>
        </div>
      </section>

      <section className="card chartCard">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Value distribution</p>
            <h2>Inventory value by category</h2>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="emptyState">
            <h3>No chart data yet</h3>
            <p>Add a product to start building your dashboard.</p>
          </div>
        ) : (
          <div className="chartWrap" aria-label="Inventory value by category chart">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={categories} margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" vertical={false} />
                <XAxis dataKey="category" stroke="#8fa2ba" tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#8fa2ba"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(51, 102, 255, .08)" }}
                  contentStyle={{
                    background: "#111d2f",
                    border: "1px solid rgba(148,163,184,.2)",
                    borderRadius: 10
                  }}
                  formatter={(value) => [formatCurrency(value), "Inventory value"]}
                />
                <Bar dataKey="inventoryValue" fill="#4f7cff" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="categoryGrid">
        {categories.map((category) => (
          <article className="categoryCard" key={category.category}>
            <div className="categoryDot" />
            <h3>{category.category}</h3>
            <strong>{formatCurrency(category.inventoryValue)}</strong>
            <p>{formatNumber(category.totalQuantity)} units · {category.productCount} products</p>
          </article>
        ))}
      </section>
    </div>
  );
}
