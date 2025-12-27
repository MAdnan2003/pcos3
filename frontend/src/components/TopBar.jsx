import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  HeartPulse,
  CalendarDays,
  Utensils,
  Smile,
  Users,
  Dumbbell,
  BarChart3,
  Activity,
  Salad,
  Sparkles,
  Shirt
} from "lucide-react";

const TopBar = ({ user, onLogout }) => {

  const navigate = useNavigate();
  const go = (path) => navigate(path);

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (key) => {
    setOpenMenu(prev => prev === key ? null : key);
  };

  useEffect(() => {
    const handler = () => setOpenMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const stop = (e) => e.stopPropagation();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header
      className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm"
      onClick={stop}
    >

      {/* LEFT */}
      <div className="text-lg font-bold text-purple-600">
        PCOSync
      </div>


      {/* RIGHT */}
      <div className="flex items-center space-x-3">


        {/* DASHBOARD */}
        <button
          onClick={() => go("/dashboard")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
        >
          <LayoutDashboard size={16} />
          Environmental Monitor
        </button>



        {/* =============== HEALTH =============== */}
        <div className="relative">

          <button
            onClick={() => toggleMenu("health")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700"
          >
            <HeartPulse size={16} />
            Health
          </button>

          {openMenu === "health" && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border p-2 z-50 animate-fade">

              <div className="flex flex-col gap-1">

                <button
                  onClick={() => go("/medical-details")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 text-sm"
                >
                  <HeartPulse size={14} />
                  Medical Details
                </button>

                <button
                  onClick={() => go("/cycle-tracker")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 text-sm"
                >
                  <CalendarDays size={14} />
                  Cycle Tracker
                </button>

                <button
                  onClick={() => go("/pcos-prediction")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 text-sm"
                >
                  <Activity size={14} />
                  PCOS Prediction
                </button>
                
                {/* ✅ Progress Reports button added here */}
                <button
                  onClick={() => go("/progress-reports")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-pink-100 text-pink-700 hover:bg-pink-200 text-sm"
                >
                <BarChart3 size={14} />
                Progress Reports
                </button>

              </div>
            </div>
          )}

        </div>



        {/* =============== FITNESS =============== */}
        <div className="relative">

          <button
            onClick={() => toggleMenu("fitness")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Dumbbell size={16} />
            Fitness
          </button>

          {openMenu === "fitness" && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border p-2 z-50 animate-fade">

              <div className="flex flex-col gap-1">

                <button
                  onClick={() => go("/workout-plan")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm"
                >
                  <Dumbbell size={14} />
                  Workout Plan
                </button>

                <button
                  onClick={() => go("/workout-progress")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm"
                >
                  <BarChart3 size={14} />
                  Workout Progress
                </button>

              </div>
            </div>
          )}

        </div>



        {/* =============== NUTRITION =============== */}
        <div className="relative">

          <button
            onClick={() => toggleMenu("nutrition")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
          >
            <Salad size={16} />
            Nutrition
          </button>

          {openMenu === "nutrition" && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border p-2 z-50 animate-fade">

              <div className="flex flex-col gap-1">

                <button
                  onClick={() => go("/diet-plan")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                >
                  <Salad size={14} />
                  Diet Plan
                </button>

                <button
                  onClick={() => go("/meals-water")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                >
                  <Utensils size={14} />
                  Meals & Water
                </button>

              </div>
            </div>
          )}

        </div>



        {/* =============== LIFESTYLE (Fashion moved here) =============== */}
        <div className="relative">

          <button
            onClick={() => toggleMenu("lifestyle")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Smile size={16} />
            Lifestyle
          </button>

          {openMenu === "lifestyle" && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border p-2 z-50 animate-fade">

              <div className="flex flex-col gap-1">

                <button
                  onClick={() => go("/mood-journal")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm"
                >
                  <Smile size={14} />
                  Mood & Journal
                </button>

                <button
                  onClick={() => go("/skincare")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm"
                >
                  <Sparkles size={14} />
                  Skincare
                </button>

                <button
                  onClick={() => go("/try-on")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm"
                >
                  <Shirt size={14} />
                  Try-On
                </button>

                {/* >>> ADDED HERE <<< */}
                <button
                  onClick={() => go("/dashboard/fashion")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm"
                >
                  <Shirt size={14} />
                  Fashion Recommendations
                </button>

              </div>
            </div>
          )}

        </div>



        {/* COMMUNITY */}
        <button
          onClick={() => go("/forum")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          <Users size={16} />
          Community
        </button>



        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>
    </header>
  );
};

export default TopBar;
