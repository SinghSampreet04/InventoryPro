export default function MetricCard({ label, value, detail, tone = "blue" }) {
  return (
    <article className="statCard">
      <div className={`statIcon ${tone}`} aria-hidden="true" />
      <div className="statTitle">{label}</div>
      <div className="statValue">{value}</div>
      {detail && <div className="statDetail">{detail}</div>}
    </article>
  );
}
