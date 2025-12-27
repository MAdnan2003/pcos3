import { useState } from 'react';
import { Header } from '../components/Header2';
import { QuickLog } from '../components/QuickLog';
import { CycleCalendar } from '../components/CycleCalendar';
import { CycleStats } from '../components/CycleStats';
import { RecentLogs } from '../components/RecentLogs';
import { LogPeriodModal } from '../components/LogPeriodModal';
import { useCycleData } from '../hooks/useCycleData';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';

const CycleTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const {
    periodLogs,
    addPeriodLog,
    deletePeriodLog,
    getStats
  } = useCycleData();

  const stats = getStats();

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleQuickLog = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    addPeriodLog(data);
    toast.success('Period logged successfully', {
      description: 'Your entry has been saved.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-4 pb-8">
        <Header />

        <div className="space-y-6">
          <QuickLog onLogClick={handleQuickLog} />

          <CycleCalendar
            periodLogs={periodLogs}
            onDayClick={handleDayClick}
          />

          <CycleStats stats={stats} />

          <RecentLogs
            logs={periodLogs}
            onDelete={deletePeriodLog}
          />
        </div>
      </div>

      <LogPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSave}
      />

      <Toaster position="bottom-center" />
    </div>
  );
};

export default CycleTracker;
