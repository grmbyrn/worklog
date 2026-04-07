import { GET } from '../../app/api/timer/route';
import { getServerSession } from 'next-auth';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { upsert: jest.fn(), findUnique: jest.fn() },
    client: { findFirst: jest.fn() },
    timeEntry: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  },
}));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

const { prisma: mockPrisma } = jest.requireMock('@/lib/prisma') as {
  prisma: {
    user: { upsert: jest.Mock; findUnique: jest.Mock };
    client: { findFirst: jest.Mock };
    timeEntry: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  };
};

describe('GET /api/timer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns runningEntry when present', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
    mockPrisma.timeEntry.findFirst.mockResolvedValue({ id: 'entry1', clientId: 'client1', startTime: new Date().toISOString(), status: 'RUNNING', client: { id: 'client1', name: 'C' } });

    const res = await GET();
    const json = await res.json();

    expect(json.runningEntry).toBeDefined();
    expect(json.runningEntry.status).toBe('RUNNING');
    expect(json.runningEntry.client).toBeDefined();
  });

  it('returns null when no running entry', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com' } });
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
    mockPrisma.timeEntry.findFirst.mockResolvedValue(null);

    const res = await GET();
    const json = await res.json();

    expect(json.runningEntry).toBeNull();
  });
});
