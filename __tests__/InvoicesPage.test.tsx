import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InvoicesPage from '../app/invoices/page';

// Mock fetch for clients and invoices
beforeAll(() => {
  let paid = false;
  global.fetch = jest.fn((url, options) => {
    if (url === 'api/clients') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ clients: [{ id: '1', name: 'Test Client', hourlyRate: 100 }] }),
      });
    }
    if (url === 'api/invoices') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          invoices: [
            {
              id: '1',
              totalHours: 10,
              totalAmount: 1000,
              createdAt: new Date().toISOString(),
              client: { name: 'Test Client' },
              isPaid: paid,
            },
          ],
        }),
      });
    }
    if (url.startsWith('/api/invoices/') && options?.method === 'PATCH') {
      paid = true;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Invoice updated successfully' }),
      });
    }
    // fallback for other fetches
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Invoices page', () => {
  it('renders invoices heading', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <InvoicesPage />
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/invoices/i)).toBeInTheDocument();
  });

  it('shows invoice as unpaid by default', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <InvoicesPage />
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/unpaid/i)).toBeInTheDocument();
  });
});
