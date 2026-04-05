import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsCron {
  private readonly logger = new Logger(NotificationsCron.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'medication-notifications',
    timeZone: 'America/Sao_Paulo',
  })
  async handleMedicationNotifications() {
    this.logger.debug('⏰ Checking for due medication events...');
    try {
      await this.notificationsService.checkAndNotifyDueEvents();
    } catch (error) {
      this.logger.error('Error in medication notification CRON:', error);
    }
  }
}
