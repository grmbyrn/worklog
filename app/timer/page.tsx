'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Client {
  id: string;
  name: string;
  hourlyRate: number;
}

export default function TimerPage() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

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

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = async () => {
    if (!selectedClientId) {
      alert('Please select a client');
      return;
    }

    const now = new Date();
    setStartTime(now);
    setIsRunning(true);

    // Create a TimeEntry in the database (without endTime)
    const response = await fetch('/api/timer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: selectedClientId,
        startTime: now.toISOString(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setActiveEntryId(data.timeEntry.id);
    } else {
      alert('Error starting timer');
    }
  };

  const handleStop = async () => {
    if (!startTime || !activeEntryId) return;

    setIsRunning(false);

    // Save to database
    const endTime = new Date();
    const response = await fetch(`/api/timer/${activeEntryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endTime: endTime.toISOString(),
      }),
    });

    if (response.ok) {
      // Reset timer
      setSeconds(0);
      setStartTime(null);
      setActiveEntryId(null);
      alert('Time entry saved!');
    } else {
      alert('Error saving time entry');
    }
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
    setStartTime(null);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const selectedClient = clientsData?.find((c: Client) => c.id === selectedClientId);
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
            {clientsData?.map((client: Client) => (
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
