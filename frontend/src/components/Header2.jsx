import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            PCOS SYNC
          </h1>
          <p className="text-sm text-gray-500">
            PCOS Cycle Tracker
          </p>
        </div>
      </div>
    </header>
  );
}
