import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export function CycleCalendar({ periodLogs, onDayClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getLogForDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return periodLogs.find(log => log.date === dateStr);
  };

  const getFlowColor = (flow) => {
    switch (flow) {
      case "spotting": return "bg-coral-light border-coral/30";
      case "light": return "bg-coral/30 border-coral/40";
      case "medium": return "bg-coral/60 border-coral/70";
      case "heavy": return "bg-coral border-coral";
      default: return "";
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;
  };

  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const log = getLogForDate(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    days.push(
      <button
        key={day}
        onClick={() => onDayClick(dateStr)}
        className={cn(
          "h-12 w-full rounded-xl flex items-center justify-center text-sm font-medium transition-all hover:scale-105 border-2 border-transparent",
          isToday(day) && !log && "ring-2 ring-primary ring-offset-2",
          log ? getFlowColor(log.flow) : "hover:bg-muted"
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="glass-card p-6">
  <div className="flex items-center justify-between mb-4">
    <Button variant="ghost" size="icon" onClick={prevMonth}>
      <ChevronLeft />
    </Button>

    <h2 className="text-lg font-semibold text-gray-700">
      {MONTHS[month]} {year}
    </h2>

    <Button variant="ghost" size="icon" onClick={nextMonth}>
      <ChevronRight />
    </Button>
  </div>

  <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
    {DAYS.map(day => (
      <div key={day} className="text-center font-medium">
        {day}
      </div>
    ))}
  </div>

  <div className="grid grid-cols-7 gap-1">
    {days}
  </div>
</div>
  );
}
