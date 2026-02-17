import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { TimeEntry, Client } from "@prisma/client";
import { validateEnv } from "@/lib/env";

validateEnv();
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return Response.json({ totalEarnings: 0, byClient: [], recentEntries: [] });
    }

    // Get all time entries with client info
    const timeEntries: (TimeEntry & { client: Client })[] = await prisma.timeEntry.findMany({
      where: { userId: user.id },
      include: { client: true },
      orderBy: { startTime: 'desc' },
    });

    // Ignore in-progress entries (endTime is null)
    const completedEntries = timeEntries.filter((entry) => entry.endTime);

    // Calculate total earnings
    let totalEarnings = 0;
    const earningsByClient: Record<
      string,
      { clientName: string; hours: number; earnings: number }
    > = {};

    completedEntries.forEach((entry: TimeEntry & { client: Client }) => {
      const startTime = new Date(entry.startTime as Date);
      const endTime = new Date(entry.endTime as Date);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const earnings = hours * entry.client.hourlyRate;

      totalEarnings += earnings;

      if (!earningsByClient[entry.clientId]) {
        earningsByClient[entry.clientId] = {
          clientName: entry.client.name,
          hours: 0,
          earnings: 0,
        };
      }

      earningsByClient[entry.clientId].hours += hours;
      earningsByClient[entry.clientId].earnings += earnings;
    });

    // Get recent entries (last 10)
    const recentEntries = completedEntries
      .slice(0, 10)
      .map((entry: TimeEntry & { client: Client }) => {
        const startTime = new Date(entry.startTime as Date);
        const endTime = new Date(entry.endTime as Date);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        const earnings = hours * entry.client.hourlyRate;

        return {
          id: entry.id,
          clientName: entry.client.name,
          startTime: entry.startTime,
          endTime: entry.endTime,
          hours: parseFloat(hours.toFixed(2)),
          earnings: parseFloat(earnings.toFixed(2)),
        };
      });

    // Calculate weekly earnings
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyEarnings = completedEntries
      .filter((entry) => new Date(entry.startTime as Date) > oneWeekAgo)
      .reduce((sum, entry) => {
        const startTime = new Date(entry.startTime as Date);
        const endTime = new Date(entry.endTime as Date);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        return sum + hours * entry.client.hourlyRate;
      }, 0);

    // Calculate monthly earnings
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const monthlyEarnings = completedEntries
      .filter((entry) => new Date(entry.startTime as Date) > oneMonthAgo)
      .reduce((sum, entry) => {
        const startTime = new Date(entry.startTime as Date);
        const endTime = new Date(entry.endTime as Date);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        return sum + hours * entry.client.hourlyRate;
      }, 0);

    return Response.json({
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      weeklyEarnings: parseFloat(weeklyEarnings.toFixed(2)),
      monthlyEarnings: parseFloat(monthlyEarnings.toFixed(2)),
      byClient: Object.entries(earningsByClient).map(([, data]) => ({
        ...data,
        earnings: parseFloat(data.earnings.toFixed(2)),
        hours: parseFloat(data.hours.toFixed(2)),
      })),
      recentEntries,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
