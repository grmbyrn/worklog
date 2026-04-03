import { useEffect, useRef, useState } from 'react';

type ResumeEntry = { id: string; startTime: string } | null;

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RESUME_AGE_SECONDS = 24 * 60 * 60;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (!startTime) return;
        const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setSeconds(Math.max(0, diff));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTime]);

  const startLocal = (when: Date, entryId?: string | null) => {
    // ensure any existing interval is cleared before starting
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStartTime(when);
    setSeconds(0);
    setActiveEntryId(entryId ?? null);
    setIsRunning(true);
  };

  const stopLocal = () => {
    // stop ticking immediately and clear interval
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetLocal = () => {
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
    setActiveEntryId(null);
  };

  const resumeFromEntry = (entry: ResumeEntry) => {
    if (!entry) return;
    const s = new Date(entry.startTime);
    const diff = Math.floor((Date.now() - s.getTime()) / 1000);
    if (diff > MAX_RESUME_AGE_SECONDS) return;
    setStartTime(s);
    setSeconds(Math.max(0, diff));
    setActiveEntryId(entry.id);
    setIsRunning(true);
  };

  return {
    seconds,
    isRunning,
    startTime,
    activeEntryId,
    startLocal,
    stopLocal,
    resetLocal,
    resumeFromEntry,
  } as const;
}

export default useTimer;
