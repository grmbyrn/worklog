 'use client';

import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Client {
  id: string;
  name: string;
  hourlyRate: number;
}

export default function TimerPage() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const queryClient = useQueryClient();

  const { data: timerData } = useQuery({
    queryKey: ['timerRunning'],
    queryFn: async () => {
      const res = await fetch('/api/timer');
      if (!res.ok) throw new Error('Failed to fetch timer');
      return res.json();
    },
    refetchInterval: (d: unknown) => {
      const dd = d as Record<string, unknown> | null;
      return dd && dd['runningEntry'] ? 1000 : false;
    },
  });

  const runningEntry = timerData?.runningEntry ?? null;
  const activeEntryId = runningEntry?.id ?? null;
  const isRunning = !!runningEntry;
  const [tick, setTick] = useState(() => Date.now());

  // Update a lightweight tick every second while a timer is running to drive the display.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const seconds = useMemo(() => {
    if (!runningEntry?.startTime) return 0;
    const diff = Math.floor((tick - new Date(runningEntry.startTime).getTime()) / 1000);
    return Math.max(0, diff);
  }, [runningEntry, tick]);

  const {
    data: clientsData,
    error: clientsError,
    isLoading: clientsLoading,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await fetch('/api/clients');
      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }
      return res.json();
    },
  });

  // Polling via react-query handles fetching running entry every second.
  // When a running entry exists, ensure selected client matches it.
  useEffect(() => {
    if (runningEntry && selectedClientId !== runningEntry.clientId) {
      setSelectedClientId(runningEntry.clientId);
    }
  }, [runningEntry, selectedClientId]);

  const handleStart = async () => {
    if (!selectedClientId) {
      alert('Please select a client');
      return;
    }

    try {
      const now = new Date().toISOString();
      const res = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: selectedClientId, startTime: now }),
      });
      if (!res.ok) throw new Error('Failed to start timer');
      // invalidate query so the new running entry is fetched on next tick
      queryClient.invalidateQueries({ queryKey: ['timerRunning'] });
    } catch {
      alert('Error starting timer');
    }
  };

  const handleStop = async () => {
    if (!activeEntryId) return;

    try {
      const endTime = new Date().toISOString();
      const res = await fetch(`/api/timer/${activeEntryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endTime }),
      });
      if (!res.ok) throw new Error('Failed to stop');
      queryClient.invalidateQueries({ queryKey: ['timerRunning'] });
      alert('Time entry saved!');
    } catch {
      alert('Error saving time entry');
    }
  };

  const handleReset = () => {
    // If there's an active server entry, stop it.
    if (activeEntryId) {
      handleStop();
      return;
    }

    // Otherwise clear client selection and refresh timer query so UI shows 00:00:00
    setSelectedClientId('');
    setTick(Date.now());
    queryClient.invalidateQueries({ queryKey: ['timerRunning'] });
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const selectedClient = clientsData?.clients?.find((c: Client) => c.id === selectedClientId);
  const currentEarnings = selectedClient ? (seconds / 3600) * selectedClient.hourlyRate : 0;

  if (clientsLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-slate-600">Loading...</div>
      </div>
    );
  }

  if (clientsError) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-slate-600">Error: {clientsError?.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Timer</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Client Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-900 mb-3">Select Client</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            disabled={isRunning}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-100"
          >
            <option value="">Choose a client...</option>
            {clientsData?.clients?.map((client: Client) => (
              <option key={client.id} value={client.id}>
                {client.name} (${client.hourlyRate}/hr)
              </option>
            ))}
          </select>
        </div>

        {/* Timer Display */}
        <div className="bg-slate-900 text-white rounded-lg p-12 text-center mb-8">
          <div className="text-6xl font-mono font-bold mb-4">{formatTime(seconds)}</div>
          {selectedClient && (
            <div className="text-2xl text-slate-300">${currentEarnings.toFixed(2)}</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={!selectedClientId}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 transition-colors text-lg font-semibold"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
            >
              Stop
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="flex-1 px-6 py-3 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 disabled:opacity-50 transition-colors text-lg font-semibold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
