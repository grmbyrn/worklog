import { fakeClients } from "../lib/fakeData"

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Worklog Dashboard</h1>
      <p>Welcome! This is where you&apos;ll see your clients and earnings.</p>
      <ul className="space-y-2">
        {fakeClients.map((client) => (
            <li key={client.id}>
                {client.name} - ${client.hourlyRate}/hr
            </li>
        ))}
      </ul>
    </main>
  )
}