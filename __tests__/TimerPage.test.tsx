import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TimerPage from '../app/timer/page';

// Mock fetch for clients
beforeAll(() => {
  global.fetch = jest.fn(() => {
    // Return an array directly, matching the component's expectation
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: '1', name: 'Test Client', hourlyRate: 100 }]),
    });
  }) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Timer page', () => {
  it('renders timer heading or element', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <TimerPage />
      </QueryClientProvider>,
    );
    // Adjust the text below to match your actual timer heading or label
    expect(await screen.findByText(/timer/i)).toBeInTheDocument();
  });
});
