import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '../app/dashboard/page';

// Mock fetch for dashboard
beforeAll(() => {
  global.fetch = jest.fn(() => {
    // Return a complete dashboard object with all required properties
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          totalEarnings: 1234.56,
          weeklyEarnings: 234.56,
          monthlyEarnings: 345.67,
          totalClients: 5,
          totalInvoices: 10,
          byClient: [
            {
              clientName: 'Test Client',
              totalEarnings: 1000,
              invoiceCount: 2,
              hours: 40,
              earnings: 1000,
            },
          ],
          recentEntries: [
            {
              id: '1',
              clientName: 'Test Client',
              hours: 8,
              amount: 200,
              date: '2026-02-23',
              earnings: 200,
            },
          ],
          // Add any other properties your component expects here
        }),
    });
  }) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Dashboard page', () => {
  it('renders dashboard heading', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
