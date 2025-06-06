// Overview.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./adminDashboard.scss";

const Overview = () => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const res = await fetch("/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();

        // ✅ Only include confirmed bookings with status "Confirmed"
        const confirmed = data.filter(
          (b) =>
            b.confirmed === true &&
            b.status === "Confirmed" &&
            new Date(b.createdAt).getFullYear() === new Date().getFullYear()
        );

        const monthCounts = Array(12).fill(0);
        confirmed.forEach((b) => {
          const monthIndex = new Date(b.createdAt).getMonth();
          monthCounts[monthIndex]++;
        });

        const formatted = monthCounts.map((count, i) => ({
          month: new Date(0, i).toLocaleString("default", { month: "short" }),
          bookings: count,
        }));

        setMonthlyData(formatted);
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      }
    };

    fetchMonthlyStats();
  }, []);

  return (
    <div className="overview-container">
      <h2>Monthly Bookings Overview - {new Date().getFullYear()}</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyData} margin={{ top: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Bar dataKey="bookings" fill="#4f8df7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
