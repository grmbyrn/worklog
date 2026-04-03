import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TimerPage from '../app/timer/page';

// Mock fetch for clients and /api/timer
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (typeof url === 'string' && url.endsWith('/api/timer')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ runningEntry: { id: 'entry1', clientId: 'client1', startTime: new Date(Date.now() - 5000).toISOString(), client: { id: 'client1', name: 'Client A', hourlyRate: 50 } } }) });
    }
    if (typeof url === 'string' && url.endsWith('/api/clients')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ clients: [{ id: 'client1', name: 'Client A', hourlyRate: 50 }] }) });
    }
    return Promise.resolve({ ok: false });
  }) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('TimerPage resume behavior', () => {
  it('resumes UI when runningEntry exists', async () => {
    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <TimerPage />
      </QueryClientProvider>,
    );

    // Wait for the timer display to show a non-zero time
    const timerDisplay = await screen.findByText(/\d{2}:\d{2}:\d{2}/);
    expect(timerDisplay.textContent).not.toBe('00:00:00');

    // Ensure Stop button is present (implies running)
    expect(await screen.findByText(/stop/i)).toBeInTheDocument();
  });
});
