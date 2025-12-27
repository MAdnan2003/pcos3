import { TrendingUp, Calendar, Activity, AlertCircle } from "lucide-react";

export function CycleStats({ stats }) {
  const getDaysSince = (dateStr) => {
    if (!dateStr) return null;
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysSinceLastPeriod = getDaysSince(stats.lastPeriod);

  const items = [
    { icon: Calendar, label: "Since last period", value: daysSinceLastPeriod ? `${daysSinceLastPeriod}d` : "—" },
    { icon: TrendingUp, label: "Avg cycle length", value: stats.averageLength ? `${stats.averageLength}d` : "—" },
    { icon: Activity, label: "Variability", value: stats.variability ? `±${stats.variability / 2}d` : "—" },
    {
      icon: AlertCircle,
      label: "Range",
      value: stats.shortestCycle && stats.longestCycle
        ? `${stats.shortestCycle}-${stats.longestCycle}d`
        : "—"
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Cycle Insights
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-card p-4 flex gap-3 items-center">
            <Icon className="text-purple-600" />
            <div>
              <p className="text-lg font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
