import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service';
import * as webpush from 'web-push';

jest.mock('web-push');

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: PrismaService;
  let whatsappService: WhatsappService;

  const mockPrisma = {
    pushSubscription: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    medicationEvent: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'VAPID_PUBLIC_KEY') return 'public';
      if (key === 'VAPID_PRIVATE_KEY') return 'private';
      return null;
    }),
  };

  const mockWhatsappService = {
    sendMedicationReminder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: WhatsappService, useValue: mockWhatsappService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
    whatsappService = module.get<WhatsappService>(WhatsappService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should upsert subscription', async () => {
      await service.subscribe('user-1', 'endpoint', 'p256dh', 'auth');
      expect(mockPrisma.pushSubscription.upsert).toHaveBeenCalled();
    });
  });

  describe('sendPushToUser', () => {
    it('should send push to all user subscriptions', async () => {
      const subs = [{ id: '1', endpoint: 'ep1', p256dh: 'p1', auth: 'a1' }];
      mockPrisma.pushSubscription.findMany.mockResolvedValue(subs);
      (webpush.sendNotification as jest.Mock).mockResolvedValue({});

      await service.sendPushToUser('user-1', { title: 'test' });
      
      expect(webpush.sendNotification).toHaveBeenCalled();
    });

    it('should remove subscription if expired (410)', async () => {
      const subs = [{ id: '1', endpoint: 'ep1', p256dh: 'p1', auth: 'a1' }];
      mockPrisma.pushSubscription.findMany.mockResolvedValue(subs);
      (webpush.sendNotification as jest.Mock).mockRejectedValue({ statusCode: 410 });

      await service.sendPushToUser('user-1', { title: 'test' });
      
      expect(mockPrisma.pushSubscription.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('checkAndNotifyDueEvents', () => {
    it('should process due events', async () => {
      const event = {
        id: 'evt-1',
        time: new Date(),
        notifiedApp: false,
        notifiedWa: false,
        medication: {
          id: 'med-1',
          name: 'Pill',
          dosage: '1',
          userId: 'user-1',
          notifyApp: true,
          notifyWa: true,
          user: { phone: '123' },
        },
      };

      mockPrisma.medicationEvent.findMany.mockResolvedValue([event]);
      mockPrisma.pushSubscription.findMany.mockResolvedValue([]);
      mockWhatsappService.sendMedicationReminder.mockResolvedValue(true);
      mockPrisma.medicationEvent.update.mockResolvedValue({});

      await service.checkAndNotifyDueEvents();

      expect(mockWhatsappService.sendMedicationReminder).toHaveBeenCalled();
      expect(mockPrisma.medicationEvent.update).toHaveBeenCalledWith({
        where: { id: 'evt-1' },
        data: { notifiedApp: true, notifiedWa: true },
      });
    });
  });
});
