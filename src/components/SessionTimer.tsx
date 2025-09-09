import React from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';

export const SessionTimer: React.FC = () => {
  const { timeRemaining, isActive, endSession } = useSession();

  if (!isActive) return null;

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  const getTimerColor = () => {
    if (minutes < 5) return 'text-red-600 font-bold';
    if (minutes < 10) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Time Remaining:</div>
        </div>
        <div className={`text-xl font-mono ${getTimerColor()}`}>
          {formatTime(minutes, seconds)}
        </div>
        <Button
          onClick={endSession}
          variant="destructive"
          size="sm"
          className="ml-2"
        >
          <LogOut className="h-4 w-4 mr-1" />
          End Session
        </Button>
      </div>
      {minutes < 5 && (
        <div className="text-xs text-red-600 mt-2 text-center">
          Session ending soon - please save any important reference numbers!
        </div>
      )}
    </div>
  );
};