import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InvoicesPage from '../app/invoices/page';
import userEvent from '@testing-library/user-event';

// Mock fetch for clients and invoices
let paid = false;

beforeEach(() => {
  paid = false;

  global.fetch = jest.fn((url, options) => {
    const urlStr = String(url);
    if (urlStr.endsWith('api/clients') || urlStr === 'api/clients') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ clients: [{ id: '1', name: 'Test Client', hourlyRate: 100 }] }),
      });
    }
    if (urlStr.endsWith('api/invoices') || urlStr === 'api/invoices') {
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
    if ((urlStr.endsWith('/api/invoices/') || urlStr.includes('/api/invoices/')) && options?.method === 'PATCH') {
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

afterEach(() => {
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
    expect(await screen.findByRole('heading', { name: /invoices/i })).toBeInTheDocument();
  });

  it('shows invoice as unpaid by default', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <InvoicesPage />
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/^Unpaid$/i)).toBeInTheDocument();
  });

  it('prefills hourly rate from selected client and sends it on create', async () => {
    const queryClient = new QueryClient();
    const user = userEvent.setup();

    // capture POST body
    type InvoicePostBody = { hourlyRate?: number; [key: string]: unknown };
    let lastPostBody: InvoicePostBody | null = null;
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      const urlStr = String(url);
      if (urlStr.endsWith('api/clients') || urlStr === 'api/clients') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clients: [{ id: '1', name: 'Test Client', hourlyRate: 100 }] }),
        });
      }
      if ((urlStr.endsWith('/api/invoices') || urlStr === 'api/invoices' || urlStr.endsWith('api/invoices')) && options?.method === 'POST') {
        lastPostBody = JSON.parse(String(options.body));
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      if (urlStr.endsWith('api/invoices') || urlStr === 'api/invoices') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ invoices: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <InvoicesPage />
      </QueryClientProvider>,
    );

    // wait for client select (combobox) to appear and pick the client
    const select = await screen.findByRole('combobox');
    await user.selectOptions(select, '1');

    // hourly rate input should be prefilled (find by displayed value)
    const rateInput = await screen.findByDisplayValue('100');
    expect((rateInput as HTMLInputElement).value).toBe('100');

    // fill required date inputs (native validation prevents submit otherwise)
    const { container } = rendered;
    const dateInputs = container.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    const today = new Date().toISOString().slice(0, 10);
    if (dateInputs.length >= 2) {
      fireEvent.change(dateInputs[0], { target: { value: today } });
      fireEvent.change(dateInputs[1], { target: { value: today } });
    }

    // click generate invoice
    const button = screen.getByRole('button', { name: /generate invoice/i });
    await user.click(button);

    expect(lastPostBody).not.toBeNull();
    expect(Number(lastPostBody!.hourlyRate)).toBe(100);
  });
});
