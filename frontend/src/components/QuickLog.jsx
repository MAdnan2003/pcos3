import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";

export function QuickLog({ onLogClick }) {
  return (
    <Button
      onClick={onLogClick}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
    >
      <Plus size={18} />
      Log Today&apos;s Period
    </Button>
  );
}
