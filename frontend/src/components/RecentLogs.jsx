import { useState } from "react";
import { Trash2 } from "lucide-react";

export function RecentLogs({ logs, onDelete }) {
  const [openId, setOpenId] = useState(null);

  if (!logs.length) {
    return (
      <div className="glass-card p-4 text-center text-gray-500">
        No logs yet
      </div>
    );
  }

  const toggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // ⛔ prevent toggle
    if (window.confirm("Delete this period log?")) {
      onDelete(id);
      setOpenId(null);
    }
  };

  return (
    <div className="space-y-3">
      {logs.slice(0, 5).map(log => {
        const isOpen = openId === log._id;

        return (
          <div
            key={log._id}
            onClick={() => toggle(log._id)}
            className="glass-card p-3 text-sm cursor-pointer transition hover:shadow-md"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">
                {log.date}
              </span>
              <span className="capitalize text-pink-600 font-semibold">
                {log.flow}
              </span>
            </div>

            {/* EXPANDED */}
            {isOpen && (
              <div className="mt-3 space-y-3 text-xs text-gray-600">
                {/* SYMPTOMS */}
                <div>
                  <span className="font-medium text-gray-700">
                    Symptoms:
                  </span>{" "}
                  {log.symptoms?.length
                    ? log.symptoms.join(", ")
                    : "None"}
                </div>

                {/* NOTES */}
                {log.notes && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Notes:
                    </span>{" "}
                    {log.notes}
                  </div>
                )}

                {/* DELETE */}
                <button
                  onClick={(e) => handleDelete(e, log._id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium"
                >
                  <Trash2 size={14} />
                  Delete log
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
