import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsController, NotificationsCronController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsCron } from './notifications.cron';
import { WhatsappService } from './whatsapp.service';
import { WhatsappWebhookController } from './whatsapp-webhook.controller';
import { WhatsappWebhookService } from './whatsapp-webhook.service';
import { DatabaseModule } from '../../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule, ScheduleModule.forRoot()],
  controllers: [
    NotificationsController,
    NotificationsCronController,
    WhatsappWebhookController,
  ],
  providers: [
    NotificationsService,
    NotificationsCron,
    WhatsappService,
    WhatsappWebhookService,
  ],
  exports: [NotificationsService, WhatsappService, WhatsappWebhookService],
})
export class NotificationsModule {}

