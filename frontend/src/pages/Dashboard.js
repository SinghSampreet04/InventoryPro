import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getHistory } from "../api/api";

export default function Dashboard() {

  const [data, setData] = useState([]);

  useEffect(() => {
    getHistory().then(res => {
      setData(res.data.map((v, i) => ({
        name: `T${i}`,
        value: v
      })));
    });
  }, []);

  return (
    <div className="card">
      <h2>📈 Growth Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}