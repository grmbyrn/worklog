// Mock prisma, next-auth, auth and env before importing the route module
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { upsert: jest.fn() },
    client: { findFirst: jest.fn() },
    timeEntry: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  },
}));
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));
jest.mock('@/auth', () => ({ authOptions: {} }));
jest.mock('@/lib/env', () => ({ validateEnv: () => {} }));

const { getServerSession } = jest.requireMock('next-auth') as { getServerSession: jest.Mock };
let POST: (req: Request) => Promise<Response>;
beforeAll(async () => {
  const mod = await import('../../app/api/timer/route');
  POST = mod.POST;
});

const { prisma: mockPrisma } = jest.requireMock('../../app/lib/prisma') as {
  prisma: {
    user: { upsert: jest.Mock };
    client: { findFirst: jest.Mock };
    timeEntry: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; findUnique: jest.Mock };
  };
};

describe('POST /api/timer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates a running time entry when none exists', async () => {
    // Mock session
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com', name: 'Test' } });

    // Mock upsert user
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
    // Mock client lookup
    mockPrisma.client.findFirst.mockResolvedValue({ id: 'client1', userId: 'user1' });
    // No existing running entry
    mockPrisma.timeEntry.findFirst.mockResolvedValue(null);
    // Create returns new entry
    mockPrisma.timeEntry.create.mockResolvedValue({ id: 'entry1', startTime: new Date().toISOString(), clientId: 'client1', userId: 'user1', status: 'RUNNING' });

    const req = new Request('http://localhost/api/timer', {
      method: 'POST',
      body: JSON.stringify({ clientId: 'client1', startTime: new Date().toISOString() }),
    });

    const res = await POST(req as Request);
    const json = await res.json();

    expect(json.timeEntry).toBeDefined();
    expect(json.timeEntry.status).toBe('RUNNING');
  });

  it('returns 409 when a running timer already exists', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'test@example.com', name: 'Test' } });
    mockPrisma.user.upsert.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
    mockPrisma.client.findFirst.mockResolvedValue({ id: 'client1', userId: 'user1' });
    mockPrisma.timeEntry.findFirst.mockResolvedValue({ id: 'existing', userId: 'user1', status: 'RUNNING' });

    const req = new Request('http://localhost/api/timer', {
      method: 'POST',
      body: JSON.stringify({ clientId: 'client1', startTime: new Date().toISOString() }),
    });

    const res = await POST(req as Request);
    const json = await res.json();

    expect(json.error).toBe('A timer is already running');
  });
});
