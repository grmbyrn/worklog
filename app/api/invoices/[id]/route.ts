import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateEnv } from '@/lib/env';
import type { Prisma, InvoiceStatus } from '@prisma/client';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  validateEnv();
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
    const amount = hours * Number(invoice.hourlyRate);

    return {
      id: entry.id,
      startTime: entry.startTime,
      endTime: entry.endTime,
      hours: parseFloat(hours.toFixed(2)),
      amount: parseFloat(amount.toFixed(2)),
    };
  });

  const now = new Date();
  const invoiceWithOverdue = {
    ...invoice,
    isOverdue: !invoice.isPaid && !!invoice.dueDate && new Date(invoice.dueDate) < now,
  };

  return Response.json({ invoice: invoiceWithOverdue, entries });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  validateEnv();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { isPaid, status } = (body ?? {}) as { isPaid?: unknown; status?: unknown };

  const allowedStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE'];

  if (typeof isPaid === 'undefined' && typeof status === 'undefined') {
    return Response.json({ error: 'Missing update fields' }, { status: 400 });
  }

  if (typeof status !== 'undefined' && typeof status !== 'string') {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }

  if (typeof status === 'string' && !allowedStatuses.includes(status)) {
    return Response.json({ error: 'Unknown status' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }
  // Verify ownership: ensure the invoice belongs to the authenticated user
  const existing = await prisma.invoice.findFirst({ where: { id, userId: user.id } });

  if (!existing) {
    return Response.json({ error: 'Invoice not found' }, { status: 404 });
  }

  try {
    const updateData: Prisma.InvoiceUncheckedUpdateInput = {};

    if (typeof isPaid === 'boolean') updateData.isPaid = isPaid;
    if (typeof status === 'string') updateData.status = status as InvoiceStatus;

    // Keep isPaid in sync if status is set to PAID
    if (status === 'PAID') updateData.isPaid = true;

    // If marking as not paid, ensure isPaid flag reflects that
    if (status && status !== 'PAID' && typeof isPaid === 'undefined') {
      updateData.isPaid = false;
    }

    const invoice = await prisma.invoice.update({ where: { id }, data: updateData });

    return Response.json({ message: 'Invoice updated successfully', invoice });
  } catch (error: unknown) {
    console.error(error);
    return Response.json({ error: 'Invoice not found or update failed' }, { status: 404 });
  }
}
