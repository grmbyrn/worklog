import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateEnv } from "@/lib/env";

validateEnv();
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
    include: { client: true },
  });

  if (!invoice) {
    return Response.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const periodStart = invoice.periodStart;
  const periodEnd = invoice.periodEnd;

  if (!periodStart || !periodEnd) {
    return Response.json({ invoice, entries: [] });
  }

  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      userId: user.id,
      clientId: invoice.clientId,
      startTime: { gte: periodStart },
      endTime: { lte: periodEnd },
      NOT: { endTime: null },
    },
    orderBy: { startTime: 'asc' },
  });

  const entries = timeEntries.map((entry) => {
    const start = new Date(entry.startTime as Date);
    const end = new Date(entry.endTime as Date);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const amount = hours * invoice.client.hourlyRate;

    return {
      id: entry.id,
      startTime: entry.startTime,
      endTime: entry.endTime,
      hours: parseFloat(hours.toFixed(2)),
      amount: parseFloat(amount.toFixed(2)),
    };
  });

  return Response.json({ invoice, entries });
}
