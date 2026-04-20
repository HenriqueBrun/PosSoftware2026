import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: '1', email };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail(email);
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('findByClerkId', () => {
    it('should find a user by clerkId', async () => {
      const clerkId = 'user_123';
      const user = { id: '1', clerkId };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findByClerkId(clerkId);
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { clerkId } });
    });
  });

  describe('findOrCreateByClerkId', () => {
    it('should return existing user if found by clerkId', async () => {
      const clerkId = 'user_123';
      const user = { id: '1', clerkId };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOrCreateByClerkId(clerkId, 'test@example.com');
      expect(result).toEqual(user);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { clerkId } });
    });

    it('should update and return user if found by email (legacy)', async () => {
      const clerkId = 'user_123';
      const email = 'test@example.com';
      const user = { id: '1', email };

      mockPrisma.user.findUnique.mockResolvedValueOnce(null); // By clerkId
      mockPrisma.user.findUnique.mockResolvedValueOnce(user); // By email
      mockPrisma.user.update.mockResolvedValue({ ...user, clerkId });

      const result = await service.findOrCreateByClerkId(clerkId, email);
      expect(result).toEqual({ ...user, clerkId });
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('should create new user if not found', async () => {
      const clerkId = 'user_123';
      const email = 'test@example.com';

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({ id: '1', clerkId, email });

      const result = await service.findOrCreateByClerkId(clerkId, email);
      expect(result).toEqual({ id: '1', clerkId, email });
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });
});
