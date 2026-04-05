import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsController, NotificationsCronController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsCron } from './notifications.cron';
import { DatabaseModule } from '../../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule, ScheduleModule.forRoot()],
  controllers: [NotificationsController, NotificationsCronController],
  providers: [NotificationsService, NotificationsCron],
  exports: [NotificationsService],
})
export class NotificationsModule {}
