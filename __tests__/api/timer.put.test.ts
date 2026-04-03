import { PUT } from '../../app/api/timer/[id]/route';
import { getServerSession } from 'next-auth';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { upsert: jest.fn() },
    client: { findFirst: jest.fn() },
    timeEntry: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  },
}));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

const { prisma: mockPrisma } = jest.requireMock('@/lib/prisma') as {
  prisma: {
    user: { upsert: jest.Mock };
    client: { findFirst: jest.Mock };
    timeEntry: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  };
};

describe('PUT /api/timer/:id', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('completes an existing running entry', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
    mockPrisma.timeEntry.findUnique.mockResolvedValue({ id: 'entry1', userId: 'user1' });
    mockPrisma.timeEntry.update.mockResolvedValue({ id: 'entry1', endTime: new Date().toISOString(), status: 'COMPLETED' });

    const req = new Request('http://localhost/api/timer/entry1', {
      method: 'PUT',
      body: JSON.stringify({ endTime: new Date().toISOString() }),
    });

    const res = await PUT(req as Request, { params: Promise.resolve({ id: 'entry1' }) } as { params: Promise<{ id: string }> });
    const json = await res.json();

    expect(json.timeEntry).toBeDefined();
    expect(json.timeEntry.status).toBe('COMPLETED');
  });

  it('returns 404 for non-owner or missing entry', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
    mockPrisma.timeEntry.findUnique.mockResolvedValue(null);

    const req = new Request('http://localhost/api/timer/doesnotexist', {
      method: 'PUT',
      body: JSON.stringify({ endTime: new Date().toISOString() }),
    });

    const res = await PUT(req as Request, { params: Promise.resolve({ id: 'doesnotexist' }) } as { params: Promise<{ id: string }> });
    const json = await res.json();

    expect(json.error).toBe('Time entry not found');
  });
});
