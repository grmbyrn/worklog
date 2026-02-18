'use client';

import { useQuery } from '@tanstack/react-query';

interface DashboardData {
  totalEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  byClient: Array<{
    clientName: string;
    hours: number;
    earnings: number;
  }>;
  recentEntries: Array<{
    id: string;
    clientName: string;
    startTime: string;
    endTime: string;
    hours: number;
    earnings: number;
  }>;
}

export default function DashboardPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('api/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-slate-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-slate-600">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-slate-600 text-sm font-semibold mb-2">Total Earnings</div>
          <div className="text-4xl font-bold text-slate-900">${data.totalEarnings.toFixed(2)}</div>
        </div>

        {/* Weekly Earnings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-slate-600 text-sm font-semibold mb-2">This Week</div>
          <div className="text-4xl font-bold text-slate-900">${data.weeklyEarnings.toFixed(2)}</div>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-slate-600 text-sm font-semibold mb-2">This Month</div>
          <div className="text-4xl font-bold text-slate-900">
            ${data.monthlyEarnings.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings by Client */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">By Client</h2>
            <div className="space-y-4">
              {data.byClient.length > 0 ? (
                data.byClient.map((client: DashboardData['byClient'][number]) => (
                  <div
                    key={client.clientName}
                    className="border-b border-slate-200 pb-4 last:border-b-0"
                  >
                    <div className="font-semibold text-slate-900">{client.clientName}</div>
                    <div className="text-sm text-slate-600 mt-1">{client.hours.toFixed(2)} hrs</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      ${client.earnings.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-600 text-sm">No time entries yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Recent Entries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Hours
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.recentEntries.length > 0 ? (
                    data.recentEntries.map((entry: DashboardData['recentEntries'][number]) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-900">{entry.clientName}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(entry.startTime).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-900">
                          {entry.hours.toFixed(2)}h
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          ${entry.earnings.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-600">
                        No time entries yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
