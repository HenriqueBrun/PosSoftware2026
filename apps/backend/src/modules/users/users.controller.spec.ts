import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockClerkAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(ClerkAuthGuard)
      .useValue(mockClerkAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test', password: 'secret' };
      const req = { user: { userId: '1' } };
      mockUsersService.findById.mockResolvedValue(user);

      const result = await controller.getProfile(req);
      expect(result).toEqual({ id: '1', email: 'test@test.com', name: 'Test' });
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if user not found', async () => {
      const req = { user: { userId: '1' } };
      mockUsersService.findById.mockResolvedValue(null);

      const result = await controller.getProfile(req);
      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update and return user profile', async () => {
      const updatedUser = { id: '1', name: 'New Name', password: 'secret' };
      const req = { user: { userId: '1' } };
      const body = { name: 'New Name' };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(req, body);
      expect(result).toEqual({ id: '1', name: 'New Name' });
      expect(mockUsersService.update).toHaveBeenCalledWith('1', { name: 'New Name' });
    });
  });
});
