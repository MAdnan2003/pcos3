import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/"); // safety redirect
  };

  return (
    <div className="w-64 h-screen p-6 bg-white/90 backdrop-blur border-r border-purple-200 flex flex-col">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        PCOS Sync Admin
      </h2>

      {/* NAV LINKS */}
      <ul className="space-y-4 text-gray-700 flex-1">
        <li>
          <Link
            to="/dashboard"
            className="block p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/users"
            className="block p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
          >
            Users
          </Link>
        </li>

        <li>
          <Link
            to="/reports"
            className="block p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
          >
            Reports
          </Link>
        </li>
      </ul>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
