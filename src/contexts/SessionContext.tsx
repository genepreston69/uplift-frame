import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionContextType {
  sessionId: string | null;
  timeRemaining: number;
  isActive: boolean;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  logActivity: (activity: string, details?: any) => void;
  generateReferenceNumber: () => string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const TICK_INTERVAL = 1000; // 1 second

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { toast } = useToast();

  // Reset idle timer on user activity
  const resetIdleTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Log activity
  const logActivity = useCallback((activity: string, details?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      activity,
      details
    };
    setActivityLog(prev => [...prev, logEntry]);
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Generate reference number
  const generateReferenceNumber = useCallback((): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      if (i === 3) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Start session
  const startSession = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({})
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setTimeRemaining(SESSION_DURATION);
      setIsActive(true);
      setActivityLog([]);
      setLastActivity(Date.now());
      
      logActivity('session_started');
      
      toast({
        title: "Session Started",
        description: "Your 30-minute session has begun."
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast, logActivity]);

  // End session
  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((SESSION_DURATION - timeRemaining) / 1000);

      await supabase
        .from('sessions')
        .update({
          end_time: endTime.toISOString(),
          duration,
          activity_log: activityLog
        })
        .eq('id', sessionId);

      setSessionId(null);
      setTimeRemaining(0);
      setIsActive(false);
      setActivityLog([]);
      
      toast({
        title: "Session Ended",
        description: "Thank you for using the portal. All data has been cleared."
      });
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [sessionId, timeRemaining, activityLog, toast]);

  // Session timer effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      // Check for idle timeout
      if (timeSinceActivity >= IDLE_TIMEOUT) {
        logActivity('session_timeout_idle');
        endSession();
        return;
      }

      setTimeRemaining(prev => {
        const newTime = prev - TICK_INTERVAL;
        
        // Session expired
        if (newTime <= 0) {
          logActivity('session_timeout_duration');
          endSession();
          return 0;
        }

        return newTime;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isActive, lastActivity, endSession, logActivity]);

  // Add event listeners for user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => resetIdleTimer();
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [resetIdleTimer]);

  const value: SessionContextType = {
    sessionId,
    timeRemaining,
    isActive,
    startSession,
    endSession,
    logActivity,
    generateReferenceNumber
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};