import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsCron } from './notifications.cron';
import { NotificationsService } from './notifications.service';

describe('NotificationsCron', () => {
  let cron: NotificationsCron;
  let service: NotificationsService;

  const mockNotificationsService = {
    checkAndNotifyDueEvents: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsCron,
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    cron = module.get<NotificationsCron>(NotificationsCron);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(cron).toBeDefined();
  });

  describe('handleMedicationNotifications', () => {
    it('should call service checkAndNotifyDueEvents', async () => {
      await cron.handleMedicationNotifications();
      expect(service.checkAndNotifyDueEvents).toHaveBeenCalled();
    });

    it('should catch and log errors', async () => {
      mockNotificationsService.checkAndNotifyDueEvents.mockRejectedValue(new Error('fail'));
      await expect(cron.handleMedicationNotifications()).resolves.not.toThrow();
    });
  });
});
