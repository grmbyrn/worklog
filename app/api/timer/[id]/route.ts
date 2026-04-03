import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { TimeEntryStatus } from '@prisma/client';
import { validateEnv } from '@/lib/env';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  validateEnv();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { endTime } = await req.json();

  if (!endTime) {
    return Response.json({ error: 'Missing required field: endTime' }, { status: 400 });
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

    const existing = await prisma.timeEntry.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return Response.json({ error: 'Time entry not found' }, { status: 404 });
    }

    const updatedEntry = await prisma.timeEntry.update({
      where: { id },
      data: {
        endTime: new Date(endTime),
        status: TimeEntryStatus.COMPLETED,
      },
    });
    return Response.json({ timeEntry: updatedEntry });
  } catch (error) {
    console.error('Error updating time entry:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
