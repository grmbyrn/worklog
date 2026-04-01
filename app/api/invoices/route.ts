import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateEnv } from '@/lib/env';
import type { Prisma } from '@prisma/client';

export async function GET() {
  validateEnv();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json({ invoices: [] });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();
  const invoicesWithOverdue = invoices.map((inv) => ({
    ...inv,
    isOverdue: !inv.isPaid && !!inv.dueDate && new Date(inv.dueDate) < now,
  }));

  return Response.json({ invoices: invoicesWithOverdue });
}

export async function POST(req: Request) {
  validateEnv();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { clientId, startDate, endDate, hourlyRate, dueDate } = await req.json();

  if (!clientId || !startDate || !endDate) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || '',
      },
    });

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id },
    });

    if (!client) {
      return Response.json({ error: 'Client not found' }, { status: 404 });
    }

    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999);

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: user.id,
        clientId,
        startTime: { gte: from },
        endTime: { lte: to },
        NOT: { endTime: null },
      },
      orderBy: { startTime: 'asc' },
    });

    if (timeEntries.length === 0) {
      return Response.json({ error: 'No time entries in this range' }, { status: 400 });
    }

    const totalHours = timeEntries.reduce((sum, entry) => {
      const start = new Date(entry.startTime as Date);
      const end = new Date(entry.endTime as Date);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    // Validate override hourlyRate if provided, otherwise validate and use client's stored rate
    let rate: number;
    if (typeof hourlyRate !== 'undefined' && hourlyRate !== null && hourlyRate !== '') {
      const parsed = Number(hourlyRate);
      if (!Number.isFinite(parsed) || parsed < 0) {
        return Response.json({ error: 'Invalid hourlyRate override' }, { status: 400 });
      }
      rate = parsed;
    } else {
      const clientRate = Number(client.hourlyRate);
      if (!Number.isFinite(clientRate) || clientRate < 0) {
        return Response.json({ error: 'Client has invalid hourlyRate' }, { status: 400 });
      }
      rate = clientRate;
    }

    const totalAmount = totalHours * rate;

    // default dueDate to 30 days from now if not provided
    const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const invoiceData: Prisma.InvoiceUncheckedCreateInput = {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      hourlyRate: parseFloat(rate.toFixed(2)),
      periodStart: from,
      periodEnd: to,
      clientId,
      userId: user.id,
      dueDate: due,
    };

    const invoice = await prisma.invoice.create({
      data: invoiceData,
      include: { client: true },
    });

    return Response.json({ invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
