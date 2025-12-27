import { useEffect, useState } from "react";
import axios from "axios";

export default function RecentActivity() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stats/recent-activity")
      .then((res) => setActivity(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>

      {activity.length === 0 ? (
        <p className="text-gray-400 text-sm">No recent activity</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {activity.map((a, i) => (
            <li
              key={i}
              className="flex items-center justify-between border-b pb-2 last:border-none"
            >
              <span>
                <b className="text-purple-600">{a.user}</b>{" "}
                <span className="text-gray-600">{a.action}</span>
              </span>

              <span className="text-gray-400 text-xs">
                {new Date(a.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
