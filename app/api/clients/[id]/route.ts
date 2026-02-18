import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { validateEnv } from '@/lib/env';

validateEnv();
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: session.user?.name ?? null,
    },
  });

  const { name, email, hourlyRate } = await request.json();

  if (!name || !email || hourlyRate === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const updatedClient = await prisma.client.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      name,
      email,
      hourlyRate: Number(hourlyRate),
    },
  });

  return NextResponse.json({ client: updatedClient });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: session.user?.name ?? null,
    },
  });

  await prisma.client.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
