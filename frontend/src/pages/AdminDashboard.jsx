import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiCheckCircle,
  FiAlertTriangle,
  FiActivity
} from "react-icons/fi";

import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stats")
      .then((res) => setMetrics(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen p-8 space-y-10 bg-white">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-1">A snapshot of your activity</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers ?? "—"}
          change={metrics?.totalUsersChange ?? 0}
          icon={<FiUsers size={26} />}
          color="from-purple-500 to-pink-500"
        />

        <MetricCard
          title="Active Content"
          value={metrics?.activeContent ?? "—"}
          change={metrics?.activeContentChange ?? 0}
          icon={<FiCheckCircle size={26} />}
          color="from-green-500 to-teal-500"
        />

        <MetricCard
          title="Open Reports"
          value={metrics?.openReports ?? "—"}
          change={metrics?.openReportsChange ?? 0}
          icon={<FiAlertTriangle size={26} />}
          color="from-red-500 to-pink-600"
        />

        <MetricCard
          title="Engagement"
          value={`${metrics?.engagementRate ?? "—"}%`}
          change={metrics?.engagementRateChange ?? 0}
          icon={<FiActivity size={26} />}
          color="from-purple-600 to-pink-600"
        />
      </div>

      {/* RECENT + ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

/* METRIC CARD */
function MetricCard({ title, value, change, icon, color }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white/90 backdrop-blur shadow-sm rounded-xl p-6 border border-purple-200 flex items-center justify-between transition hover:shadow-md">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-gray-800">{value}</h3>

        <p
          className={`text-sm font-semibold mt-2 ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "▲" : "▼"} {change}%
          <span className="text-gray-400 font-normal"> vs last month</span>
        </p>
      </div>

      <div className={`p-3 rounded-lg text-white bg-gradient-to-r ${color}`}>
        {icon}
      </div>
    </div>
  );
}
