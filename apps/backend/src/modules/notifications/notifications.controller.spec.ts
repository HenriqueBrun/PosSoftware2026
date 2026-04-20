import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController, NotificationsCronController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigService } from '@nestjs/config';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ForbiddenException } from '@nestjs/common';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const mockNotificationsService = {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    sendPushToUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'VAPID_PUBLIC_KEY') return 'public-key';
      return null;
    }),
  };

  const mockClerkAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(ClerkAuthGuard)
      .useValue(mockClerkAuthGuard)
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVapidPublicKey', () => {
    it('should return public key', () => {
      expect(controller.getVapidPublicKey()).toEqual({ publicKey: 'public-key' });
    });
  });

  describe('subscribe', () => {
    it('should call service subscribe', async () => {
      const req = { user: { userId: 'user-1' } };
      const body = { endpoint: 'ep', keys: { p256dh: 'p', auth: 'a' } };
      mockNotificationsService.subscribe.mockResolvedValue({ id: 'sub-1' });

      const result = await controller.subscribe(req, body);
      expect(result).toEqual({ message: 'Subscription saved', id: 'sub-1' });
      expect(service.subscribe).toHaveBeenCalledWith('user-1', 'ep', 'p', 'a');
    });
  });
});

describe('NotificationsCronController', () => {
  let controller: NotificationsCronController;
  let service: NotificationsService;

  const mockNotificationsService = {
    checkAndNotifyDueEvents: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'CRON_SECRET') return 'secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsCronController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<NotificationsCronController>(NotificationsCronController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  describe('cronHandler', () => {
    it('should execute if secret matches', async () => {
      const result = await controller.cronHandler('Bearer secret');
      expect(result.message).toBe('CRON executed');
      expect(service.checkAndNotifyDueEvents).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if secret mismatch', async () => {
      await expect(controller.cronHandler('Bearer wrong')).rejects.toThrow(ForbiddenException);
    });
  });
});
