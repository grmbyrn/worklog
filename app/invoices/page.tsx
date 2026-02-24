'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Client {
  id: string;
  name: string;
  hourlyRate: number;
}

interface Invoice {
  id: string;
  totalHours: number;
  totalAmount: number;
  createdAt: string;
  periodStart?: string | null;
  periodEnd?: string | null;
  client: { name: string };
  isPaid: boolean;
}

interface InvoiceEntry {
  id: string;
  startTime: string;
  endTime: string;
  hours: number;
  amount: number;
}

interface InvoiceDetailsResponse {
  invoice: Invoice;
  entries: InvoiceEntry[];
}

const buildInvoicePdf = (invoice: Invoice, entries: InvoiceEntry[]) => {
  const doc = new jsPDF();
  const createdAt = new Date(invoice.createdAt).toLocaleDateString();
  const periodStart = invoice.periodStart
    ? new Date(invoice.periodStart).toLocaleDateString()
    : 'N/A';
  const periodEnd = invoice.periodEnd ? new Date(invoice.periodEnd).toLocaleDateString() : 'N/A';

  doc.setFontSize(18);
  doc.text('Worklog Invoice', 14, 20);

  doc.setFontSize(12);
  doc.text(`Client: ${invoice.client.name}`, 14, 32);
  doc.text(`Period: ${periodStart} - ${periodEnd}`, 14, 40);
  doc.text(`Created: ${createdAt}`, 14, 48);
  doc.text(`Total Hours: ${invoice.totalHours.toFixed(2)}`, 14, 56);
  doc.text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, 14, 64);

  let y = 76;
  doc.setFontSize(11);
  doc.text('Entries', 14, y);
  y += 8;

  if (entries.length === 0) {
    doc.text('No entries found for this invoice.', 14, y);
  } else {
    entries.forEach((entry) => {
      const date = new Date(entry.startTime).toLocaleDateString();
      const line = `${date} — ${entry.hours.toFixed(2)}h — $${entry.amount.toFixed(2)}`;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, 14, y);
      y += 8;
    });
  }

  return doc;
};

export default function InvoicesPage() {
  const [formData, setFormData] = useState({
    clientId: '',
    startDate: '',
    endDate: '',
  });
  const queryClient = useQueryClient();

  const {
    data: clientsData,
    error: clientsError,
    isLoading: clientsLoading,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await fetch('api/clients');
      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }
      return res.json();
    },
  });

  const {
    data: invoicesData,
    error: invoicesError,
    isLoading: invoicesLoading,
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await fetch('api/invoices');
      if (!res.ok) {
        throw new Error('Failed to fetch invoices');
      }
      return res.json();
    },
  });

  // Debug: log invoicesData to check isPaid status
  console.log('invoicesData:', invoicesData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ clientId: '', startDate: '', endDate: '' });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } else {
      const error = await res.json();
      alert(error.error || 'Error creating invoice');
    }
  };

  const fetchInvoiceDetails = async (invoiceId: string) => {
    const res = await fetch(`/api/invoices/${invoiceId}`);

    if (!res.ok) {
      alert('Error fetching invoice details');
      return;
    }

    const { invoice, entries } = (await res.json()) as InvoiceDetailsResponse;
    return { invoice, entries };
  };

  const handleDownload = async (invoiceId: string) => {
    const details = await fetchInvoiceDetails(invoiceId);
    if (!details) return;
    const doc = buildInvoicePdf(details.invoice, details.entries);
    doc.save(`invoice-${details.invoice.id}.pdf`);
  };

  const handleView = async (invoiceId: string) => {
    const details = await fetchInvoiceDetails(invoiceId);
    if (!details) return;
    const doc = buildInvoicePdf(details.invoice, details.entries);
    const url = doc.output('bloburl');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (clientsLoading || invoicesLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-slate-600">Loading...</div>
      </div>
    );
  }

  if (clientsError || invoicesError) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-slate-600">
          Error: {clientsError?.message || invoicesError?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Invoices</h1>

      {/* Create Invoice Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Create Invoice</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Client</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            >
              <option value="">Select client...</option>
              {clientsData?.clients.map((client: Client) => (
                <option key={client.id} value={client.id}>
                  {client.name} (${client.hourlyRate}/hr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Invoice History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Created
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Hours</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoicesData?.invoices.length > 0 ? (
                invoicesData?.invoices.map((invoice: Invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{invoice.client.name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-900">
                      {invoice.totalHours.toFixed(2)}h
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      ${invoice.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {invoice.isPaid ? 'Paid' : 'Unpaid'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={async () => {
                          await fetch(`/api/invoices/${invoice.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ isPaid: !invoice.isPaid }),
                          });
                          queryClient.invalidateQueries({ queryKey: ['invoices'] });
                        }}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          invoice.isPaid
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {invoice.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                      </button>
                      <button
                        onClick={() => handleView(invoice.id)}
                        className="px-3 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => handleDownload(invoice.id)}
                        className="px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-600">
                    No invoices yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
