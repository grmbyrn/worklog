import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ClientsPage from '../app/clients/page';

// Mock fetch for clients
beforeAll(() => {
  global.fetch = jest.fn(() => {
    // Always return a clients array for any fetch
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ clients: [{ id: '1', name: 'Test Client', hourlyRate: 100 }] }),
    });
  }) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Clients page', () => {
  it('renders clients heading', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ClientsPage />
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/clients/i)).toBeInTheDocument();
  });
});
