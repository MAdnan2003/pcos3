import { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import ReportRow from "../components/ReportRow";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchReports = async () => {
    const res = await fetch("http://localhost:5000/api/reports");
    setReports(await res.json());
  };

  const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/reports/stats");
    setStats(await res.json());
  };

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen p-8 space-y-10 bg-white">
      <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Reported Issues
        </h1>
        <p className="text-gray-500 mt-1">Moderate and resolve reports submitted by users</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Pending Reports"
          value={stats?.pending ?? "—"}
          icon={<FiClock size={28} />}
          color="bg-pink-500"
        />

        <MetricCard
          title="In Review"
          value={stats?.reviewing ?? "—"}
          icon={<FiAlertTriangle size={28} />}
          color="bg-yellow-500"
        />

        <MetricCard
          title="Resolved This Month"
          value={stats?.resolved ?? "—"}
          icon={<FiCheckCircle size={28} />}
          color="bg-green-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-pink-100">
        <h3 className="text-2xl font-semibold text-gray-800">All Reports</h3>

        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-pink-100 text-gray-500 text-sm">
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Reported By</th>
                <th className="py-3 text-left">Content</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Priority</th>
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <ReportRow key={r._id} report={r} refresh={fetchReports} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>

      <div className={`${color} text-white p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  );
}